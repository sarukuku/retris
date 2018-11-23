import { NextContext } from "next"
import React, { Component } from "react"
import { Subject, Subscription } from "rxjs"
import { commands } from "../commands"
import { AnalyticsProps, pageWithAnalytics } from "../components/with-analytics"
import { pageWithSocket, SocketProps } from "../components/with-socket"
import { DisplayState } from "../server/state"
import { colors } from "../styles/colors"
import { views } from "../views"
import { DisplayGame } from "../views/display/display-game"
import { GameOver } from "../views/display/game-over"
import { Waiting } from "../views/display/waiting"
import { WaitingToStart } from "../views/display/waiting-to-start"

interface DisplayProps extends AnalyticsProps, SocketProps {
  address: string
}

interface DisplayComponentState {
  activeView: string
  score: number
  queueLength: number
}

class Display extends Component<DisplayProps, DisplayComponentState> {
  private previousActiveView?: string
  private subscriptions: Subscription[] = []

  state: DisplayComponentState = {
    activeView: views.DISPLAY_WAITING,
    score: 0,
    queueLength: 0,
  }

  private actionCommand = new Subject<string>()
  private gameOver = new Subject<number>()

  static async getInitialProps(ctx: NextContext) {
    if (ctx.req) {
      return { address: ctx.req.headers.host }
    }
    return { address: window.location.origin }
  }

  componentDidMount() {
    const { socket } = this.props
    socket.on("state", (data: Required<DisplayState>) => {
      this.setState(data)
    })
    socket.on(commands.ACTION, (action: string) =>
      this.actionCommand.next(action),
    )
    this.subscriptions.push(
      this.gameOver.subscribe((totalScore: number) => {
        const { analytics } = this.props
        this.setState({ score: totalScore })

        analytics.sendCustomEvent({
          category: "GameOver",
          action: "TotalScore",
          value: totalScore,
        })

        socket.emit(commands.GAME_OVER)
      }),
    )
  }

  componentWillUnmount() {
    this.subscriptions.map(s => s.unsubscribe())
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
    const { activeView } = this.state
    if (activeView === this.previousActiveView) {
      return
    }
    this.previousActiveView = activeView

    const { analytics } = this.props
    analytics.sendPageView(activeView)
  }

  private renderView() {
    const { address } = this.props
    const { activeView, score } = this.state

    switch (activeView) {
      default:
      case views.DISPLAY_WAITING:
        return <Waiting address={address} />
      case views.DISPLAY_WAITING_TO_START:
        return <WaitingToStart />
      case views.DISPLAY_GAME:
        return (
          <DisplayGame
            actionCommand={this.actionCommand}
            gameOver={this.gameOver}
            staticPath="/static"
          />
        )
      case views.DISPLAY_GAME_OVER:
        return <GameOver score={score} />
    }
  }
}

export default pageWithAnalytics(pageWithSocket(Display, "/display"))
