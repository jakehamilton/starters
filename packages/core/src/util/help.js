const kleur = require("kleur");

const help = () => {
    const message = `
${kleur.bold("DESCRIPTION")}

    Manage monorepo projects.

${kleur.bold("USAGE")}

    ${kleur.dim("$")} ${kleur.bold("starters")} <command> [options]

${kleur.bold("COMMANDS")}

    create                    Create a new project

${kleur.bold("OPTIONS")}

    --help, -h                Show this help message
    --verbose, -v             Set logging verbosity

${kleur.bold("EXAMPLE")}

    ${kleur.dim("$ # Get help for commands.")}
    ${kleur.dim("$")} ${kleur.bold("starter create")} --help

    ${kleur.dim("$ # Run Starters with verbose logging.")}
    ${kleur.dim("$")} ${kleur.bold("starter create")} -v
    ${kleur.dim("$")} ${kleur.bold("starter create")} -vv
    ${kleur.dim("$")} ${kleur.bold("starter create")} -vvv

    ${kleur.dim("$ # Run Starters with no logging.")}
    ${kleur.dim("$")} LOG_LEVEL=SILENT ${kleur.bold("starters")}
`;

    console.log(message);
};

module.exports = help;
