import { ReplaySubject, Subject } from "rxjs"
import { ScoreChange } from "../games/tetris/game"
import { TetrisMatrix } from "../games/tetris/shape"
import {
  Controller,
  Controllers,
  ControllerState,
  Display,
  Displays,
  DisplayState,
  Game,
  State,
} from "./state"

export function createTestState({
  displays = new TestDisplays(),
  controllers = new TestControllers(),
  createGame = () => new TestGame(),
} = {}) {
  return new TestState(displays, controllers, createGame, {
    gameOverTimeout: 0,
  })
}

export class TestGame implements Game {
  start = () => Promise.resolve(false)
  left = () => undefined
  right = () => undefined
  rotate = () => undefined
  down = () => undefined
  smash = () => undefined
  forceGameOver = () => undefined
  boardChange = new ReplaySubject<TetrisMatrix>()
  scoreChange = new Subject<ScoreChange>()
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

  setGame(game: Game) {
    this.game = game
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
