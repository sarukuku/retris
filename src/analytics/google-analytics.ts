import ReactGA from "react-ga"
import { isBrowser } from "../helpers"
import { Analytics, EventArgs } from "./analytics"

export class GoogleAnalytics implements Analytics {
  private isInited = false

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

    ReactGA.initialize("UA-129134030-1")
    this.isInited = true
  }
}
