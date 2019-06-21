import { complement, isNil } from "ramda"
import React, { Component } from "react"
import { Subject } from "rxjs"
import {
  map,
  filter,
  distinctUntilChanged,
  distinctUntilKeyChanged,
} from "rxjs/operators"
import io from "socket.io-client"
import { commands } from "../commands"
import { AnalyticsProps, pageWithAnalytics } from "../components/with-analytics"
import {
  pageWithAutoUnsubscribe,
  AutoUnsubscribeProps,
} from "../components/with-auto-unsubscribe"
import {
  pageWithSocket,
  SocketProps,
  SocketPayload,
} from "../components/with-socket"
import { ControllerState } from "../server/state"
import { views } from "../views"
import { GameController } from "../views/controller/game-controller"
import { GameOver } from "../views/controller/game-over"
import { InQueue } from "../views/controller/in-queue"
import { NotRunning } from "../views/controller/not-running"
import { StartGame } from "../views/controller/start-game"
import { Loading } from "../views/loading"

function vibrate(pattern: number | number[]): boolean {
  // navigator.vibrate is undefined on iOS, window && window.navigator checks
  // so that this doesn't explode if called accidentally in a non-browser
  // context
  return window && window.navigator && "vibrate" in window.navigator
    ? window.navigator.vibrate(pattern)
    : false
}

function vibrateTurnStart() {
  // kinda like a "ta-dah"
  return vibrate([150, 1, 500])
}

const isNotNil = complement(isNil)

interface ControllerProps
  extends AnalyticsProps,
    SocketProps,
    AutoUnsubscribeProps {}

export class _Controller extends Component<ControllerProps, ControllerState> {
  private actionCommand = new Subject<string>()

  state: ControllerState = {}

  onJoinGame = () => {
    this.sendCommand(commands.JOIN)
  }

  onStartGame = () => {
    this.sendCommand(commands.START)
  }

  sendCommand = (command: string) => {
    const { socket } = this.props
    socket.next({ event: command })
  }

  componentDidMount() {
    const { socket, unsubscribeOnUnmount } = this.props

    const statePayloads = socket.pipe(
      filter<SocketPayload>(({ event }) => event === "state"),
      map<SocketPayload, ControllerState>(({ payload }) => payload),
    )

    const activeViewChanges = statePayloads.pipe(
      map<ControllerState, string | undefined>(payload => payload.activeView),
      filter<string>(isNotNil),
      distinctUntilChanged(),
    )

    const vibrateTriggers = statePayloads.pipe(
      // vibrate when active view changes to the start screen
      distinctUntilKeyChanged("activeView"),
      filter(state => state.activeView === views.CONTROLLER_START),
    )

    unsubscribeOnUnmount(
      this.actionCommand.subscribe((action: string) =>
        socket.next({ event: commands.ACTION, payload: action }),
      ),
      statePayloads.subscribe(state => this.setState(state)),
      vibrateTriggers.subscribe(() => vibrateTurnStart()),
      activeViewChanges.subscribe(this.onSendActiveViewAnalytics),
    )
  }

  private onSendActiveViewAnalytics = (activeView: string) => {
    this.props.analytics.sendPageView(activeView)
  }

  render() {
    const { activeView, positionInQueue = 0, score = 0 } = this.state

    switch (activeView) {
      case views.CONTROLLER_GAME_OFFLINE:
        return <NotRunning />
      case views.CONTROLLER_IN_QUEUE:
        return <InQueue positionInQueue={positionInQueue} />
      case views.CONTROLLER_START:
        return <StartGame onStartGame={this.onStartGame} />
      case views.CONTROLLER_GAME_CONTROLS:
        return <GameController actionCommand={this.actionCommand} />
      case views.CONTROLLER_GAME_OVER:
        return <GameOver score={score} onRestart={this.onJoinGame} />
      case undefined:
      default:
        return <Loading />
    }
  }
}

export default pageWithAutoUnsubscribe(
  pageWithAnalytics(pageWithSocket(_Controller, () => io("/controller"))),
)
