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
    activeView: views.JOIN,
    queueLength: 0,
  }

  joinGame = () => {
    this.state.socket!.emit(commands.JOIN)
  }

  startGame = () => {
    this.state.socket!.emit(commands.START)
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
    this.state.socket!.close()
  }

  render() {
    const { activeView, queueLength, socket } = this.state

    return (
      <div>
        {(() => {
          switch (activeView) {
            case views.CONTROLLER_GAME_OFFLINE:
              return <NotRunning />
            case views.JOIN:
              return <JoinGame joinGame={this.joinGame} />
            case views.CONTROLLER_IN_QUEUE:
              return <InQueue queueLength={queueLength} />
            case views.CONTROLLER_START:
              return <StartGame startGame={this.startGame} />
            case views.CONTROLLER_GAME_CONTROLS:
              return <GameController socket={socket!} />
            case views.CONTROLLER_GAME_OVER:
              return <GameOver />
          }
        })()}
      </div>
    )
  }
}
