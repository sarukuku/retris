import { Namespace, Socket } from "socket.io"
import { commands } from "../commands"
import { Logger } from "../logger"
import {
  Controller,
  Controllers,
  ControllerState,
  Display,
  Displays,
  DisplayState,
} from "./state"

export class SocketIODisplays implements Displays {
  private state: DisplayState | undefined

  constructor(private namespace: Namespace, private logger: Logger) {}

  add(): void {
    return // automatically handled by socketio
  }

  remove(): void {
    return // automatically handled by socketio
  }

  updateState(state: DisplayState): void {
    const currentState = this.getState()
    this.state = { ...currentState, ...state }
    this.log({ event: "state" })
    this.namespace.emit("state", state)
  }

  sendAction(action: string): void {
    this.log({
      event: commands.ACTION,
      command: action,
    })
    this.namespace.emit(commands.ACTION, action)
  }

  getState(): DisplayState | undefined {
    return this.state
  }

  private log(payload: object) {
    this.logger.info(
      JSON.stringify({ ...payload, client: "displays", direction: "send" }),
    )
  }
}

export class SocketIOControllers implements Controllers {
  constructor(private namespace: Namespace, private logger: Logger) {}

  add(): void {
    return // automatically handled by socketio
  }

  remove(): void {
    return // automatically handled by socketio
  }

  updateState(state: ControllerState): void {
    this.log({ event: "state" })
    this.namespace.emit("state", state)
  }

  private log(payload: object) {
    this.logger.info(
      JSON.stringify({ ...payload, client: "controllers", direction: "send" }),
    )
  }
}

export class SocketIODisplay implements Display {
  constructor(private socket: Socket, private logger: Logger) {}

  updateState(state: DisplayState): void {
    this.log({
      id: this.socket.id,
      event: "state",
    })
    this.socket.emit("state", state)
  }

  private log(payload: object) {
    this.logger.info(
      JSON.stringify({ ...payload, client: "display", direction: "send" }),
    )
  }
}

export class SocketIOController implements Controller {
  constructor(private socket: Socket, private logger: Logger) {}

  updateState(state: ControllerState): void {
    this.log({
      id: this.socket.id,
      event: "state",
    })
    this.socket.emit("state", state)
  }

  private log(payload: object) {
    this.logger.info(
      JSON.stringify({ ...payload, client: "controller", direction: "send" }),
    )
  }
}
