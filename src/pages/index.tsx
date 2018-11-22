import React, { Component } from "react"
import { commands } from "../commands"
import { AnalyticsProps, pageWithAnalytics } from "../components/with-analytics"
import { SocketProps, pageWithSocket } from "../components/with-socket"
import { ControllerState } from "../server/state"
import { views } from "../views"
import { GameController } from "../views/controller/game-controller"
import { GameOver } from "../views/controller/game-over"
import { InQueue } from "../views/controller/in-queue"
import { NotRunning } from "../views/controller/not-running"
import { StartGame } from "../views/controller/start-game"
import { Loading } from "../views/loading"

interface ControllerProps extends AnalyticsProps, SocketProps {}

class Controller extends Component<ControllerProps, ControllerState> {
  private previousActiveView?: string

  state: ControllerState = {}

  onJoinGame = () => {
    this.sendCommand(commands.JOIN)
  }

  onStartGame = () => {
    this.sendCommand(commands.START)
  }

  sendCommand = (command: string) => {
    const { socket } = this.props
    socket.emit(command)
  }

  onTap = () => {
    this.sendActionCommand(commands.TAP)
  }

  onSwipeRight = () => {
    this.sendActionCommand(commands.RIGHT)
  }

  onSwipeLeft = () => {
    this.sendActionCommand(commands.LEFT)
  }

  onSwipeDown = () => {
    this.sendActionCommand(commands.DOWN)
  }

  sendActionCommand = (value: string) => {
    const { socket } = this.props
    socket.emit(commands.ACTION, value)
  }

  componentDidMount() {
    const { socket } = this.props
    socket.on("state", (state: Required<ControllerState>) => {
      this.setState(state)
    })
  }

  render() {
    this.sendPageView()
    return this.renderView()
  }

  private sendPageView() {
    const { activeView } = this.state
    if (!activeView) {
      return
    }

    if (activeView === this.previousActiveView) {
      return
    }
    this.previousActiveView = activeView

    const { analytics } = this.props
    analytics.sendPageView(activeView)
  }

  private renderView() {
    const { activeView, queueLength = 0 } = this.state

    switch (activeView) {
      case views.CONTROLLER_GAME_OFFLINE:
        return <NotRunning />
      case views.CONTROLLER_IN_QUEUE:
        return <InQueue queueLength={queueLength} />
      case views.CONTROLLER_START:
        return <StartGame onStartGame={this.onStartGame} />
      case views.CONTROLLER_GAME_CONTROLS:
        return (
          <GameController
            onSwipeRight={this.onSwipeRight}
            onSwipeDown={this.onSwipeDown}
            onSwipeLeft={this.onSwipeLeft}
            onTap={this.onTap}
          />
        )
      case views.CONTROLLER_GAME_OVER:
        return <GameOver onRestart={this.onJoinGame} />
      case undefined:
      default:
        return <Loading />
    }
  }
}

export default pageWithAnalytics(pageWithSocket(Controller, "/controller"))
