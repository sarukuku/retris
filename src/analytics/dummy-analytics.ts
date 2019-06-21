import { Analytics } from "./types"

const noOp = (): void => undefined

export class DummyAnalytics implements Analytics {
  sendPageView = noOp
  sendCustomEvent = noOp
}
