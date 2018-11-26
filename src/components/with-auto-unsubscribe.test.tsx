import React from "react"
import TestRenderer from "react-test-renderer"
import { withAutoUnsubscribe } from "./with-auto-unsubscribe"

test("unsubscribe spy on component unmount", () => {
  const spy = { unsubscribe: jest.fn() }

  const Component = withAutoUnsubscribe(({ unsubscribeOnUnmount }) => {
    unsubscribeOnUnmount(spy)
    return <div />
  })
  const testRenderer = TestRenderer.create(<Component />)
  testRenderer.unmount()

  expect(spy.unsubscribe).toHaveBeenCalled()
})
