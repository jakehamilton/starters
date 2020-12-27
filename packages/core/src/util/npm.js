const parseNameWithVersion = (name) => {
    const match = /(?<name>@?[^@]+)(?:@(?<version>.+))?/.exec(name);

    if (match) {
        return {
            name: match.groups.name,
            version: match.groups.version || "latest",
        };
    } else {
        throw new Error(`Unable to parse package name with version "${name}".`);
    }
};

module.exports = {
    parseNameWithVersion,
};
