export const clientConfig = {
  googleAnalytics: {
    trackingCode: process.env.GA_TRACKING_CODE || "UA-XXXXXXXXX-X",
    debugMode: process.env.GA_DEBUG_MODE === "true",
  },
  bugsnagClientId: process.env.BUGSNAG_CLIENT_ID || "",
  staticPath: typeof process.env.STATIC_PATH === "undefined" ? "/static" : "",
}
