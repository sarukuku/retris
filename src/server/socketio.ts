import { Namespace } from "socket.io"
import { commands } from "../commands"
import { Logger } from "../logger"
import { SocketIOController, SocketIODisplay } from "./socketio-adapters"
import { State } from "./state"

export function createSocketIOServer(
  state: State,
  namespaces: { display: Namespace; controller: Namespace },
  logger: Logger,
): void {
  namespaces.display.on("connect", displaySocket => {
    const display = new SocketIODisplay(displaySocket)
    log({ id: displaySocket.id, event: "connect", client: "display" })
    state.onDisplayConnect(display)

    displaySocket.on("disconnect", () => {
      log({ id: displaySocket.id, event: "disconnect", client: "display" })
      state.onDisplayDisconnect(display)
    })
  })

  namespaces.controller.on("connect", controllerSocket => {
    const controller = new SocketIOController(controllerSocket)
    log({ id: controllerSocket.id, event: "connect", client: "controller" })
    state.onControllerConnect(controller)

    controllerSocket.on(commands.JOIN, () => {
      log({
        id: controllerSocket.id,
        event: commands.JOIN,
        client: "controller",
      })
      state.onControllerJoin(controller)
    })

    controllerSocket.on(commands.START, () => {
      log({
        id: controllerSocket.id,
        event: commands.START,
        client: "controller",
      })
      state.onControllerStart(controller)
    })

    controllerSocket.on(commands.ACTION, command => {
      state.onControllerAction(command)
    })

    controllerSocket.on("disconnect", async () => {
      log({
        id: controllerSocket.id,
        event: "disconnect",
        client: "controller",
      })
      await state.onControllerDisconnect(controller)
    })
  })

  function log(payload: object) {
    logger.info(JSON.stringify({ ...payload, direction: "receive" }))
  }
}
