import { Server as HTTPServer } from "http"
import socketio, { Server } from "socket.io"
import { commands } from "../commands"
import {
  SocketIODisplays,
  SocketIOControllers,
  SocketIODisplay,
  SocketIOController,
} from "./socketio-adapters"
import { State } from "./state"

export function createSocketIOServer(server: HTTPServer): Server {
  const io = socketio(server)
  const displayNamespace = io.of("/display")
  const controllerNamespace = io.of("/controller")

  const state = new State(
    new SocketIODisplays(displayNamespace),
    new SocketIOControllers(),
  )

  displayNamespace.on("connect", displaySocket => {
    const display = new SocketIODisplay(displaySocket)
    state.onDisplayConnect(display)

    displaySocket.on(commands.COMMAND_GAME_OVER, () => {
      state.onDisplayGameOver()
    })

    displaySocket.on("disconnect", () => {
      state.onDisplayDisconnect(display)
    })
  })

  controllerNamespace.on("connect", controllerSocket => {
    const controller = new SocketIOController(controllerSocket)
    state.onControllerConnect(controller)

    controllerSocket.on(commands.COMMAND_CONTROLLER_JOIN, () => {
      state.onControllerJoin(controller)
    })

    controllerSocket.on(commands.COMMAND_START, () => {
      state.onControllerStart(controller)
    })

    controllerSocket.on("action", command => {
      state.onControllerAction(command)
    })

    controllerSocket.on("disconnect", () => {
      state.onControllerDisconnect(controller)
    })
  })

  return io
}
