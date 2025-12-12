# ESLint Plugin - React Render Checkup

Static analysis rules to catch React performance issues during development.

## Installation

```bash
npm install --save-dev eslint-plugin-react-render-checkup
```

## Usage

Add to your `.eslintrc.js`:

```javascript
module.exports = {
  plugins: ["react-render-checkup"],
  extends: ["plugin:react-render-checkup/recommended"],
};
```

Or configure rules individually:

```javascript
module.exports = {
  plugins: ["react-render-checkup"],
  rules: {
    "react-render-checkup/no-inline-function-props": "warn",
    "react-render-checkup/exhaustive-deps": "error",
    "react-render-checkup/require-stable-deps": "warn",
  },
};
```

## Rules

| Rule                                                                 | Description                                       | Recommended |
| -------------------------------------------------------------------- | ------------------------------------------------- | ----------- |
| [no-inline-function-props](./docs/rules/no-inline-function-props.md) | Disallow inline functions/objects/arrays as props | ⚠️ warn     |
| [exhaustive-deps](./docs/rules/exhaustive-deps.md)                   | Ensure hook dependencies are complete             | ❌ error    |
| [require-stable-deps](./docs/rules/require-stable-deps.md)           | Suggest memoization for unstable dependencies     | ⚠️ warn     |

## Configurations

### Recommended

```javascript
{
  "extends": ["plugin:react-render-checkup/recommended"]
}
```

This enables all rules with their recommended severity levels.

## Examples

See the [example](../../example) directory for a working demonstration.
