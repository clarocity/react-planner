module.exports = {
    "env": {
        "browser": true,
        "es6": true
    },
    "extends": "eslint:recommended",
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parser": "babel-eslint",
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true
        },
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
    "plugins": [
        "react"
    ],
    "rules": {
      "no-prototype-builtins": 'off',
      "no-redeclare": 'warn',
      "no-unused-vars": "warn",
      "no-useless-escape": "off",
    },
    "overrides": [
      {
        files: [
          "**/webpack.config.js",
        ],
        "env": {
          "node": true,
        },
        "parserOptions": {
          "ecmaVersion": 6,
          "sourceType": "script",
          "ecmaFeatures": {
            "jsx": false
          }
        },
      }
    ]
};
