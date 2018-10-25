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
  private state: DisplayState | undefined

  constructor(private namespace: Namespace) {}

  add(): void {
    return // automatically handled by socketio
  }

  remove(): void {
    return // automatically handled by socketio
  }

  updateState(state: DisplayState): void {
    const currentState = this.getState()
    this.state = { ...currentState, ...state }
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
  constructor(private namespace: Namespace) {}

  add(): void {
    return // automatically handled by socketio
  }

  remove(): void {
    return // automatically handled by socketio
  }

  updateState(state: ControllerState): void {
    this.namespace.emit("state", state)
  }
}

export class SocketIODisplay implements Display {
  constructor(private socket: Socket) {}

  updateState(state: DisplayState): void {
    this.socket.emit("state", state)
  }
}

export class SocketIOController implements Controller {
  constructor(private socket: Socket) {}

  updateState(state: ControllerState): void {
    this.socket.emit("state", state)
  }
}
