export const clientConfig = {
  googleAnalytics: {
    trackingCode: process.env.GA_TRACKING_CODE || "UA-XXXXXX-X",
    debugMode: process.env.GA_DEBUG_MODE === "true",
  },
}
