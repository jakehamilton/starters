const isSSH = (string) => {
    const regex = /\w+@[^\:]+:(?:.+)?/;

    return Boolean(string.match(regex));
};

module.exports = {
    isSSH,
};
