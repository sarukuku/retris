import { isBrowser } from "../helpers"
import { DummyAnalytics } from "./dummy-analytics"
import { GoogleAnalytics, AnalyticsArgs } from "./google-analytics"

export * from "./types"

export const createAnalytics = (args: AnalyticsArgs) => {
  return isBrowser() ? new GoogleAnalytics(args) : new DummyAnalytics()
}
