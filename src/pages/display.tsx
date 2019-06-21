import { NextContext } from "next"
import { complement, isNil } from "ramda"
import React, { Component, Fragment } from "react"
import { filter, map, distinctUntilChanged } from "rxjs/operators"
import io from "socket.io-client"
import { AttractionLoop } from "../components/attraction-loop"
import { BlurredOverlay } from "../components/blurred-overlay"
import { FullscreenBar } from "../components/fullscreen-bar"
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
import { zIndices } from "../styles/z-indices"
import { views } from "../views"
import { DisplayGame } from "../views/display/display-game"
import { GameOver } from "../views/display/game-over"
import { Waiting } from "../views/display/waiting"
import { WaitingToStart } from "../views/display/waiting-to-start"

const isNotNil = complement(isNil)

interface DisplayProps
  extends AnalyticsProps,
    SocketProps,
    AutoUnsubscribeProps {
  address: string
}

export class _Display extends Component<DisplayProps, DisplayState> {
  state: DisplayState = {}

  static async getInitialProps(ctx: NextContext) {
    if (ctx.req) {
      return { address: ctx.req.headers.host }
    }
    return { address: window.location.hostname }
  }

  componentDidMount() {
    const { socket, unsubscribeOnUnmount } = this.props

    const statePayloads = socket.pipe(
      filter<SocketPayload>(({ event }) => event === "state"),
      map<SocketPayload, DisplayState>(({ payload }) => payload),
    )

    const activeViewChanges = statePayloads.pipe(
      map<DisplayState, string | undefined>(payload => payload.activeView),
      filter<string>(isNotNil),
      distinctUntilChanged(),
    )

    const gameOverAnalyticsTriggers = activeViewChanges.pipe(
      filter(view => view === views.DISPLAY_GAME_OVER),
    )

    unsubscribeOnUnmount(
      statePayloads.subscribe(this.onSocket),
      activeViewChanges.subscribe(this.onSendActiveViewAnalytics),
      gameOverAnalyticsTriggers.subscribe(this.onGameOver),
    )
  }

  private onSendActiveViewAnalytics = (activeView: string) => {
    this.props.analytics.sendPageView(activeView)
  }

  private onSocket = (payload: any) => {
    this.setState(payload)
  }

  private onGameOver = () => {
    const { analytics } = this.props
    const { score, elapsedSeconds, isForcedGameOver } = this.state

    const label = new Date().toJSON()
    analytics.sendCustomEvent({
      label,
      category: "GameOver",
      action: "TotalScore",
      value: score,
    })
    analytics.sendCustomEvent({
      label,
      category: "GameOver",
      action: "ElapsedSeconds",
      value: elapsedSeconds,
    })
    analytics.sendCustomEvent({
      label,
      category: "GameOver",
      action: "IsForcedGameOver",
      value: isForcedGameOver ? 1 : 0,
    })
  }

  render() {
    return (
      <Fragment>
        <div className="display">
          <div className="fullscreen-bar">
            <FullscreenBar />
          </div>
          {this.renderView()}
        </div>
        <style jsx>{`
          .display {
            height: 100vh;
            position: relative;
          }

          .fullscreen-bar {
            z-index: ${zIndices.FULLSCREEN_BAR};
            position: absolute;
            width: 100%;
          }
        `}</style>
      </Fragment>
    )
  }

  private renderView() {
    const { address } = this.props
    const { activeView, score = 0, board, elapsedSeconds = 0 } = this.state

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
                  elapsedSeconds={elapsedSeconds}
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
