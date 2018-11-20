const { parsed: localEnv } = require("dotenv").config()
const webpack = require("webpack")
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin")

module.exports = (baseConfig, env, config) => {
  config.resolve.extensions.push(".ts", ".tsx")
  config.module.rules.push({
    test: /\.(ts|tsx)$/,
    loader: require.resolve("babel-loader"),
  })
  config.plugins.push(
    new ForkTsCheckerWebpackPlugin({
      tsconfig: "tsconfig.json",
      tslint: "tslint.json",
      formatter: "codeframe",
    }),
  )

  config.plugins.push(new webpack.EnvironmentPlugin(localEnv))

  return config
}
