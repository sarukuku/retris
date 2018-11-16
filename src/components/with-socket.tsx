import React from "react"
import io from "socket.io-client"
import { WithoutProps } from "./without-props"

type Socket = typeof io.Socket

export interface SocketProps {
  socket: Socket
}

interface SocketState {
  socket?: Socket
}

type WithoutSocketProps<Props> = WithoutProps<Props, SocketProps>

export function withSocket<Props>(
  Component: React.ComponentType<Props & SocketProps>,
  uri: string,
): React.ComponentType<WithoutSocketProps<Props>> {
  class WithSocket extends React.Component<
    WithoutSocketProps<Props>,
    SocketState
  > {
    state: SocketState = {}

    componentDidMount() {
      const socket = io(uri)

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
