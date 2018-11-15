import { Namespace } from "socket.io"
import { commands } from "../commands"
import { SocketIODisplay, SocketIOController } from "./socketio-adapters"
import { State } from "./state"

export function createSocketIOServer(
  state: State,
  namespaces: { display: Namespace; controller: Namespace },
): void {
  namespaces.display.on("connect", displaySocket => {
    const display = new SocketIODisplay(displaySocket)
    state.onDisplayConnect(display)

    displaySocket.on(commands.GAME_OVER, () => {
      state.onDisplayGameOver()
    })

    displaySocket.on("disconnect", () => {
      state.onDisplayDisconnect(display)
    })
  })

  namespaces.controller.on("connect", controllerSocket => {
    const controller = new SocketIOController(controllerSocket)
    state.onControllerConnect(controller)

    controllerSocket.on(commands.JOIN, () => {
      state.onControllerJoin(controller)
    })

    controllerSocket.on(commands.START, () => {
      state.onControllerStart(controller)
    })

    controllerSocket.on(commands.RESTART, () => {
      state.onControllerRestart(controller)
    })

    controllerSocket.on(commands.GET_STATE, () => {
      state.onControllerGetState(controller)
    })

    controllerSocket.on(commands.ACTION, command => {
      state.onControllerAction(command)
    })

    controllerSocket.on("disconnect", () => {
      state.onControllerDisconnect(controller)
    })
  })
}
