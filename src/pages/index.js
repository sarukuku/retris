import { Component } from "react"
import io from "socket.io-client"
import GameControls from "../views/controller/gameControls"
import GameQueue from "../views/controller/inQueue"
import JoinGame from "../views/controller/joinGame"
import ConfirmStartGame from "../views/controller/startGame"
import GameNotRunning from "../views/controller/notRunning"
import GameOver from "../views/controller/gameOver"
import {
  CONTROLLER_GAME_OFFLINE,
  CONTROLLER_JOIN,
  CONTROLLER_IN_QUEUE,
  CONTROLLER_START,
  CONTROLLER_GAME_CONTROLS,
  CONTROLLER_GAME_OVER
} from "../lib/views"
import { COMMAND_CONTROLLER_JOIN, COMMAND_START } from "../lib/commands"

export default class GameController extends Component {
  state = {
    socket: null,
    activeView: CONTROLLER_JOIN,
    queueLength: 0
  }

  joinGame = () => {
    this.state.socket.emit(COMMAND_CONTROLLER_JOIN)
  }

  startGame = () => {
    this.state.socket.emit(COMMAND_START)
  }

  componentDidMount() {
    const socket = io("/controller")

    socket.on("connect", () => {
      this.setState({ socket })
    })

    socket.on("command", data => {
      let { activeView, queueLength } = data
      this.setState({ activeView, queueLength })
    })
  }

  componentWillUnmount() {
    this.state.socket.close()
  }

  render() {
    let { activeView, queueLength, socket } = this.state

    return (
      <div>
        {(() => {
          switch (activeView) {
            case CONTROLLER_GAME_OFFLINE:
              return <GameNotRunning />
            case CONTROLLER_JOIN:
              return <JoinGame joinGame={this.joinGame} />
            case CONTROLLER_IN_QUEUE:
              return <GameQueue queueLength={queueLength} />
            case CONTROLLER_START:
              return <ConfirmStartGame startGame={this.startGame} />
            case CONTROLLER_GAME_CONTROLS:
              return (
                <GameControls
                  socket={socket}
                  stop={() => console.log("stop game")}
                />
              )
            case CONTROLLER_GAME_OVER:
              return <GameOver />
          }
        })()}
      </div>
    )
  }
}
