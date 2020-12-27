# @starters/core

This module contains the internals for handling starter templates.

## Install

```shell
npm install --save @starters/core
```

## Usage

```js
const starters = require("@starters/core");

await starters.create("/path/to/project", "my-template-name");
```

### `starters.create(where, template)`

This function creates a new project from a template. The `where` parameter is a path
to the location that the project should be created at. The `template` parameter is either
the name of an NPM package _or_ the address of a Git repository.

Here are some examples for the `template` parameter:

```
my-npm-package
@my-scope/my-npm-package

git@github.com:my-user/my-project
```
