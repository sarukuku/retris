import React, { Component } from "react"
import io from "socket.io-client"
import GameControls from "../views/controller/gameControls"
import GameQueue from "../views/controller/inQueue"
import JoinGame from "../views/controller/joinGame"
import ConfirmStartGame from "../views/controller/startGame"
import GameNotRunning from "../views/controller/notRunning"
import GameOver from "../views/controller/gameOver"
import { views } from "../lib/views"
import { commands } from "../lib/commands"
import { ControllerState } from "src/server"

interface GameControllerState {
  socket: typeof io.Socket | null
  activeView: string
  queueLength: number
}

export default class GameController extends Component<{}, GameControllerState> {
  state: GameControllerState = {
    socket: null,
    activeView: views.CONTROLLER_JOIN,
    queueLength: 0
  }

  joinGame = () => {
    this.state.socket!.emit(commands.COMMAND_CONTROLLER_JOIN)
  }

  startGame = () => {
    this.state.socket!.emit(commands.COMMAND_START)
  }

  componentDidMount() {
    const socket = io("/controller")

    socket.on("connect", () => {
      this.setState({ socket })
    })

    socket.on("command", (data: ControllerState) => {
      let { activeView, queueLength } = data
      this.setState({ activeView, queueLength })
    })
  }

  componentWillUnmount() {
    this.state.socket!.close()
  }

  render() {
    let { activeView, queueLength, socket } = this.state

    return (
      <div>
        {(() => {
          switch (activeView) {
            case views.CONTROLLER_GAME_OFFLINE:
              return <GameNotRunning />
            case views.CONTROLLER_JOIN:
              return <JoinGame joinGame={this.joinGame} />
            case views.CONTROLLER_IN_QUEUE:
              return <GameQueue queueLength={queueLength} />
            case views.CONTROLLER_START:
              return <ConfirmStartGame startGame={this.startGame} />
            case views.CONTROLLER_GAME_CONTROLS:
              return <GameControls socket={socket!} />
            case views.CONTROLLER_GAME_OVER:
              return <GameOver />
          }
        })()}
      </div>
    )
  }
}
