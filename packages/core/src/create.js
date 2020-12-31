const copy = require("copy-dir");
const which = require("npm-which")(process.cwd());
const enquirer = require("enquirer");
const kleur = require("kleur");
const isUrl = require("is-url");
const fs = require("./util/fs");
const npm = require("./util/npm");
const cmd = require("./util/cmd");
const path = require("./util/path");
const log = require("./util/log");
const misc = require("./util/misc");

const create = async (
    where,
    template,
    name = "",
    options = {},
    cache = path.resolve(require("os").homedir(), ".starters")
) => {
    const resolvedPath = path.resolveRelative(where);

    if (fs.exists(resolvedPath)) {
        if (fs.isDir(resolvedPath)) {
            if (fs.isEmpty(resolvedPath)) {
                fs.rm(resolvedPath);
            } else {
                log.error(`Directory is not empty: ${resolvedPath}`);
                throw new Error(`Directory is not empty: ${resolvedPath}`);
            }
        }
    }

    if (isUrl(template) || misc.isSSH(template)) {
        // Git repository
        try {
            log.info("Cloning repository.");
            log.info(kleur.blue("==============================="));
            cmd.exec(`git clone ${template} ${resolvedPath}`, {
                encoding: "utf8",
                stdio: "inherit",
            });
            log.info(kleur.blue("==============================="));
        } catch (error) {
            log.error("Error cloning repository.");
            throw error;
        }

        // @NOTE(jakehamilton): This should be removed once templates have been updated.
        const legacyConfigPath = path.resolve(resolvedPath, ".starter");

        const configPath =
            fs.exists(legacyConfigPath) && fs.isDir(legacyConfigPath)
                ? legacyConfigPath
                : path.resolve(resolvedPath, ".starters");

        if (
            fs.exists(path.resolve(configPath, "index.js")) ||
            fs.exists(path.resolve(configPath, "package.json"))
        ) {
            log.debug(`Found configuration in "${configPath}".`);
            try {
                const config = require(configPath);

                if (typeof config === "function") {
                    log.info("Running configuration script.");
                    await config({
                        inquirer: enquirer,
                        enquirer,
                        render: require("render-in-place").default,
                        fs: require("fs"),
                        rimraf: require("rimraf"),
                        where,
                        name,
                        which,
                        copy,
                        options,
                    });
                    log.info("Configuration complete.");
                } else {
                    throw new Error(
                        `TypeError: Expected a function but got "${typeof config}".`
                    );
                }
            } catch (error) {
                log.error(
                    `Could not import configuration from "${configPath}".`
                );
                throw error;
            }
        } else {
            log.debug(`No configuration found in "${configPath}".`);
        }
    } else if (
        path.isPath(template) &&
        (template.startsWith(".") || path.isAbsolute(template))
    ) {
        const dir = path.resolveRelative(template);

        if (!fs.exists(dir)) {
            throw new Error(`Directory "${dir}" does not exist.`);
        }

        if (!fs.isDir(dir)) {
            throw new Error(`Directory "${dir}" does not exist.`);
        }

        try {
            copy.sync(dir, where);
        } catch (error) {
            log.error(`Could not copy directory "${dir}".`);
            throw error;
        }

        // @NOTE(jakehamilton): This should be removed once templates have been updated.
        const legacyConfigPath = path.resolve(resolvedPath, ".starter");

        const configPath =
            fs.exists(legacyConfigPath) && fs.isDir(legacyConfigPath)
                ? legacyConfigPath
                : path.resolve(resolvedPath, ".starters");

        if (
            fs.exists(path.resolve(configPath, "index.js")) ||
            fs.exists(path.resolve(configPath, "package.json"))
        ) {
            log.debug(`Found configuration in "${configPath}".`);
            try {
                const config = require(configPath);

                if (typeof config === "function") {
                    log.info("Running configuration script.");
                    await config({
                        inquirer: enquirer,
                        enquirer,
                        render: require("render-in-place").default,
                        fs: require("fs"),
                        rimraf: require("rimraf"),
                        where,
                        name,
                        which,
                        copy,
                        options,
                    });
                    log.info("Configuration complete.");
                } else {
                    throw new Error(
                        `TypeError: Expected a function but got "${typeof config}".`
                    );
                }
            } catch (error) {
                log.error(
                    `Could not import configuration from "${configPath}".`
                );
                throw error;
            }
        } else {
            log.debug(`No configuration found in "${configPath}".`);
        }
    } else {
        // NPM package
        const { name: pkgName, version } = npm.parseNameWithVersion(template);

        log.info("Installing package.");

        if (!fs.exists(cache)) {
            fs.mkdir(cache);
        }

        try {
            await cmd.exec(
                `${which.sync("npm")} install --prefix ${cache} ${template}`,
                {
                    encoding: "utf8",
                    cwd: cache,
                    stdio: "ignore",
                }
            );
        } catch (error) {
            log.error(`Could not install package "${template}".`);
            throw error;
        }

        try {
            const config = require(path.resolve(
                cache,
                "node_modules",
                pkgName
            ));

            if (typeof config === "function") {
                log.info("Running configuration script.");
                await config({
                    inquirer: enquirer,
                    enquirer,
                    render: require("render-in-place").default,
                    fs: require("fs"),
                    rimraf: require("rimraf"),
                    where,
                    name,
                    which,
                    copy,
                    options,
                });
                log.info("Configuration complete.");
            } else if (
                typeof config === "object" &&
                config.hasOwnProperty("repository")
            ) {
                log.warn("This package is using a legacy format.");
                // @NOTE(jakehamilton): This is to handle legacy template packages.
                //  Once all packages upgrade, we can safely remove this option.
                return await create(
                    resolvedPath,
                    `git@github.com:${config.repository}`,
                    name,
                    options,
                    cache
                );
            } else {
                throw new Error(
                    `TypeError: Expected a function but got "${typeof config}".`
                );
            }
        } catch (error) {
            log.error(`Could not run package "${template}".`);
            throw error;
        }
    }

    log.info("Access your new project by running the following:");
    log.info(
        `  ${kleur.dim("$")} ${kleur.white("cd")} ${path.relative(
            process.cwd(),
            resolvedPath
        )}`
    );
};

module.exports = create;
