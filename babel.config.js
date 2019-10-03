module.exports = {
  "plugins": [
    "@babel/plugin-proposal-object-rest-spread",
    [ "@babel/plugin-proposal-decorators", { "legacy": true } ],
    "@babel/plugin-proposal-class-properties",
    "import-glob",
    [
      "@babel/plugin-transform-runtime",
      {
        "corejs": 2
      }
    ]
  ],
  "env": {
    "commonjs": {
      "presets": [
        "@babel/preset-env",
        "@babel/preset-react"
      ]
    },
    "es": {
      "presets": [
        [
          "@babel/preset-env",
          {
            "modules": false
          }
        ],
        "@babel/preset-react"
      ]
    }
  }
}
