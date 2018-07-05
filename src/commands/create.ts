import * as path from 'path';
import * as fs from 'fs-extra';
import * as rimraf from 'rimraf';
import { promisify } from 'util';
import * as homedir from 'homedir';
import * as cp from 'child_process';
import * as inquirer from 'inquirer';
import * as gitclone from 'git-clone';
import * as npmwhich from 'npm-which';
import * as exists from 'command-exists';
import render from 'render-in-place';

import log from '../lib/log';
import fail from '../lib/fail';
import {
    ERROR_MKDIR,
    ERROR_RMDIR,
    ERROR_REQUIRE,
    ERROR_INVALID_CONFIG,
    ERROR_GIT_CLONE,
} from '../lib/codes';

const rm = promisify(rimraf);
const exec = promisify(cp.exec);
const spawn = promisify(cp.spawn);
const which = promisify(npmwhich(process.cwd()));
const clone = promisify(gitclone);

interface ICreateCommand {
    cache: boolean;
}

interface ICreator {
    location: string;
    module?:
        | ((options: { where: string }) => Promise<any> | void)
        | { repository: string };
    package?: {};
}

interface IStarter {
    entry?: (
        options: {
            inquirer: inquirer.Inquirer;
            render: typeof render;
            fs: typeof fs;
            rimraf: typeof rimraf;
            where: string;
        },
    ) => void;
}

interface IPacMan {
    manager: 'yarn' | 'npm';
    install: 'add' | 'install';
    command: string;
}

const cache = `${homedir()}/.create`;

const pacman: IPacMan = {
    manager: exists('yarn') ? 'yarn' : 'npm',

    // @ts-ignore
    get command () {
        return which(this.manager);
    },

    // @ts-ignore
    get install () {
        switch (this.manager) {
            case 'yarn':
                return 'add';
            case 'npm':
            default:
                return 'install';
        }
    },
};

const create = async (
    subcommand: 'create',
    name: string,
    where: string,
    command: ICreateCommand,
) => {
    const git = name.split('/').length > 1 && name[0] !== '@';

    const creator: ICreator = {
        location: path.resolve(cache, 'node_modules', name),
        module: undefined,
        package: undefined,
    };

    const template = {
        name: name.split('/').length > 1 ? name.split('/')[1] : name,
        location: where
            ? path.isAbsolute(where)
              ? where
              : path.resolve(process.cwd(), where)
            : path.resolve(
                  process.cwd(),
                  name.split('/').length > 1 ? name.split('/')[1] : name,
              ),
    };

    log.clear();
    log.write(`  👷 Creating cache directory`);

    try {
        await fs.mkdirp(cache);
    } catch (error) {
        log.write(`❌ 👷 Failed to create cache directory`);
        log.clear();
        fail(
            ERROR_MKDIR,
            `Could not create a cache directory at ${cache} due to an error:\n${JSON.stringify(
                error,
                null,
                2,
            )}`,
        );
    }

    log.write(`✔ 👷 Created cache directory`);

    // @ts-ignore
    if (await fs.exists(creator.location)) {
        log.write(`  🗑️ Removing old configuration`);

        try {
            await rm(creator.location);
        } catch (error) {
            log.write(`❌ 🗑️ Failed to remove old configuration`);
            log.clear();
            fail(
                ERROR_RMDIR,
                `Could not remove directory at ${creator.location} due to an error:\n${JSON.stringify(
                    error,
                    null,
                    2,
                )}`,
            );
        }

        log.write(`✔ 🗑️ Removed old configuration`);

        log.clear();
    }

    if (git) {
        log.write(`  🚚 Fetching template`);

        try {
            await clone(`https://github.com/${name}`, template.location, {
                shallow: true,
            });
        } catch (error) {
            log.write(`❌ 🚚 Failed fetching template`);
            log.clear();

            fail(
                ERROR_GIT_CLONE,
                `Could not clone repository at url ${`https://github.com/${name}`} due to an error:\n${JSON.stringify(
                    error,
                    null,
                    2,
                )}`,
            );
        }

        log.write(`✔ 🚚 Fetched template`);
        log.clear();

        const starter: IStarter = {
            entry: undefined,
        };

        if (
            // @ts-ignore
            await fs.exists(
                path.resolve(template.location, '.starter', 'index.js'),
            )
        ) {
            try {
                starter.entry = require(path.resolve(
                    template.location,
                    '.starter',
                    'index.js',
                ));

                if (
                    (starter.entry as any).__esModule &&
                    (starter.entry as any).default
                ) {
                    starter.entry = (starter.entry as any).default;
                }
            } catch (error) {
                fail(
                    ERROR_REQUIRE,
                    `Could not import module at ${path.resolve(
                        template.location,
                        '.starter',
                        'index.js',
                    )} due to an error:\n${JSON.stringify(error, null, 2)}`,
                );
            }
        }

        if (starter.entry) {
            log.write(`  🏃 Running setup script`);
            log.clear();

            await starter.entry({ inquirer, render, fs, rimraf, where });

            log.write(`✔ 🏃 Ran setup script`);
            log.clear();
        }

        log.write(`  🗄 Tidying up`);

        try {
            await rm(path.resolve(template.location, '.git'));
        } catch (error) {
            log.write(`  🗄 Failed tidying up`);
            fail(
                ERROR_RMDIR,
                `Could not remove directory at ${path.resolve(
                    template.location,
                    '.git',
                )} due to an error:\n${JSON.stringify(error, null, 2)}`,
            );
        }

        log.write(`✔ 🗄 Tidied up`);
        log.clear();

        log.write(`🎉 Done!`);
        log.clear();
    } else {
        // Full control configuration via npm module
        log.write(`  📦 Installing custom configuration`);

        const {
            stdout,
        } = await exec(`${await pacman.command} ${pacman.install} ${name}`, {
            cwd: cache,
        });

        log.write(`✔ 📦 Installed custom configuration`);

        log.clear();

        log.write(`  📑 Reading configuration`);

        try {
            creator.module = require(creator.location);
            creator.package = require(path.resolve(
                creator.location,
                'package.json',
            ));

            if (
                (creator.module as any).__esModule &&
                (creator.module as any).default
            ) {
                creator.module = (creator.module as any).default;
            }
        } catch (error) {
            log.write(`❌ 📑 Failed reading configuration`);
            log.clear();

            fail(
                ERROR_REQUIRE,
                `Could not import module at ${path.resolve(
                    cache,
                    'node_modules',
                    name,
                )} due to an error:\n${JSON.stringify(error, null, 2)}`,
            );
        }

        log.write(`✔ 📑 Read configuration`);
        log.clear();

        log.write(`  👷 Running configuration`);
        log.clear();

        if (typeof creator.module === 'function') {
            await creator.module({
                where,
            });
        }

        if (typeof creator.module === 'object') {
            if ((creator.module as any).repository) {
                await create(
                    subcommand,
                    (creator.module as any).repository,
                    where,
                    command,
                );
            }
        }

        log.write(`✔ 👷 Ran configuration`);
        log.clear();

        log.write(`🎉 Done!`);
        log.clear();
    }
};

export default create;
