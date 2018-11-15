import { views } from "../views"
import { INITIAL_DISPLAY_STATE } from "./state"
import {
  TestDisplays,
  TestController,
  createTestState,
  TestDisplay,
  TestControllers,
} from "./state.mocks"

describe("onDisplayConnect", () => {
  test("set display state to initial if no current", () => {
    const displays = new TestDisplays()
    displays.state = undefined
    const state = createTestState()
    const display = new TestDisplay()

    state.onDisplayConnect(display)

    expect(display.state).toBe(INITIAL_DISPLAY_STATE)
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

describe("onDisplayGameOver", () => {
  test(`set active controller's view to ${
    views.CONTROLLER_GAME_OVER
  }`, async () => {
    const state = createTestState()
    const activeController = new TestController()
    state.setActiveContoller(activeController)

    await state.onDisplayGameOver()

    expect(activeController.stateUpdates[0]).toEqual({
      activeView: views.CONTROLLER_GAME_OVER,
    })
  })

  test(`set displays view to ${views.DISPLAY_GAME_OVER}`, async () => {
    const displays = new TestDisplays()
    const state = createTestState({ displays })

    await state.onDisplayGameOver()

    expect(displays.stateUpdates[0]).toEqual({
      activeView: views.DISPLAY_GAME_OVER,
    })
  })

  describe("if noone is in the queue", () => {
    test(`set displays view to ${
      views.DISPLAY_WAITING
    } after some time`, async () => {
      const displays = new TestDisplays()
      const state = createTestState({ displays })

      await state.onDisplayGameOver()

      expect(displays.stateUpdates[1]).toEqual({
        activeView: views.DISPLAY_WAITING,
      })
    })
  })

  describe("if someone is in the queue", () => {
    test(`set next active controller's view to ${
      views.CONTROLLER_START
    } after some time`, async () => {
      const displays = new TestDisplays()
      const state = createTestState({ displays })
      const activeController = new TestController()
      const nextActiveController = new TestController()
      state.setActiveContoller(activeController)
      state.setControllerQueue([nextActiveController])

      await state.onDisplayGameOver()

      expect(nextActiveController.stateUpdates).toEqual([
        { activeView: views.CONTROLLER_START },
      ])
    })

    test(`set displays view to ${
      views.DISPLAY_WAITING_TO_START
    } after some time`, async () => {
      const displays = new TestDisplays()
      const nextActiveController = new TestController()
      const state = createTestState({ displays })
      state.setControllerQueue([nextActiveController])

      await state.onDisplayGameOver()

      expect(displays.stateUpdates[1]).toEqual({
        activeView: views.DISPLAY_WAITING_TO_START,
      })
    })
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

describe("onControllerRestart", () => {
  test(`set controller's active view to ${views.CONTROLLER_JOIN}`, () => {
    const state = createTestState()
    const controller = new TestController()

    state.onControllerRestart(controller)

    expect(controller.stateUpdates).toEqual([
      { activeView: views.CONTROLLER_JOIN },
    ])
  })
})

describe("onControllerGetState", () => {
  test("retrieve last state of controller", () => {
    const state = createTestState()
    const controller = new TestController()
    const controllerState = {
      activeView: views.CONTROLLER_GAME_CONTROLS,
      queueLength: 10,
    }
    controller.state = controllerState

    state.onControllerGetState(controller)

    expect(controller.stateUpdates).toEqual([controllerState])
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
        { activeView: views.CONTROLLER_IN_QUEUE },
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

    test("set controllers queueLength to 1", () => {
      const controllers = new TestControllers()
      const state = createTestState({ controllers })
      const controller = new TestController()
      const activeController = new TestController()
      state.setActiveContoller(activeController)

      state.onControllerJoin(controller)

      expect(controllers.stateUpdates).toEqual([{ queueLength: 1 }])
    })
  })
})

describe("onControllerStart", () => {
  test(`set active controller's view to ${
    views.CONTROLLER_GAME_CONTROLS
  }`, () => {
    const state = createTestState()
    const controller = new TestController()
    state.setActiveContoller(controller)

    state.onControllerStart(controller)

    expect(controller.stateUpdates).toEqual([
      { activeView: views.CONTROLLER_GAME_CONTROLS },
    ])
  })

  test(`set displays view to ${views.DISPLAY_GAME}`, () => {
    const displays = new TestDisplays()
    const state = createTestState({ displays })
    const controller = new TestController()
    state.setActiveContoller(controller)

    state.onControllerStart(controller)

    expect(displays.stateUpdates).toEqual([{ activeView: views.DISPLAY_GAME }])
  })
})

describe("onControllerAction", () => {
  test("invoke displays send action", () => {
    const displays = new TestDisplays()
    const state = createTestState({ displays })
    const action = "foo"

    state.onControllerAction(action)

    expect(displays.sentActions).toEqual([action])
  })
})

describe("onControllerDisconnect", () => {
  test("remove controller from controllers", () => {
    const controller = new TestController()
    const controllers = new TestControllers()
    controllers.controllers = [controller]
    const state = createTestState({ controllers })

    state.onControllerDisconnect(controller)

    expect(controllers.controllers).toEqual([])
  })

  describe("if not the active controller disconnects", () => {
    test("don't replace with new one", () => {
      const activeController = new TestController()
      const otherController = new TestController()
      const controllers = new TestControllers()
      const state = createTestState({ controllers })
      state.setActiveContoller(activeController)

      state.onControllerDisconnect(otherController)

      expect(state.getActiveController()).toBe(activeController)
    })
  })

  describe("if controller is in queue", () => {
    test("remove controller from queue", () => {
      const controller = new TestController()
      const controllers = new TestControllers()
      const state = createTestState({ controllers })
      state.setControllerQueue([controller])

      state.onControllerDisconnect(controller)

      expect(controllers.controllers).toEqual([])
    })

    test("set displays queueLenght to 0", () => {
      const activeController = new TestController()
      const controller = new TestController()
      const displays = new TestDisplays()
      const state = createTestState({ displays })
      state.setActiveContoller(activeController)
      state.setControllerQueue([controller])

      state.onControllerDisconnect(activeController)

      expect(displays.stateUpdates).toContainEqual({ queueLength: 0 })
    })

    test("set controllers queueLenght to 0", () => {
      const activeController = new TestController()
      const controller = new TestController()
      const controllers = new TestControllers()
      const state = createTestState({ controllers })
      state.setActiveContoller(activeController)
      state.setControllerQueue([controller])

      state.onControllerDisconnect(activeController)

      expect(controllers.stateUpdates).toContainEqual({ queueLength: 0 })
    })
  })

  describe("if there's a controller is in queue after removal", () => {
    test(`set next active controller's view to ${
      views.CONTROLLER_START
    }`, async () => {
      const state = createTestState()
      const activeController = new TestController()
      const nextActiveController = new TestController()
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
      state.setActiveContoller(activeController)
      state.setControllerQueue([nextActiveController])

      await state.onControllerDisconnect(activeController)

      expect(displays.stateUpdates).toContainEqual({
        activeView: views.DISPLAY_WAITING_TO_START,
      })
    })
  })
})
