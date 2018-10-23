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

    displaySocket.on(commands.COMMAND_GAME_OVER, () => {
      state.onDisplayGameOver()
    })

    displaySocket.on("disconnect", () => {
      state.onDisplayDisconnect(display)
    })
  })

  namespaces.controller.on("connect", controllerSocket => {
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
}
