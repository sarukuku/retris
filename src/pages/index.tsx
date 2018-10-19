import React, { Component } from "react"
import io from "socket.io-client"
import { GameController } from "../views/controller/game-controller"
import { InQueue } from "../views/controller/in-queue"
import { JoinGame } from "../views/controller/join-game"
import { StartGame } from "../views/controller/start-game"
import { NotRunning } from "../views/controller/not-running"
import { GameOver } from "../views/controller/game-over"
import { views } from "../lib/views"
import { commands } from "../lib/commands"
import { ControllerState } from "../server"

interface IndexState {
  socket: typeof io.Socket | null
  activeView: string
  queueLength: number
}

export default class Index extends Component<{}, IndexState> {
  state: IndexState = {
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
              return <NotRunning />
            case views.CONTROLLER_JOIN:
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
