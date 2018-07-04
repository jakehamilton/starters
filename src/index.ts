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
    .action(create);

program.parse(process.argv);
