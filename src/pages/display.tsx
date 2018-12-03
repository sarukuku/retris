import { NextContext } from "next"
import React, { Component, Fragment } from "react"
import { Subject } from "rxjs"
import io from "socket.io-client"
import { AttractionLoop } from "../components/attraction-loop"
import { BlurredOverlay } from "../components/blurred-overlay"
import { AnalyticsProps, pageWithAnalytics } from "../components/with-analytics"
import {
  AutoUnsubscribeProps,
  pageWithAutoUnsubscribe,
} from "../components/with-auto-unsubscribe"
import {
  pageWithSocket,
  SocketPayload,
  SocketProps,
} from "../components/with-socket"
import { DisplayState } from "../server/state"
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

export class _Display extends Component<DisplayProps, DisplayState> {
  private previousActiveView?: string
  private gameOver = new Subject<void>()

  state: DisplayState = {}

  static async getInitialProps(ctx: NextContext) {
    if (ctx.req) {
      return { address: ctx.req.headers.host }
    }
    return { address: window.location.hostname }
  }

  componentDidMount() {
    const { socket, unsubscribeOnUnmount } = this.props

    unsubscribeOnUnmount(
      socket.subscribe(this.onSocket),
      this.gameOver.subscribe(this.onGameOver),
    )
  }

  private onSocket = ({ event, payload }: SocketPayload) => {
    switch (event) {
      case "state":
        const { activeView } = payload
        this.previousActiveView = this.state.activeView

        this.setState(payload)

        if (activeView === views.DISPLAY_GAME_OVER) {
          if (
            this.previousActiveView &&
            this.previousActiveView !== activeView
          ) {
            this.gameOver.next()
          }
        }

        break
    }
  }

  private onGameOver = () => {
    const { analytics } = this.props
    const { score } = this.state

    analytics.sendCustomEvent({
      category: "GameOver",
      action: "TotalScore",
      value: score,
    })
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

    const { analytics } = this.props
    if (activeView) {
      analytics.sendPageView(activeView)
    }
  }

  private renderView() {
    const { address } = this.props
    const { activeView, score = 0, board } = this.state

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
              {board && (
                <DisplayGame
                  gameOver={this.gameOver}
                  board={board}
                  score={score}
                />
              )}
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
