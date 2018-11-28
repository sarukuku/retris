import React from "react"
import TestRenderer from "react-test-renderer"
import { commands } from "../commands"
import { Socket, withSocket } from "./with-socket"

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

test("invokes next() upon socket data coming from server", () => {
  const statePayload = "foo"
  const actionPayload = "bar"
  const on = (_event: string, handler: (payload?: any) => void) => {
    if (_event === "connect") {
      return handler()
    }
    if (_event === "state") {
      return handler(statePayload)
    }
    if (_event === commands.ACTION) {
      return handler(actionPayload)
    }
  }
  const socket = createSocket({ on })
  const subscribeSpy = jest.fn()
  const Component = withSocket(
    ({ socket: socketSubject }) => {
      socketSubject.subscribe(subscribeSpy)
      return <div />
    },
    () => socket,
  )

  TestRenderer.create(<Component />)

  expect(subscribeSpy).toHaveBeenCalledWith({
    event: "state",
    payload: statePayload,
  })
  expect(subscribeSpy).toHaveBeenCalledWith({
    event: commands.ACTION,
    payload: actionPayload,
  })
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
