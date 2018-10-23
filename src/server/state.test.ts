import { views } from "../views"
import {
  Controller,
  Controllers,
  ControllerState,
  Display,
  Displays,
  DisplayState,
  INITIAL_DISPLAY_STATE,
  State,
} from "./state"

describe("onDisplayConnect", () => {
  test("set display state to initial if no current", () => {
    const displays = new TestDisplays()
    displays.state = undefined
    const state = createState()
    const display = new TestDisplay()

    state.onDisplayConnect(display)

    expect(display.state).toBe(INITIAL_DISPLAY_STATE)
  })

  test("add display to displays", () => {
    const displays = new TestDisplays()
    const state = createState({ displays })
    const display = new TestDisplay()

    state.onDisplayConnect(display)

    expect(displays.displays).toEqual([display])
  })

  test("set display state to current", () => {
    const display = new TestDisplay()
    const syncedState = { activeView: "some view", queueLength: 10 }
    const displays = new TestDisplays()
    displays.state = syncedState
    const state = createState({ displays })

    state.onDisplayConnect(display)

    expect(display.state).toEqual(syncedState)
  })
})

describe("onDisplayGameOver", () => {
  test(`set active controller's view to ${
    views.CONTROLLER_GAME_OVER
  }`, async () => {
    const state = createState()
    const activeController = new TestController()
    state.setActiveContoller(activeController)

    await state.onDisplayGameOver()

    expect(activeController.stateUpdates[0]).toEqual({
      activeView: views.CONTROLLER_GAME_OVER,
    })
  })

  test(`set active controller's view after some time to ${
    views.CONTROLLER_JOIN
  }`, async () => {
    const state = createState()
    const activeController = new TestController()
    state.setActiveContoller(activeController)

    await state.onDisplayGameOver()

    expect(activeController.stateUpdates[1]).toEqual({
      activeView: views.CONTROLLER_JOIN,
    })
  })

  test(`set displays view to ${views.DISPLAY_GAME_OVER}`, async () => {
    const displays = new TestDisplays()
    const state = createState({ displays })

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
      const state = createState({ displays })

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
      const state = createState({ displays })
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
      const state = createState({ displays })
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
    const state = createState({ displays })

    state.onDisplayDisconnect(display)

    expect(displays.displays).toEqual([])
  })
})

describe("onControllerConnect", () => {
  test("add controller to controllers", () => {
    const controllers = new TestControllers()
    const state = createState({ controllers })
    const controller = new TestController()

    state.onControllerConnect(controller)

    expect(controllers.controllers).toEqual([controller])
  })
})

describe("onControllerJoin", () => {
  describe("if no active controller exists", () => {
    test("set controller to active", () => {
      const state = createState()
      const controller = new TestController()

      state.onControllerJoin(controller)

      expect(state.getActiveController()).toBe(controller)
    })

    test(`set new active controller's view to ${
      views.CONTROLLER_START
    }`, () => {
      const state = createState()
      const controller = new TestController()

      state.onControllerJoin(controller)

      expect(controller.stateUpdates).toEqual([
        { activeView: views.CONTROLLER_START },
      ])
    })
  })

  describe("if active controller exists", () => {
    test("put controller to queue", () => {
      const state = createState()
      const controller = new TestController()
      const activeController = new TestController()
      state.setActiveContoller(activeController)

      state.onControllerJoin(controller)

      expect(state.getControllerQueue()).toEqual([controller])
    })

    test(`set controller's view to ${views.CONTROLLER_IN_QUEUE}`, () => {
      const state = createState()
      const controller = new TestController()
      const activeController = new TestController()
      state.setActiveContoller(activeController)

      state.onControllerJoin(controller)

      expect(controller.stateUpdates).toEqual([
        { activeView: views.CONTROLLER_IN_QUEUE },
      ])
    })

    test("set displays queueLength to 1", () => {
      const state = createState()
      const controller = new TestController()
      const activeController = new TestController()
      state.setActiveContoller(activeController)

      state.onControllerJoin(controller)

      expect(state.getControllerQueue()).toHaveLength(1)
    })
  })
})

describe("onControllerStart", () => {
  test(`set active controller's view to ${
    views.CONTROLLER_GAME_CONTROLS
  }`, () => {
    const state = createState()
    const controller = new TestController()
    state.setActiveContoller(controller)

    state.onControllerStart(controller)

    expect(controller.stateUpdates).toEqual([
      { activeView: views.CONTROLLER_GAME_CONTROLS },
    ])
  })

  test(`set displays view to ${views.DISPLAY_GAME}`, () => {
    const displays = new TestDisplays()
    const state = createState({ displays })
    const controller = new TestController()
    state.setActiveContoller(controller)

    state.onControllerStart(controller)

    expect(displays.stateUpdates).toEqual([{ activeView: views.DISPLAY_GAME }])
  })
})

describe("onControllerAction", () => {
  test("invoke displays send action", () => {
    const displays = new TestDisplays()
    const state = createState({ displays })
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
    const state = createState({ controllers })

    state.onControllerDisconnect(controller)

    expect(controllers.controllers).toEqual([])
  })

  describe("if controller is in queue", () => {
    test("remove controller from queue", () => {
      const controller = new TestController()
      const controllers = new TestControllers()
      const state = createState({ controllers })
      state.setControllerQueue([controller])

      state.onControllerDisconnect(controller)

      expect(controllers.controllers).toEqual([])
    })

    test("set displays queueLenght to 0", () => {
      const controller = new TestController()
      const displays = new TestDisplays()
      const state = createState({ displays })
      state.setControllerQueue([controller])

      state.onControllerDisconnect(controller)

      expect(displays.stateUpdates).toContainEqual({ queueLength: 0 })
    })
  })

  describe("if there's a controller is in queue after removal", () => {
    test(`set next active controller's view to ${
      views.CONTROLLER_START
    }`, async () => {
      const state = createState()
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
      const state = createState({ displays })
      state.setActiveContoller(activeController)
      state.setControllerQueue([nextActiveController])

      await state.onControllerDisconnect(activeController)

      expect(displays.stateUpdates).toEqual([
        {
          activeView: views.DISPLAY_WAITING_TO_START,
        },
      ])
    })
  })
})

function createState({
  displays = new TestDisplays(),
  controllers = new TestControllers(),
} = {}) {
  return new TestState(displays, controllers, { gameOverTimeout: 0 })
}

class TestState extends State {
  setActiveContoller(controller: Controller) {
    this.activeController = controller
  }

  getActiveController() {
    return this.activeController
  }

  setControllerQueue(controllerQueue: Controller[]) {
    this.controllerQueue = controllerQueue
  }

  getControllerQueue() {
    return this.controllerQueue
  }
}

class TestDisplays implements Displays {
  displays: Display[] = []
  state: DisplayState | undefined
  stateUpdates: DisplayState[] = []
  sentActions: string[] = []

  add(display: Display): void {
    this.displays.push(display)
  }

  remove(display: Display): void {
    this.displays = this.displays.filter(d => d !== display)
  }

  updateState(state: DisplayState): void {
    this.stateUpdates.push(state)
    const currentState = this.state || {}
    this.state = { ...currentState, ...state }
  }

  sendAction(action: string): void {
    this.sentActions.push(action)
  }

  getState(): DisplayState | undefined {
    return this.state
  }
}

class TestDisplay implements Display {
  state: DisplayState

  updateState(state: DisplayState): void {
    this.state = state
  }
}

class TestControllers implements Controllers {
  controllers: Controller[] = []

  add(controller: Controller): void {
    this.controllers.push(controller)
  }
  remove(controller: Controller): void {
    this.controllers = this.controllers.filter(c => c !== controller)
  }
}

class TestController implements Controller {
  stateUpdates: ControllerState[] = []

  updateState(state: ControllerState): void {
    this.stateUpdates.push(state)
  }
}
