import React, { Component } from "react"
import io from "socket.io-client"
import { views } from "../lib/views"
import Waiting from "../views/display/waiting"
import WaitingToStart from "../views/display/waitingToStart"
import Game from "../views/display/game"
import GameOver from "../views/display/gameOver"
import { PETER_RIVER } from "../lib/styles/colors"
import { commands } from "../lib/commands"
import { DisplayState } from "src/server"

interface DisplayComponentState {
  socket: typeof io.Socket | null
  activeView: string
  score: number
  queueLength: number
}

export default class Display extends Component<{}, DisplayComponentState> {
  state: DisplayComponentState = {
    socket: null,
    activeView: views.DISPLAY_WAITING,
    score: 0,
    queueLength: 0
  }

  componentDidMount() {
    const socket = io("/display")

    socket.on("connect", () => {
      this.setState({ socket })
      socket.emit(commands.COMMAND_DISPLAY_JOIN)
    })

    socket.on("command", (data: DisplayState) => {
      let { activeView, queueLength } = data
      this.setState({ activeView, queueLength })
    })
  }

  componentWillUnmount() {
    this.state.socket!.close()
  }

  addToScore = (score: number) => {
    this.setState(prevState => {
      return { score: prevState.score + score }
    })
  }

  resetScore = () => {
    this.setState({ score: 0 })
  }

  gameOver = () => {
    this.state.socket!.emit(commands.COMMAND_GAME_OVER)
  }

  render() {
    let { activeView, score, socket } = this.state

    return (
      <main>
        <p className="queue-length">{this.state.queueLength} people in queue</p>
        {(() => {
          switch (activeView) {
            case views.DISPLAY_WAITING:
              return <Waiting />
            case views.DISPLAY_WAITING_TO_START:
              return <WaitingToStart />
            case views.DISPLAY_GAME:
              return (
                <Game
                  socket={socket!}
                  addToScore={this.addToScore}
                  resetScore={this.resetScore}
                  score={score}
                  onGameOver={this.gameOver}
                />
              )
            case views.DISPLAY_GAME_OVER:
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
