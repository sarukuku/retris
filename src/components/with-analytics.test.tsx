import React from "react"
import TestRenderer from "react-test-renderer"
import { Analytics } from "../analytics"
import { AnalyticsContext } from "./contexts"
import { withAnalytics } from "./with-analytics"

test("translate HOC", () => {
  const renderComponent = jest.fn(() => <div />)
  const Component = withAnalytics(renderComponent)
  const analytics: Analytics = {
    sendPageView: () => undefined,
    sendCustomEvent: () => undefined,
  }

  TestRenderer.create(
    <AnalyticsContext.Provider value={analytics}>
      <Component />
    </AnalyticsContext.Provider>,
  )

  expect(renderComponent).toHaveBeenCalledWith({ analytics }, expect.anything())
})
