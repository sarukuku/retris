import React, { Component } from "react"
import { LoopedReaktorGame } from "../../games/tetris/looped-reaktor-game"
import { TetrisMatrix } from "../../games/tetris/shape"
import {
  AutoUnsubscribeProps,
  withAutoUnsubscribe,
} from "../with-auto-unsubscribe"
import { Tetris } from "./tetris"

interface ReaktorTetrisState {
  board?: TetrisMatrix
}

class _ReaktorTetris extends Component<
  AutoUnsubscribeProps,
  ReaktorTetrisState
> {
  state: ReaktorTetrisState = {}
  private game = new LoopedReaktorGame()

  async componentDidMount() {
    const { unsubscribeOnUnmount } = this.props
    unsubscribeOnUnmount(
      this.game.boardChange.subscribe(board => this.setState({ board })),
    )
    this.game.start()
  }

  componentWillUnmount() {
    this.game.stop()
  }

  render() {
    const { board } = this.state
    return board ? <Tetris board={board} /> : null
  }
}

export const ReaktorTetris = withAutoUnsubscribe(_ReaktorTetris)
