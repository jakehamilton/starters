# @starters/cli

🚀 Get your next project off the ground quickly
with [@starters/cli](https://github.com/jakehamilton/starters)!

## Install

```shell
npm install -g @starters/cli
```

## Usage

```shell
starters create <where> --template <template>
```

The `<where>` argument specifies where to create the project.

The `<template>` argument is either:

-   An NPM package name (eg. `@starters/typescript`)
-   A Git repository (eg. `git@github.com:jakehamilton/starter-typescript-template`)

## Creating A Template

### Git Templates

A Git template is simply a repository that will be cloned onto the user's machine. For initial configuration, you may add a JavaScript file at `.starter/index.js` in your repository. This file will be called once the template has been downloaded.

#### Example

##### .starter/index.js

> NOTE: This file should export a function that returns a promise.

```typescript
const path = require("path");

module.exports = function ({ inquirer, render, where }) {
    return inquirer
        .prompt([
            {
                type: "input",
                name: "name",
                message: "Module Name",
            },
        ])
        .then(function (answers) {
            const package = path.resolve(where, "package.json");

            return render(package, answers);
        });
};
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

## NPM templates

An NPM template exists as an NPM module which has full control over how to create and install its template. To create an NPM template, all you need to do is publish an NPM module that exports a single function. When a user installs your template, your module will be installed and its function invoked.

#### Example

```typescript
import * as fs from "fs";
import * as path from "path";

export default async ({ where }) => {
    fs.writeFileSync(path.resolve(where, "README.md"), "# Hello World!");
};
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
