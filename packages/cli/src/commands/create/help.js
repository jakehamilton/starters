const kleur = require("kleur");

const help = () => {
    const message = `
${kleur.bold("DESCRIPTION")}

    Create a new project from a template.

${kleur.bold("USAGE")}

    ${kleur.dim("$")} ${kleur.bold(
        "starters"
    )} create <path> --template <name> [options]

${kleur.bold("OPTIONS")}

    --help, -h                Show this help message
    --verbose, -v             Set logging verbosity
    --template, -t            The template to use.

${kleur.bold("EXAMPLE")}

    ${kleur.dim("$ # Create a new JavaScript library.")}
    ${kleur.dim("$")} ${kleur.bold(
        "starters"
    )} create my-library --template @starters/library
`;

    console.log(message);
};

module.exports = help;
