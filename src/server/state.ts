import { isEmpty } from "ramda"
import { commands } from "../commands"
import { Game } from "../games/tetris/game"
import { TetrisMatrix } from "../games/tetris/shape"
import { wait } from "../helpers"
import { views } from "../views"

export interface Display {
  updateState(state: DisplayState): void
}

export interface Displays {
  add(display: Display): void
  remove(display: Display): void
  updateState(state: DisplayState): void
  getState(): DisplayState | undefined
}

export interface DisplayState {
  activeView?: string
  queueLength?: number
  board?: TetrisMatrix
  score?: number
}

export interface Controller {
  updateState(state: ControllerState): void
}

export interface ControllerState {
  activeView?: string
  positionInQueue?: number
  score?: number
}

export interface Controllers {
  add(controller: Controller): void
  remove(controller: Controller): void
  updateState(state: ControllerState): void
}

export class State {
  protected activeController?: Controller
  protected controllerQueue: Controller[] = []
  protected gameOverTimeout: number
  private game?: Game

  constructor(
    protected displays: Displays,
    protected controllers: Controllers,
    { gameOverTimeout = FIVE_SECONDS } = {},
  ) {
    this.gameOverTimeout = gameOverTimeout
  }

  onDisplayConnect(display: Display) {
    const initialDisplayState = {
      activeView: views.DISPLAY_WAITING,
      queueLength: this.controllerQueue.length,
    }
    const currentDisplayState = this.displays.getState() || initialDisplayState
    display.updateState(currentDisplayState)
    this.displays.add(display)
  }

  onDisplayDisconnect(display: Display) {
    this.displays.remove(display)
  }

  onControllerConnect(controller: Controller) {
    this.controllers.add(controller)
    this.onControllerJoin(controller)
  }

  onControllerJoin(controller: Controller) {
    if (!this.activeController) {
      this.activeController = controller
      this.activeController.updateState({ activeView: views.CONTROLLER_START })
      this.displays.updateState({ activeView: views.DISPLAY_WAITING_TO_START })
    } else {
      controller.updateState({ activeView: views.CONTROLLER_IN_QUEUE })
      this.controllerQueue.push(controller)
      this.displays.updateState({ queueLength: this.controllerQueue.length })
    }

    controller.updateState({ positionInQueue: this.controllerQueue.length })
  }

  async onControllerStart(controller: Controller) {
    if (this.activeController !== controller) {
      return
    }

    this.activeController.updateState({
      activeView: views.CONTROLLER_GAME_CONTROLS,
    })

    this.game = new Game({ columnCount: 10, rowCount: 16 })
    this.game.boardChange.subscribe(board =>
      this.displays.updateState({ board }),
    )
    this.game.scoreChange.subscribe(score =>
      this.displays.updateState({ score: score.current }),
    )

    this.displays.updateState({ activeView: views.DISPLAY_GAME })

    await this.game.start()
    await this.handleGameOver()
  }

  private async handleGameOver() {
    if (this.activeController) {
      this.activeController.updateState({
        activeView: views.CONTROLLER_GAME_OVER,
      })
    }

    this.displays.updateState({ activeView: views.DISPLAY_GAME_OVER })

    await wait(this.gameOverTimeout)

    this.assignNewActiveController()
  }

  onControllerAction(action: string) {
    if (!this.game) {
      return
    }

    switch (action) {
      case commands.LEFT:
        this.game.left()
        break
      case commands.RIGHT:
        this.game.right()
        break
      case commands.TAP:
        this.game.rotate()
        break
      case commands.DOWN:
        this.game.down()
        break
    }
  }

  onControllerDisconnect(controller: Controller) {
    if (controller === this.activeController) {
      if (this.game) {
        this.game.makeGameOver()
      }
    }

    this.removeFromControllerQueue(controller)
    this.controllers.remove(controller)
  }

  private removeFromControllerQueue(controller: Controller): void {
    this.controllerQueue = this.controllerQueue.filter(c => c !== controller)
    this.displays.updateState({ queueLength: this.controllerQueue.length })
    this.controllerQueue.forEach((c, index) =>
      c.updateState({ positionInQueue: index + 1 }),
    )
  }

  private assignNewActiveController() {
    if (isEmpty(this.controllerQueue)) {
      this.displays.updateState({ activeView: views.DISPLAY_WAITING })
      this.activeController = undefined
    } else {
      this.displays.updateState({ activeView: views.DISPLAY_WAITING_TO_START })
      this.activeController = this.controllerQueue.shift()!
      this.activeController.updateState({ activeView: views.CONTROLLER_START })
    }
  }
}

const FIVE_SECONDS = 5000
