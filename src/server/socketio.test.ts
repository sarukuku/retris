import { createServer, Server } from "http"
import { AddressInfo } from "net"
import socketio from "socket.io"
import socketioClient from "socket.io-client"
import { commands } from "../commands"
import { wait } from "../helpers"
import { createSocketIOServer } from "./socketio"
import { createTestState } from "./state.mocks"

let server: Server
let serverAddress: string
let io: socketio.Server
beforeEach(() => {
  server = createServer().listen()
  const { address, port } = server.address() as AddressInfo
  serverAddress = `http://[${address}]:${port}`
  io = socketio(server)
})

afterEach(() => {
  io.close()
  server.close()
})

describe("on display connect", () => {
  test("invoke onDisplayConnect", async () => {
    const url = "/test"
    const display = io.of(url)
    const state = createTestState()
    state.onDisplayConnect = jest.fn()

    createTestSocketIOServer({ state, display })
    await connect(url)

    await expect(state.onDisplayConnect).toHaveBeenCalled()
  })
})

describe(`on display ${commands.COMMAND_GAME_OVER}`, () => {
  test("invoke onDisplayGameOver", async () => {
    const url = "/test"
    const display = io.of(url)
    const testEvent = "command received"
    const state = createTestState()
    state.onDisplayGameOver = async () => {
      display.emit(testEvent)
    }
    createTestSocketIOServer({ state, display })
    const socket = await connect(url)

    socket.emit(commands.COMMAND_GAME_OVER)

    await expect(waitForEmission(socket, testEvent)).resolves.toBeUndefined()
  })
})

describe("on display disconnect", () => {
  test("invoke onDisplayDisconnect", async () => {
    const url = "/test"
    const display = io.of(url)
    const state = createTestState()
    state.onDisplayDisconnect = jest.fn()

    createTestSocketIOServer({ state, display })
    const socket = await connect(url)
    socket.disconnect()
    await waitForAllClientsToDisconnect(display)

    await expect(state.onDisplayDisconnect).toHaveBeenCalled()
  })
})

describe("on controller connect", () => {
  test("invoke onControllerConnect", async () => {
    const url = "/test"
    const controller = io.of(url)
    const state = createTestState()
    state.onControllerConnect = jest.fn()

    createTestSocketIOServer({ state, controller })
    await connect(url)

    await expect(state.onControllerConnect).toHaveBeenCalled()
  })
})

function createTestSocketIOServer({
  state = createTestState(),
  display = io.of("/display"),
  controller = io.of("/controller"),
} = {}) {
  return createSocketIOServer(state, { display, controller })
}

function connect(url: string): Promise<SocketIOClient.Socket> {
  const socket = socketioClient(`${serverAddress}${url}`)
  return new Promise(resolve => socket.on("connect", () => resolve(socket)))
}

function waitForEmission(
  socket: SocketIOClient.Socket,
  event: string,
): Promise<void> {
  return new Promise(resolve => socket.on(event, resolve))
}

function waitForAllClientsToDisconnect(
  namespace: SocketIO.Namespace,
): Promise<void> {
  return new Promise(async resolve => {
    const connectedCount = Object.keys(namespace.connected).length
    if (connectedCount === 0) {
      return resolve()
    }

    await wait(50)
    await waitForAllClientsToDisconnect(namespace)

    resolve()
  })
}
