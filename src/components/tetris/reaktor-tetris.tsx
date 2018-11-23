import React, { Component } from "react"
import { ReaktorGame } from "../../games/tetris/reaktor-game"
import { Tetris } from "./tetris"

interface ReaktorTetrisProps {
  staticPath: string
}

export class ReaktorTetris extends Component<ReaktorTetrisProps> {
  private game = new ReaktorGame()

  async componentDidMount() {
    await this.game.start()
  }

  render() {
    const { staticPath } = this.props
    return <Tetris game={this.game} staticPath={staticPath} />
  }
}
