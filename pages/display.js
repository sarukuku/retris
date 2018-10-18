import { Component } from "react"
import io from "socket.io-client"
import {
  DISPLAY_WAITING,
  DISPLAY_WAITING_TO_START,
  DISPLAY_GAME,
  DISPLAY_GAME_OVER
} from "../lib/views"
import Waiting from "../views/display/waiting"
import WaitingToStart from "../views/display/waitingToStart"
import Game from "../views/display/game"
import GameOver from "../views/display/gameOver"
import { PETER_RIVER } from "../lib/styles/colors"
import { COMMAND_DISPLAY_JOIN, COMMAND_GAME_OVER } from "../lib/commands"
export default class Display extends Component {
  state = {
    socket: null,
    activeView: DISPLAY_WAITING,
    score: 0,
    queueLength: 0
  }

  componentDidMount() {
    const socket = io("/display")

    socket.on("connect", () => {
      this.setState({ socket })
      socket.emit(COMMAND_DISPLAY_JOIN)
    })

    socket.on("command", data => {
      let { activeView, queueLength } = data
      this.setState({ activeView, queueLength })
    })
  }

  componentWillUnmount() {
    this.state.socket.close()
  }

  addToScore = integer => {
    this.setState(prevState => {
      return { score: prevState.score + integer }
    })
  }

  resetScore = () => {
    this.setState({ score: 0 })
  }

  gameOver = () => {
    this.state.socket.emit(COMMAND_GAME_OVER)
  }

  render() {
    let { activeView, score, socket } = this.state

    return (
      <main>
        <p className="queue-length">{this.state.queueLength} people in queue</p>
        {(() => {
          switch (activeView) {
            case DISPLAY_WAITING:
              return <Waiting />
            case DISPLAY_WAITING_TO_START:
              return <WaitingToStart />
            case DISPLAY_GAME:
              return (
                <Game
                  socket={socket}
                  addToScore={this.addToScore}
                  resetScore={this.resetScore}
                  score={score}
                  onGameOver={this.gameOver}
                />
              )
            case DISPLAY_GAME_OVER:
              return <GameOver score={score} />
          }
        })()}
        <style jsx>{`
          main {
            background-color: ${PETER_RIVER};
            background-image: url("/static/r-symbol.png");
            background-size: 50px;
            background-repeat: no-repeat;
            background-position: 1vw 1vw;
          }

          .queue-length {
            margin: 0;
            text-align: right;
            padding: 10px;
          }
        `}</style>
      </main>
    )
  }
}
