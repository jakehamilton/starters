import log from './log';

export default (code: number, description?: string) => {
    log.clear();
    log.write(`  ❗ Uh oh, we've run into an error with code "${code}"`);

    if (description) {
        log.clear();
        log.write(
            `  📖 Here's a description of what went wrong:\n\n${description}\n`,
        );
    }

    log.clear();
    log.write(
        '  💁 If you believe this is an error with the @starters/cli package,\n' +
            '    please file an issue: https://github.com/jakehamilton/starters/issues',
    );
    log.clear();

    process.exit(code);
};
