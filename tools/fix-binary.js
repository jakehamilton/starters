#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const BIN_ENTRY = path.resolve(__dirname, '..', 'dist', 'index.js');

const contents = fs.readFileSync(BIN_ENTRY).toString();

fs.writeFileSync(
    BIN_ENTRY,
    `#!/usr/bin/env node

${contents}`,
);
