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
  const { port } = server.address() as AddressInfo
  serverAddress = `http://localhost:${port}`
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

describe(`on display ${commands.GAME_OVER}`, () => {
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

    socket.emit(commands.GAME_OVER)

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

describe(`on controller ${commands.JOIN}`, () => {
  test("invoke onControllerJoin", async () => {
    const url = "/test"
    const controller = io.of(url)
    const testEvent = "command received"
    const state = createTestState()
    state.onControllerJoin = async () => {
      controller.emit(testEvent)
    }
    createTestSocketIOServer({ state, controller })
    const socket = await connect(url)

    socket.emit(commands.JOIN)

    await expect(waitForEmission(socket, testEvent)).resolves.toBeUndefined()
  })
})

describe(`on controller ${commands.START}`, () => {
  test("invoke onControllerStart", async () => {
    const url = "/test"
    const controller = io.of(url)
    const testEvent = "command received"
    const state = createTestState()
    state.onControllerStart = async () => {
      controller.emit(testEvent)
    }
    createTestSocketIOServer({ state, controller })
    const socket = await connect(url)

    socket.emit(commands.START)

    await expect(waitForEmission(socket, testEvent)).resolves.toBeUndefined()
  })
})

describe(`on controller ${commands.RESTART}`, () => {
  test("invoke onControllerRestart", async () => {
    const url = "/test"
    const controller = io.of(url)
    const testEvent = "command received"
    const state = createTestState()
    state.onControllerRestart = async () => {
      controller.emit(testEvent)
    }
    createTestSocketIOServer({ state, controller })
    const socket = await connect(url)

    socket.emit(commands.RESTART)

    await expect(waitForEmission(socket, testEvent)).resolves.toBeUndefined()
  })
})

describe(`on controller ${commands.GET_STATE}`, () => {
  test("invoke onControllerGetState", async () => {
    const url = "/test"
    const controller = io.of(url)
    const testEvent = "command received"
    const state = createTestState()
    state.onControllerGetState = async () => {
      controller.emit(testEvent)
    }
    createTestSocketIOServer({ state, controller })
    const socket = await connect(url)

    socket.emit(commands.GET_STATE)

    await expect(waitForEmission(socket, testEvent)).resolves.toBeUndefined()
  })
})

describe("on controller action", () => {
  test("invoke onControllerAction", async () => {
    const url = "/test"
    const controller = io.of(url)
    const testEvent = "command received"
    const state = createTestState()
    state.onControllerAction = async action => {
      controller.emit(testEvent, action)
    }
    createTestSocketIOServer({ state, controller })
    const socket = await connect(url)

    socket.emit(commands.ACTION, commands.TAP)

    await expect(
      waitForEmission(socket, testEvent, commands.TAP),
    ).resolves.toBeUndefined()
  })
})

describe("on controller disconnect", () => {
  test("invoke onControllerDisconnect", async () => {
    const url = "/test"
    const controller = io.of(url)
    const state = createTestState()
    state.onControllerDisconnect = jest.fn()

    createTestSocketIOServer({ state, controller })
    const socket = await connect(url)
    socket.disconnect()
    await waitForAllClientsToDisconnect(controller)

    await expect(state.onControllerDisconnect).toHaveBeenCalled()
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
  return new Promise((resolve, reject) => {
    socket.on("connect", () => resolve(socket))
    socket.on("connect_error", reject)
  })
}

function waitForEmission(
  socket: SocketIOClient.Socket,
  event: string,
  payload?: any,
): Promise<void> {
  return new Promise(resolve =>
    socket.on(event, (receivedPayload: any) => {
      if (typeof payload === "undefined") {
        return resolve()
      }

      if (payload === receivedPayload) {
        return resolve()
      }
    }),
  )
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
