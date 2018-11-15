import {
  State,
  Controller,
  Displays,
  Display,
  DisplayState,
  Controllers,
  ControllerState,
} from "./state"

export function createTestState({
  displays = new TestDisplays(),
  controllers = new TestControllers(),
} = {}) {
  return new TestState(displays, controllers, { gameOverTimeout: 0 })
}

export class TestState extends State {
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

export class TestDisplays implements Displays {
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

export class TestDisplay implements Display {
  state: DisplayState

  updateState(state: DisplayState): void {
    this.state = state
  }
}

export class TestControllers implements Controllers {
  controllers: Controller[] = []
  state: ControllerState | undefined
  stateUpdates: ControllerState[] = []

  add(controller: Controller): void {
    this.controllers.push(controller)
  }
  remove(controller: Controller): void {
    this.controllers = this.controllers.filter(c => c !== controller)
  }
  updateState(state: DisplayState): void {
    this.stateUpdates.push(state)
    const currentState = this.state || {}
    this.state = { ...currentState, ...state }
  }
}

export class TestController implements Controller {
  stateUpdates: ControllerState[] = []

  updateState(state: ControllerState): void {
    this.stateUpdates.push(state)
  }
}
