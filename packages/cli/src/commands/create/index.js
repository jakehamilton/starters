const log = require("../../util/log");
const help = require("./help");
const getArgs = require("./args");
const core = require("@starters/core");

const command = async () => {
    const args = getArgs();

    if (args["--help"]) {
        help();
        process.exit(0);
    }

    if (args._.length !== 2) {
        log.error("Expected a project path, but got nothing.");
        help();
        process.exit(1);
    }

    if (!args["--template"]) {
        log.error("Expected a template name, but got nothing.");
        help();
        process.exit(1);
    }

    try {
        await core.create(args._[1], args["--template"], args["--name"]);
    } catch (error) {
        log.error("Could not create project.");
        log.debug(error.message);
        log.debug(error.stack);
        process.exit(1);
    }
};

module.exports = command;
