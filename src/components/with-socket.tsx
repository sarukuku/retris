import React, { ComponentType } from "react"
import { ReplaySubject } from "rxjs"
import { commands } from "../commands"
import { retainGetInitialProps } from "./retain-get-initial-props"
import {
  AutoUnsubscribeProps,
  withAutoUnsubscribe,
} from "./with-auto-unsubscribe"
import { WithoutProps } from "./without-props"

export interface Socket {
  on(event: string, handler: (...args: any[]) => void): void
  emit(event: string, payload?: string): void
  close(): void
}

export interface SocketPayload {
  event: string
  payload?: any
}

export interface SocketProps {
  socket: ReplaySubject<SocketPayload>
}

interface SocketState {
  didSocketConnect: boolean
}

type WithoutSocketProps<Props> = WithoutProps<Props, SocketProps>

export function withSocket<Props>(
  Component: ComponentType<Props & SocketProps>,
  createSocket: () => Socket,
): ComponentType<WithoutSocketProps<Props>> {
  class WithSocket extends React.Component<
    WithoutSocketProps<Props> & AutoUnsubscribeProps,
    SocketState
  > {
    state: SocketState = {
      didSocketConnect: false,
    }
    private socket: Socket
    private socketSubject = new ReplaySubject<SocketPayload>()

    componentDidMount() {
      this.socket = createSocket()
      this.socket.on("connect", () => {
        this.setupCommFromServer()
        this.setupCommToServer()
        this.setState({ didSocketConnect: true })
      })
    }

    private setupCommFromServer() {
      this.socket.on("state", payload => {
        this.socketSubject.next({ event: "state", payload })
      })
      this.socket.on(commands.ACTION, payload => {
        this.socketSubject.next({ event: commands.ACTION, payload })
      })
    }

    private setupCommToServer() {
      this.props.unsubscribeOnUnmount(
        this.socketSubject.subscribe(({ event, payload }) => {
          this.socket.emit(event, payload)
        }),
      )
    }

    componentWillUnmount() {
      if (this.socket) {
        this.socket.close()
      }
    }

    render() {
      const { didSocketConnect } = this.state
      if (!didSocketConnect) {
        return null
      }

      return <Component socket={this.socketSubject} {...this.props} />
    }
  }

  return withAutoUnsubscribe(WithSocket) as ComponentType<
    WithoutSocketProps<Props>
  >
}

export const pageWithSocket = retainGetInitialProps(withSocket)
