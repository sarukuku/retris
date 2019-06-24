import ReactGA from "react-ga"
import { Analytics, EventArgs } from "./types"

export interface AnalyticsArgs {
  trackingCode: string
  debugMode: boolean
}

export class GoogleAnalytics implements Analytics {
  constructor({ trackingCode, debugMode }: AnalyticsArgs) {
    ReactGA.initialize(trackingCode, { debug: debugMode })
  }

  sendPageView(pageURL: string): void {
    ReactGA.pageview(pageURL)
  }

  sendCustomEvent({ action, category, label, value }: EventArgs): void {
    ReactGA.event({
      action,
      category,
      label,
      value,
    })
  }
}
