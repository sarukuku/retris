import React, { Component } from "react"
import { Subject } from "rxjs"
import io from "socket.io-client"
import { commands } from "../commands"
import { AnalyticsProps, pageWithAnalytics } from "../components/with-analytics"
import {
  pageWithAutoUnsubscribe,
  AutoUnsubscribeProps,
} from "../components/with-auto-unsubscribe"
import { pageWithSocket, SocketProps } from "../components/with-socket"
import { ControllerState } from "../server/state"
import { views } from "../views"
import { GameController } from "../views/controller/game-controller"
import { GameOver } from "../views/controller/game-over"
import { InQueue } from "../views/controller/in-queue"
import { NotRunning } from "../views/controller/not-running"
import { StartGame } from "../views/controller/start-game"
import { Loading } from "../views/loading"

interface ControllerProps
  extends AnalyticsProps,
    SocketProps,
    AutoUnsubscribeProps {}

export class _Controller extends Component<ControllerProps, ControllerState> {
  private previousActiveView?: string
  private actionCommand = new Subject<string>()

  state: ControllerState = {}

  onJoinGame = () => {
    this.sendCommand(commands.JOIN)
  }

  onStartGame = () => {
    this.sendCommand(commands.START)
  }

  sendCommand = (command: string) => {
    const { socket } = this.props
    socket.next({ event: command })
  }

  componentDidMount() {
    const { socket, unsubscribeOnUnmount } = this.props
    unsubscribeOnUnmount(
      this.actionCommand.subscribe((action: string) =>
        socket.next({ event: commands.ACTION, payload: action }),
      ),
      socket.subscribe(({ event, payload }) => {
        switch (event) {
          case "state":
            this.setState(payload)
        }
      }),
    )
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
    const { activeView, queueLength = 0, score = 0 } = this.state

    switch (activeView) {
      case views.CONTROLLER_GAME_OFFLINE:
        return <NotRunning />
      case views.CONTROLLER_IN_QUEUE:
        return <InQueue queueLength={queueLength} />
      case views.CONTROLLER_START:
        return <StartGame onStartGame={this.onStartGame} />
      case views.CONTROLLER_GAME_CONTROLS:
        return <GameController actionCommand={this.actionCommand} />
      case views.CONTROLLER_GAME_OVER:
        return <GameOver score={score} onRestart={this.onJoinGame} />
      case undefined:
      default:
        return <Loading />
    }
  }
}

export default pageWithAutoUnsubscribe(
  pageWithAnalytics(pageWithSocket(_Controller, () => io("/controller"))),
)
