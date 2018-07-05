@starters/cli
=============

🚀 Get your next project off the ground quickly
with [@starters/cli](https://github.com/jakehamilton/starters)!

Install
-------

```shell
# via npm
npm i -g @starters/cli

# via yarn
yarn global add @starters/cli
```

Usage
-----

```shell
starter create <template> [<where>]
```

The `<template>` argument is either:

+ An npm package name (eg. `@starters/typescript`)
+ A GitHub username and repository (eg. `jakehamilton/starter-typescript`)

The `<where>` argument is an optional path to where the template should be installed.

Creating A Template
-------------------

### GitHub Templates

A GitHub template is simply a repository that will be cloned onto the user's machine. For initial configuration, you may add a JavaScript file at `.starter/index.js` in your repository. This file will be called once the template has been downloaded.

#### Example

##### .starter/index.js

```shell
const path = require('path');

module.exports = function ({ inquirer, render, where }) {
    inquirer.prompt([
        { 
            type: 'input',
            name: 'name',
            message: 'Module Name',
        },
    ]).then(function (answers) {
        const package = path.resolve(where, 'package.json');

        return render(package, answers)
    });
}
```

##### package.json

```json
{
    "name": "<%= name %>"
    ...
}
```

#### Types

The exported function receives an options argument with the following type signature:

```typescript
interface options {
    inquirer: Inquirer;
    render: RenderInPlace;
    fs: FS;
    rimraf: Rimraf;
    where: string;
}
```

`inquirer` is from the [inquirer](https://www.npmjs.com/package/inquirer) module.  
`render` is from the [render-in-place](https://www.npmjs.com/package/render-in-place) module.
`fs` is from the [fs-extra](https://www.npmjs.com/package/fs-extra) module.
`rimraf` is from the [rimraf](https://www.npmjs.com/package/rimraf) module.

## npm templates

An npm template exists as an npm module which has full control over how to create and install its template. To create an npm template, all you need to do is publish an npm module that exports a single function. When a user installs your template, your module will be installed and its function invoked.

#### Example

```typescript
import * as fs from 'fs';
import * as path from 'path';

export default ({ where }) => {
    fs.writeFileSync(
        path.resolve(where, 'README.md'),
        '# Hello World!'
    );
}
```

#### Types

The exported function receives an options argument with the following type signature:

```typescript
interface options {
    where: string;
}
```
