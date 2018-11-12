import React, { Component } from "react"
import io from "socket.io-client"
import { commands } from "../commands"
import { ControllerState } from "../server/state"
import { views } from "../views"
import { GameController } from "../views/controller/game-controller"
import { GameOver } from "../views/controller/game-over"
import { InQueue } from "../views/controller/in-queue"
import { JoinGame } from "../views/controller/join-game"
import { NotRunning } from "../views/controller/not-running"
import { StartGame } from "../views/controller/start-game"

interface ControllerComponentState {
  socket: typeof io.Socket | null
  activeView: string
  queueLength: number
}

export default class Controller extends Component<
  {},
  ControllerComponentState
> {
  state: ControllerComponentState = {
    socket: null,
    activeView: views.CONTROLLER_JOIN,
    queueLength: 0,
  }

  onJoinGame = () => {
    this.sendCommand(commands.JOIN)
  }

  onStartGame = () => {
    this.sendCommand(commands.START)
  }

  onRestart = () => {
    this.sendCommand(commands.RESTART)
  }

  sendCommand = (command: string) => {
    const { socket } = this.state
    if (socket) {
      socket.emit(command)
    }
  }

  onTap = () => {
    this.sendAction(commands.TAP)
  }

  onSwipeRight = () => {
    this.sendAction(commands.RIGHT)
  }

  onSwipeLeft = () => {
    this.sendAction(commands.LEFT)
  }

  onSwipeDown = () => {
    this.sendAction(commands.DOWN)
  }

  sendAction = (value: string) => {
    const { socket } = this.state
    if (socket) {
      socket.emit(commands.ACTION, value)
    }
  }

  componentDidMount() {
    const socket = io("/controller")

    socket.on("connect", () => {
      this.setState({ socket })
    })

    socket.on("state", (state: Required<ControllerState>) => {
      this.setState(state)
    })
  }

  componentWillUnmount() {
    const { socket } = this.state
    if (socket) {
      socket.close()
    }
  }

  render() {
    const view = this.renderView()
    return <div>{view}</div>
  }

  private renderView() {
    const { activeView, queueLength } = this.state

    switch (activeView) {
      default:
      case views.CONTROLLER_GAME_OFFLINE:
        return <NotRunning />
      case views.CONTROLLER_JOIN:
        return <JoinGame onJoinGame={this.onJoinGame} />
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
        return <GameOver onRestart={this.onRestart} />
    }
  }
}
