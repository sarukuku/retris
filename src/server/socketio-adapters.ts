import { Namespace, Socket } from "socket.io"
import {
  Displays,
  DisplayState,
  Controllers,
  Display,
  Controller,
  ControllerState,
} from "./state"

export class SocketIODisplays implements Displays {
  private state: DisplayState

  constructor(private namespace: Namespace) {}

  add(): void {
    return
  }
  remove(): void {
    return
  }
  updateState(state: Partial<DisplayState>): void {
    const previousState = this.state || {}
    this.state = { ...previousState, ...state }
    this.namespace.emit("state", state)
  }
  sendAction(action: string): void {
    this.namespace.emit("action", action)
  }
  getState(): DisplayState | undefined {
    return this.state
  }
}

export class SocketIOControllers implements Controllers {
  add(): void {
    return
  }
  remove(): void {
    return
  }
}

export class SocketIODisplay implements Display {
  constructor(private socket: Socket) {}

  updateState(state: Partial<DisplayState>): void {
    this.socket.emit("state", state)
  }
}

export class SocketIOController implements Controller {
  constructor(private socket: Socket) {}

  updateState(state: Partial<ControllerState>): void {
    this.socket.emit("state", state)
  }
}
