import ReactGA from "react-ga"
import { isBrowser } from "../helpers"
import { Analytics, EventArgs } from "./analytics"

interface Args {
  trackingCode: string
  debugMode: boolean
}

export class GoogleAnalytics implements Analytics {
  private isInited = false
  private trackingCode: string
  private debugMode: boolean

  constructor({ trackingCode, debugMode }: Args) {
    this.trackingCode = trackingCode
    this.debugMode = debugMode
  }

  sendPageView(pageURL: string): void {
    this.withInitializedTracker(() => {
      ReactGA.pageview(pageURL)
    })
  }

  sendCustomEvent({ action, category, label, value }: EventArgs): void {
    this.withInitializedTracker(() => {
      ReactGA.event({
        action,
        category,
        label,
        value,
      })
    })
  }

  private withInitializedTracker(fn: () => void) {
    if (this.isInited) {
      return fn()
    }

    if (!isBrowser()) {
      return
    }

    ReactGA.initialize(this.trackingCode, { debug: this.debugMode })
    this.isInited = true
  }
}
