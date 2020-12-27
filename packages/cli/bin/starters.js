#!/usr/bin/env node

try {
    require("@starters/cli");
} catch (error) {
    console.error(error);
    console.error(error.stack);
}
