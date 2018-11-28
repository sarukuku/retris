import React, { Component } from "react"
import { LoopedReaktorGame } from "../../games/tetris/looped-reaktor-game"
import { Tetris } from "./tetris"

export class ReaktorTetris extends Component {
  private game = new LoopedReaktorGame()

  async componentDidMount() {
    this.game.start()
  }

  render() {
    return <Tetris game={this.game} />
  }
}
