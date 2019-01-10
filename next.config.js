require("dotenv").config()

const webpack = require("webpack")
const path = require("path")
const withTypescript = require("@zeit/next-typescript")
const withCSS = require("@zeit/next-css")
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin")

module.exports = withTypescript(
  withCSS({
    distDir: "../dist",
    webpack(config, options) {
      // Do not run type checking twice:
      if (options.isServer) {
        config.plugins.push(
          new ForkTsCheckerWebpackPlugin({
            tsconfig: path.join(__dirname, "./tsconfig.json"),
          }),
        )
      }

      config.plugins.push(
        new webpack.EnvironmentPlugin({
          GA_TRACKING_CODE: process.env.GA_TRACKING_CODE,
          GA_DEBUG_MODE: process.env.GA_DEBUG_MODE,
          BUGSNAG_CLIENT_ID: process.env.BUGSNAG_CLIENT_ID,
        }),
      )

      return config
    },
  }),
)
