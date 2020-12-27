const isSSH = (string) => {
    const regex = /\w+@[^\:]+:(?:.+)?/;

    return string.match(regex);
};

module.exports = {
    isSSH,
};
