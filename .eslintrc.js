module.exports = {
  "env": {
    "browser": true,
    "es6": true
  },
  "extends": [
    "eslint:recommended",
    "plugin:react/recommended"
    ],
  "globals": {
    "Atomics": "readonly",
    "SharedArrayBuffer": "readonly",
    "isProduction": "readonly"
  },
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 2019,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  "plugins": [
    "react"
  ],
  "rules": {
    "no-prototype-builtins": 'off',
    "no-redeclare": 'warn',
    "no-unused-vars": "warn",
    "no-useless-escape": "off",
    "react/display-name": "off"
  },
  "overrides": [
    {
      files: [
        "**/webpack.config.js",
        "demo/src/catalog/**/*.js"
      ],
      "env": {
        "node": true,
      },
      "parserOptions": {
        "ecmaVersion": 2018,
        "sourceType": "script",
        "ecmaFeatures": {
          "jsx": false
        }
      },
    },
    {
      files: [
        "demo/src/catalog/**/*.jsx"
      ],
      "globals": {
        "require": "readonly"
      },
      rules: {
        'no-unused-vars': 'off',
        'react/prop-types': 'off'
      }
    }
  ]
};
