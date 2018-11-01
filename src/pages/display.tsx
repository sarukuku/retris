import { NextContext } from "next"
import React, { Component } from "react"
import io from "socket.io-client"
import { commands } from "../commands"
import { DisplayState } from "../server/state"
import { PETER_RIVER } from "../styles/colors"
import { views } from "../views"
import { Game } from "../views/display/game"
import { GameOver } from "../views/display/game-over"
import { Waiting } from "../views/display/waiting"
import { WaitingToStart } from "../views/display/waiting-to-start"

interface DisplayProps {
  address: string
}

interface DisplayComponentState {
  socket: typeof io.Socket | null
  activeView: string
  score: number
  queueLength: number
}

export default class Display extends Component<
  DisplayProps,
  DisplayComponentState
> {
  state: DisplayComponentState = {
    socket: null,
    activeView: views.DISPLAY_WAITING,
    score: 0,
    queueLength: 0,
  }

  static async getInitialProps(ctx: NextContext) {
    if (ctx.req) {
      return { address: ctx.req.headers.host }
    }
    return { address: window.location.origin }
  }

  componentDidMount() {
    const socket = io("/display")

    socket.on("connect", () => {
      this.setState({ socket })
    })

    socket.on("state", (data: Required<DisplayState>) => {
      this.setState(data)
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

  gameOver = (totalScore: number) => {
    this.setState({ score: totalScore })
    this.state.socket!.emit(commands.GAME_OVER)
  }

  render() {
    const { address } = this.props
    const { activeView, score, socket } = this.state

    return (
      <main>
        <div className="info-bar">{this.state.queueLength} people in queue</div>
        <div className="view">
          {(() => {
            switch (activeView) {
              case views.DISPLAY_WAITING:
                return <Waiting address={address} />
              case views.DISPLAY_WAITING_TO_START:
                return <WaitingToStart />
              case views.DISPLAY_GAME:
                return <Game socket={socket!} onGameOver={this.gameOver} />
              case views.DISPLAY_GAME_OVER:
                return <GameOver score={score} />
            }
          })()}
        </div>
        <style jsx>{`
          main {
            background-color: ${PETER_RIVER};
            background-image: url("/static/r-symbol.png");
            background-size: 50px;
            background-repeat: no-repeat;
            background-position: 1vw 1vw;
            height: 100vh;
            display: flex;
            flex-direction: column;
          }

          .info-bar {
            text-align: right;
            padding: 10px;
          }

          .view {
            flex-grow: 1;
            display: flex;
          }
        `}</style>
      </main>
    )
  }
}
