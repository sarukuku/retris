import { isEmpty } from "ramda"
import { views } from "../views"

export interface Display {
  updateState(state: Partial<DisplayState>): void
}

export interface Displays {
  add(display: Display): void
  remove(display: Display): void
  updateState(state: Partial<DisplayState>): void
  sendAction(action: string): void
  getState(): DisplayState | undefined
}

export interface DisplayState {
  activeView: string
  queueLength: number
}

export interface Controller {
  updateState(state: Partial<ControllerState>): void
}

export interface ControllerState {
  activeView: string
}

export interface Controllers {
  add(controller: Controller): void
  remove(controller: Controller): void
}

export class State {
  private activeController?: Controller
  private controllerQueue: Controller[] = []

  constructor(private displays: Displays, private controllers: Controllers) {}

  onDisplayConnect(display: Display) {
    const currentDisplayState = this.displays.getState() || initialDisplayState
    display.updateState(currentDisplayState)
    this.displays.add(display)
  }

  async onDisplayGameOver() {
    if (this.activeController) {
      this.activeController.updateState({
        activeView: views.CONTROLLER_GAME_OVER,
      })
    }

    this.displays.updateState({ activeView: views.DISPLAY_GAME_OVER })

    await wait(FIVE_SECONDS)

    if (this.activeController) {
      this.activeController.updateState({ activeView: views.CONTROLLER_JOIN })
    }

    this.handleGameEnd()
  }

  onDisplayDisconnect(display: Display) {
    this.displays.remove(display)
  }

  onControllerConnect(controller: Controller) {
    this.controllers.add(controller)
  }

  onControllerJoin(controller: Controller) {
    if (isEmpty(this.controllerQueue)) {
      this.activeController = controller
      this.activeController.updateState({ activeView: views.CONTROLLER_START })
    } else {
      this.controllerQueue.push(controller)
      controller.updateState({ activeView: views.CONTROLLER_IN_QUEUE })
      this.displays.updateState({ queueLength: this.controllerQueue.length })
    }
  }

  onControllerStart(controller: Controller) {
    if (this.activeController !== controller) {
      return
    }

    this.activeController.updateState({
      activeView: views.CONTROLLER_GAME_CONTROLS,
    })
    this.displays.updateState({ activeView: views.DISPLAY_GAME })
  }

  onControllerAction(action: string) {
    this.displays.sendAction(action)
  }

  onControllerDisconnect(controller: Controller) {
    if (this.controllerQueue.includes(controller)) {
      this.controllerQueue = this.controllerQueue.filter(c => c === controller)
      this.displays.updateState({ queueLength: this.controllerQueue.length })
    }

    this.handleGameEnd()
    this.controllers.remove(controller)
  }

  private handleGameEnd() {
    if (isEmpty(this.controllerQueue)) {
      this.displays.updateState({ activeView: views.DISPLAY_WAITING })
      this.activeController = undefined
    } else {
      this.displays.updateState({ activeView: views.DISPLAY_WAITING_TO_START })
      this.activeController = this.controllerQueue.pop()!
      this.activeController.updateState({ activeView: views.CONTROLLER_START })
    }
  }
}

const initialDisplayState = {
  activeView: views.DISPLAY_WAITING,
}

const FIVE_SECONDS = 5000

function wait(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
