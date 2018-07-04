import * as fs from 'fs';
import * as path from 'path';
import * as program from 'commander';

import create from './commands/create';

program.executeSubCommand = () => false;

program.version(
    JSON.parse(
        fs.readFileSync(path.resolve(__dirname, '../package.json'), {
            encoding: 'utf8',
        }),
    ),
    '-v, --version',
);

program
    .command('create <name> [where]', 'Create a new project using a template')
    .action((...args) => {
        // I fucking hate Windows
        if (args.length < 4) {
            // @ts-ignore
            create(...args[0].trim().split(' '));
        } else {
            // @ts-ignore
            create(...args);
        }
    });

program.parse(process.argv);
