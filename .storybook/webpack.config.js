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
    new webpack.EnvironmentPlugin({ STATIC_PATH: process.env.STATIC_PATH }),
  )

  return config
}
