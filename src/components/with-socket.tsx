import React, { ComponentType } from "react"
import { retainGetInitialProps } from "./retain-get-initial-props"
import { WithoutProps } from "./without-props"

export interface Socket {
  on(event: string, handler: (...args: any[]) => void): void
  emit(event: string, payload?: string): void
  close(): void
}

export interface SocketProps {
  socket: Socket
}

interface SocketState {
  socket?: Socket
}

type WithoutSocketProps<Props> = WithoutProps<Props, SocketProps>

export function withSocket<Props>(
  Component: ComponentType<Props & SocketProps>,
  createSocket: () => Socket,
): ComponentType<WithoutSocketProps<Props>> {
  class WithSocket extends React.Component<
    WithoutSocketProps<Props>,
    SocketState
  > {
    state: SocketState = {}

    componentDidMount() {
      const socket = createSocket()
      socket.on("connect", () => {
        this.setState({ socket })
      })
    }

    componentWillUnmount() {
      const { socket } = this.state
      if (socket) {
        socket.close()
      }
    }

    render() {
      const { socket } = this.state
      if (!socket) {
        return null
      }
      return <Component socket={socket} {...this.props} />
    }
  }

  return WithSocket
}

export const pageWithSocket = retainGetInitialProps(withSocket)
