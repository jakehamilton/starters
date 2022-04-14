const { default: littlelog } = require("@littlethings/log");

module.exports = littlelog.child("Starters").child("Core");
