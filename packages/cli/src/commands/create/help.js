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
    --name, -n                The name for the package.

${kleur.bold("EXAMPLE")}

    ${kleur.dim("$ # Create a new JavaScript library.")}
    ${kleur.dim("$")} ${kleur.bold(
        "starters"
    )} create my-library --template @starters/library

    ${kleur.dim(
        `$ # Create a new JavaScript library using the package name "my-package".`
    )}
    ${kleur.dim("$")} ${kleur.bold(
        "starters"
    )} create my-library --template @starters/library --name my-package
`;

    console.log(message);
};

module.exports = help;
