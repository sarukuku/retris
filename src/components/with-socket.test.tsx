import React from "react"
import TestRenderer from "react-test-renderer"
import { withSocket, Socket } from "./with-socket"

test("invokes connect on mount", () => {
  const on = jest.fn()
  const Component = withSocket(() => <div />, () => createSocket({ on }))

  TestRenderer.create(<Component />)

  expect(on).toHaveBeenCalledWith("connect", expect.anything())
})

test("invokes close on unmount", () => {
  const on = (_event: string, handler: () => void) => handler()
  const close = jest.fn()
  const Component = withSocket(() => <div />, () => createSocket({ on, close }))
  const testRenderer = TestRenderer.create(<Component />)

  testRenderer.unmount()

  expect(close).toHaveBeenCalled()
})

test("passes socket to component upon render", () => {
  const on = (_event: string, handler: () => void) => handler()
  const renderComponent = jest.fn(() => <div />)
  const socket = createSocket({ on })
  const Component = withSocket(renderComponent, () => socket)

  TestRenderer.create(<Component />)

  expect(renderComponent).toHaveBeenCalledWith({ socket }, expect.anything())
})

test("render null if socket is not connected", () => {
  const Component = withSocket(() => <div />, () => createSocket())

  const testRenderer = TestRenderer.create(<Component />)

  expect(testRenderer.toJSON()).toEqual(null)
})

function createSocket({
  on = () => undefined,
  emit = () => undefined,
  close = () => undefined,
}: Partial<Socket> = {}): Socket {
  return {
    on,
    emit,
    close,
  }
}
