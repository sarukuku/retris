import ReactGA from "react-ga"
import { isBrowser } from "../helpers"
import { Analytics, EventArgs } from "./analytics"

interface Args {
  trackingCode: string
  debugMode: boolean
}

export class GoogleAnalytics implements Analytics {
  constructor({ trackingCode, debugMode }: Args) {
    ReactGA.initialize(trackingCode, { debug: debugMode })
  }

  sendPageView(pageURL: string): void {
    if (isBrowser()) {
      ReactGA.pageview(pageURL)
    }
  }

  sendCustomEvent({ action, category, label, value }: EventArgs): void {
    if (isBrowser()) {
      ReactGA.event({
        action,
        category,
        label,
        value,
      })
    }
  }
}
