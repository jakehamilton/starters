const arg = require("arg");
const rootArgs = require("../../util/args");

const getArgs = () =>
    arg(
        {
            ...rootArgs,

            "--template": String,

            "-t": "--template",
        },
        {
            permissive: false,
        }
    );

module.exports = getArgs;
