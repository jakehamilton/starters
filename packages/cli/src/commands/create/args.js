const arg = require("arg");
const rootArgs = require("../../util/args");

const getArgs = () =>
    arg(
        {
            ...rootArgs,

            "--name": String,
            "-n": String,

            "--template": String,
            "-t": "--template",
        },
        {
            permissive: false,
        }
    );

module.exports = getArgs;
