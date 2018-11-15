import { NextContext } from "next"
import React, { Component } from "react"
import io from "socket.io-client"
import { commands } from "../commands"
import { AnalyticsProps, withAnalytics } from "../components/with-analytics"
import { DisplayState } from "../server/state"
import { colors } from "../styles/colors"
import { views } from "../views"
import { Game } from "../views/display/game"
import { GameOver } from "../views/display/game-over"
import { Waiting } from "../views/display/waiting"
import { WaitingToStart } from "../views/display/waiting-to-start"

interface DisplayProps extends AnalyticsProps {
  address: string
}

interface DisplayComponentState {
  socket: typeof io.Socket | null
  activeView: string
  previousActiveView?: string
  score: number
  queueLength: number
}

class Display extends Component<DisplayProps, DisplayComponentState> {
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
    const { socket } = this.state
    if (socket) {
      socket.close()
    }
  }

  addToScore = (score: number) => {
    this.setState(prevState => {
      return { score: prevState.score + score }
    })
  }

  gameOver = (totalScore: number) => {
    const { analytics } = this.props
    this.setState({ score: totalScore })
    analytics.sendCustomEvent({
      category: "GameOver",
      action: "TotalScore",
      value: totalScore,
    })

    const { socket } = this.state
    if (socket) {
      socket.emit(commands.GAME_OVER)
    }
  }

  render() {
    const { queueLength } = this.state

    this.sendPageView()

    return (
      <main>
        <div className="info-bar">{queueLength} people in queue</div>
        <div className="view">{this.renderView()}</div>
        <style jsx>{`
          main {
            background-color: ${colors.PETER_RIVER};
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

  private sendPageView() {
    const { activeView, previousActiveView } = this.state
    if (activeView === previousActiveView) {
      return
    }

    const { analytics } = this.props
    analytics.sendPageView(activeView)
  }

  private renderView() {
    const { address } = this.props
    const { activeView, socket, score } = this.state

    switch (activeView) {
      default:
      case views.DISPLAY_WAITING:
        return <Waiting address={address} />
      case views.DISPLAY_WAITING_TO_START:
        return <WaitingToStart />
      case views.DISPLAY_GAME:
        if (!socket) {
          throw new Error("Socket is not available")
        }
        return <Game socket={socket} onGameOver={this.gameOver} />
      case views.DISPLAY_GAME_OVER:
        return <GameOver score={score} />
    }
  }
}

export default withAnalytics(Display)
