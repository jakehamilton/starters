import * as readline from 'readline';

export default {
    write: (...messages: string[]) => {
        const message = messages.join(' ');

        readline.clearLine(process.stdout, 0);
        readline.cursorTo(process.stdout, 0);

        process.stdout.write(message);
    },
    clear: () => {
        process.stdout.write('\n');
    },
};
