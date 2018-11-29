import { NextContext } from "next"
import React, { Component, Fragment } from "react"
import { Subject } from "rxjs"
import io from "socket.io-client"
import { commands } from "../commands"
import { AttractionLoop } from "../components/attraction-loop"
import { BlurredOverlay } from "../components/blurred-overlay"
import { AnalyticsProps, pageWithAnalytics } from "../components/with-analytics"
import {
  AutoUnsubscribeProps,
  pageWithAutoUnsubscribe,
} from "../components/with-auto-unsubscribe"
import { pageWithSocket, SocketProps } from "../components/with-socket"
import { views } from "../views"
import { DisplayGame } from "../views/display/display-game"
import { GameOver } from "../views/display/game-over"
import { Waiting } from "../views/display/waiting"
import { WaitingToStart } from "../views/display/waiting-to-start"

interface DisplayProps
  extends AnalyticsProps,
    SocketProps,
    AutoUnsubscribeProps {
  address: string
}

interface DisplayComponentState {
  activeView: string
  score: number
  queueLength: number
}

export class _Display extends Component<DisplayProps, DisplayComponentState> {
  private previousActiveView?: string

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
    return { address: window.location.hostname }
  }

  componentDidMount() {
    const { socket, unsubscribeOnUnmount } = this.props

    unsubscribeOnUnmount(
      socket.subscribe(({ event, payload }) => {
        switch (event) {
          case "state":
            this.setState(payload)
            break
          case commands.ACTION:
            this.actionCommand.next(payload)
        }
      }),
      this.gameOver.subscribe(this.onGameOver),
    )
  }

  private onGameOver = (totalScore: number) => {
    const { analytics, socket } = this.props
    this.setState({ score: totalScore })

    analytics.sendCustomEvent({
      category: "GameOver",
      action: "TotalScore",
      value: totalScore,
    })

    socket.next({ event: commands.GAME_OVER, payload: totalScore })
  }

  render() {
    this.sendPageView()
    return (
      <Fragment>
        <div className="display">{this.renderView()}</div>
        <style jsx>{`
          .display {
            height: 100vh;
          }
        `}</style>
      </Fragment>
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
      case views.DISPLAY_WAITING_TO_START:
        return (
          <Fragment>
            {activeView === views.DISPLAY_WAITING ? (
              <Waiting address={address} />
            ) : (
              <WaitingToStart />
            )}
            <AttractionLoop />
          </Fragment>
        )
      case views.DISPLAY_GAME:
      case views.DISPLAY_GAME_OVER:
        const isGameOver = activeView === views.DISPLAY_GAME_OVER
        return (
          <Fragment>
            <BlurredOverlay isActive={isGameOver}>
              <DisplayGame
                actionCommand={this.actionCommand}
                gameOver={this.gameOver}
              />
            </BlurredOverlay>
            {isGameOver && <GameOver score={score} />}
          </Fragment>
        )
    }
  }
}

export default pageWithAutoUnsubscribe(
  pageWithAnalytics(pageWithSocket(_Display, () => io("/display"))),
)
