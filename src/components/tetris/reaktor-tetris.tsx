import React, { Component } from "react"
import { ReaktorGame } from "../../games/tetris/reaktor-game"
import { Tetris } from "./tetris"

export class ReaktorTetris extends Component {
  private game = new ReaktorGame()

  async componentDidMount() {
    await this.game.start()
  }

  render() {
    return <Tetris game={this.game} />
  }
}
