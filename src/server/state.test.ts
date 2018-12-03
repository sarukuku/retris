import { commands } from "../commands"
import { views } from "../views"
import {
  createTestState,
  TestController,
  TestControllers,
  TestDisplay,
  TestDisplays,
  TestGame,
} from "./state.mocks"

describe("onDisplayConnect", () => {
  test("set display state to initial if no current", () => {
    const displays = new TestDisplays()
    displays.state = undefined
    const state = createTestState()
    const display = new TestDisplay()

    state.onDisplayConnect(display)

    expect(display.state).toEqual({
      activeView: views.DISPLAY_WAITING,
      queueLength: 0,
    })
  })

  test("add display to displays", () => {
    const displays = new TestDisplays()
    const state = createTestState({ displays })
    const display = new TestDisplay()

    state.onDisplayConnect(display)

    expect(displays.displays).toEqual([display])
  })

  test("set display state to current", () => {
    const display = new TestDisplay()
    const syncedState = { activeView: "some view", queueLength: 10 }
    const displays = new TestDisplays()
    displays.state = syncedState
    const state = createTestState({ displays })

    state.onDisplayConnect(display)

    expect(display.state).toEqual(syncedState)
  })
})

describe("onDisplayDisconnect", () => {
  test("remove display from displays", () => {
    const displays = new TestDisplays()
    const display = new TestDisplay()
    displays.displays = [display]
    const state = createTestState({ displays })

    state.onDisplayDisconnect(display)

    expect(displays.displays).toEqual([])
  })
})

describe("onControllerConnect", () => {
  test("add controller to controllers", () => {
    const controllers = new TestControllers()
    const state = createTestState({ controllers })
    const controller = new TestController()

    state.onControllerConnect(controller)

    expect(controllers.controllers).toEqual([controller])
  })
})

describe("onControllerJoin", () => {
  describe("if no active controller exists", () => {
    test("set controller to active", () => {
      const state = createTestState()
      const controller = new TestController()

      state.onControllerJoin(controller)

      expect(state.getActiveController()).toBe(controller)
    })

    test(`set new active controller's view to ${
      views.CONTROLLER_START
    }`, () => {
      const state = createTestState()
      const controller = new TestController()

      state.onControllerJoin(controller)

      expect(controller.stateUpdates).toEqual([
        { activeView: views.CONTROLLER_START },
      ])
    })

    test(`set displays view to ${views.DISPLAY_WAITING_TO_START}`, () => {
      const displays = new TestDisplays()
      const state = createTestState({ displays })
      const controller = new TestController()

      state.onControllerJoin(controller)

      expect(displays.stateUpdates).toEqual([
        { activeView: views.DISPLAY_WAITING_TO_START },
      ])
    })
  })

  describe("if active controller exists", () => {
    test("put controller to queue", () => {
      const state = createTestState()
      const controller = new TestController()
      const activeController = new TestController()
      state.setActiveContoller(activeController)

      state.onControllerJoin(controller)

      expect(state.getControllerQueue()).toEqual([controller])
    })

    test(`set controller's view to ${views.CONTROLLER_IN_QUEUE}`, () => {
      const state = createTestState()
      const controller = new TestController()
      const activeController = new TestController()
      state.setActiveContoller(activeController)

      state.onControllerJoin(controller)

      expect(controller.stateUpdates).toEqual([
        expect.objectContaining({ activeView: views.CONTROLLER_IN_QUEUE }),
      ])
    })

    test("set displays queueLength to 1", () => {
      const displays = new TestDisplays()
      const state = createTestState({ displays })
      const controller = new TestController()
      const activeController = new TestController()
      state.setActiveContoller(activeController)

      state.onControllerJoin(controller)

      expect(displays.stateUpdates).toEqual([{ queueLength: 1 }])
    })

    test("set controller to positionInQueue to 1", () => {
      const controllers = new TestControllers()
      const state = createTestState({ controllers })
      const controller = new TestController()
      const activeController = new TestController()
      state.setActiveContoller(activeController)

      state.onControllerJoin(controller)

      expect(controller.stateUpdates).toEqual([
        expect.objectContaining({ positionInQueue: 1 }),
      ])
    })
  })
})

describe("onControllerStart", () => {
  test(`set active controller's view to ${
    views.CONTROLLER_GAME_CONTROLS
  }`, async () => {
    const state = createTestState()
    const controller = new TestController()
    state.setActiveContoller(controller)

    await state.onControllerStart(controller)

    expect(controller.stateUpdates[0]).toEqual({
      activeView: views.CONTROLLER_GAME_CONTROLS,
    })
  })

  test(`set active controller's view to ${
    views.CONTROLLER_GAME_OVER
  } after game over`, async () => {
    const state = createTestState()
    const controller = new TestController()
    state.setActiveContoller(controller)

    await state.onControllerStart(controller)

    expect(controller.stateUpdates[1]).toEqual({
      activeView: views.CONTROLLER_GAME_OVER,
    })
  })

  test(`set displays view to ${views.DISPLAY_GAME}`, async () => {
    const displays = new TestDisplays()
    const state = createTestState({ displays })
    const controller = new TestController()
    state.setActiveContoller(controller)

    await state.onControllerStart(controller)

    expect(displays.stateUpdates[0]).toEqual(
      expect.objectContaining({ activeView: views.DISPLAY_GAME }),
    )
  })

  test("set displays score to 0", async () => {
    const displays = new TestDisplays()
    const state = createTestState({ displays })
    const controller = new TestController()
    state.setActiveContoller(controller)

    await state.onControllerStart(controller)

    expect(displays.stateUpdates[0]).toEqual(
      expect.objectContaining({ score: 0 }),
    )
  })

  test(`set displays view to ${
    views.DISPLAY_GAME_OVER
  } after game over`, async () => {
    const displays = new TestDisplays()
    const state = createTestState({ displays })
    const controller = new TestController()
    state.setActiveContoller(controller)

    await state.onControllerStart(controller)

    expect(displays.stateUpdates[1]).toEqual({
      activeView: views.DISPLAY_GAME_OVER,
    })
  })

  test(`set displays view to ${
    views.DISPLAY_WAITING
  } after a while after game over`, async () => {
    const displays = new TestDisplays()
    const state = createTestState({ displays })
    const controller = new TestController()
    state.setActiveContoller(controller)

    await state.onControllerStart(controller)

    expect(displays.stateUpdates[2]).toEqual({
      activeView: views.DISPLAY_WAITING,
    })
  })
})

describe("onControllerAction", () => {
  test(`invoke ${commands.LEFT}`, () => {
    const game = new TestGame()
    const spy = jest.fn()
    game.left = spy
    const state = createTestState()
    state.setGame(game)

    state.onControllerAction(commands.LEFT)

    expect(spy).toHaveBeenCalled()
  })

  test(`invoke ${commands.RIGHT}`, () => {
    const game = new TestGame()
    const spy = jest.fn()
    game.right = spy
    const state = createTestState()
    state.setGame(game)

    state.onControllerAction(commands.RIGHT)

    expect(spy).toHaveBeenCalled()
  })

  test(`invoke ${commands.DOWN}`, () => {
    const game = new TestGame()
    const spy = jest.fn()
    game.down = spy
    const state = createTestState()
    state.setGame(game)

    state.onControllerAction(commands.DOWN)

    expect(spy).toHaveBeenCalled()
  })

  test(`invoke ${commands.TAP}`, () => {
    const game = new TestGame()
    const spy = jest.fn()
    game.rotate = spy
    const state = createTestState()
    state.setGame(game)

    state.onControllerAction(commands.TAP)

    expect(spy).toHaveBeenCalled()
  })
})

describe("onControllerDisconnect", () => {
  test("remove controller from controllers", async () => {
    const controller = new TestController()
    const controllers = new TestControllers()
    controllers.controllers = [controller]
    const state = createTestState({ controllers })

    await state.onControllerDisconnect(controller)

    expect(controllers.controllers).toEqual([])
  })

  describe("if not the active controller disconnects", () => {
    test("don't replace with new one", async () => {
      const activeController = new TestController()
      const otherController = new TestController()
      const controllers = new TestControllers()
      const state = createTestState({ controllers })
      state.setActiveContoller(activeController)

      await state.onControllerDisconnect(otherController)

      expect(state.getActiveController()).toBe(activeController)
    })
  })

  describe("if controller is in queue", () => {
    test("remove controller from queue", async () => {
      const controller = new TestController()
      const controllers = new TestControllers()
      const state = createTestState({ controllers })
      state.setControllerQueue([controller])

      await state.onControllerDisconnect(controller)

      expect(controllers.controllers).toEqual([])
    })

    test(`set displays activeView to ${views.DISPLAY_GAME_OVER}`, async () => {
      const activeController = new TestController()
      const controller = new TestController()
      const displays = new TestDisplays()
      const state = createTestState({ displays })
      state.setGame(new TestGame())
      state.setActiveContoller(activeController)
      state.setControllerQueue([controller])

      await state.onControllerDisconnect(activeController)

      expect(displays.stateUpdates[0]).toEqual({
        activeView: views.DISPLAY_GAME_OVER,
      })
    })

    test(`set displays activeView to ${
      views.DISPLAY_WAITING_TO_START
    } after a while`, async () => {
      const activeController = new TestController()
      const controller = new TestController()
      const displays = new TestDisplays()
      const state = createTestState({ displays })
      state.setGame(new TestGame())
      state.setActiveContoller(activeController)
      state.setControllerQueue([controller])

      await state.onControllerDisconnect(activeController)

      expect(displays.stateUpdates[1]).toEqual({
        activeView: views.DISPLAY_WAITING_TO_START,
      })
    })

    test("set displays queueLength to 0", async () => {
      const activeController = new TestController()
      const controller = new TestController()
      const displays = new TestDisplays()
      const state = createTestState({ displays })
      state.setGame(new TestGame())
      state.setActiveContoller(activeController)
      state.setControllerQueue([controller])

      await state.onControllerDisconnect(activeController)

      expect(displays.stateUpdates[2]).toEqual({ queueLength: 0 })
    })
  })

  describe("if there's a controller is in queue after removal", () => {
    test(`set next active controller's view to ${
      views.CONTROLLER_START
    }`, async () => {
      const state = createTestState()
      const activeController = new TestController()
      const nextActiveController = new TestController()
      state.setGame(new TestGame())
      state.setActiveContoller(activeController)
      state.setControllerQueue([nextActiveController])

      await state.onControllerDisconnect(activeController)

      expect(nextActiveController.stateUpdates).toEqual([
        { activeView: views.CONTROLLER_START },
      ])
    })

    test(`set displays view to ${views.DISPLAY_WAITING_TO_START}`, async () => {
      const displays = new TestDisplays()
      const nextActiveController = new TestController()
      const activeController = new TestController()
      const state = createTestState({ displays })
      state.setGame(new TestGame())
      state.setActiveContoller(activeController)
      state.setControllerQueue([nextActiveController])

      await state.onControllerDisconnect(activeController)

      expect(displays.stateUpdates).toContainEqual({
        activeView: views.DISPLAY_WAITING_TO_START,
      })
    })
  })
})
