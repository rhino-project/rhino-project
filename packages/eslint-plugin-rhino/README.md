## eslint-plugin-rhino

Eslint plugin for rhino-project

### Installation

You'll first need to install [ESLint](https://eslint.org/):

```sh
npm i eslint --save-dev
```

Next, install `@rhino-project/eslint-plugin-rhino`:

```sh
npm install @rhino-project/eslint-plugin-rhino --save-dev
```

### Usage

Add `eslint-plugin-rhino` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
  "plugins": ["@rhino-project/rhino"]
}
```

#### Recommended

To use the recommended configuration, extend it in your `.eslintrc` file:

```json
{
  "extends": ["plugin:@rhino-project/rhino/recommended"]
}
```

All recommend rules will be set to error by default. You can however disable some rules by setting turning them `off` in your `.eslintrc` file or by setting them to `warn` in your `.eslintrc`.

#### all

To use the all configuration, extend it in your `.eslintrc` file:

```json
{
  "extends": ["plugin:@rhino-project/rhino/all"]
}
```
