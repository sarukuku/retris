import { storiesOf } from "@storybook/react"
import React, { Component, Fragment } from "react"
import { Game } from "../../games/tetris/game"
import { Tetris } from "./tetris"

storiesOf("Tetris", module).add("Tetris", () => <TetrisWrapper />)

class TetrisWrapper extends Component {
  private game = new Game({ columnCount: 10, rowCount: 16 })

  componentDidMount() {
    document.addEventListener("keydown", e => {
      switch (e.key) {
        case "ArrowDown":
          this.game.down()
          break
        case "ArrowLeft":
          this.game.left()
          break
        case "ArrowRight":
          this.game.right()
          break
        case "Enter":
        case " ":
        case "ArrowUp":
          this.game.rotate()
          break
      }
    })
  }

  render() {
    return (
      <Fragment>
        <div className="tetris-wrapper">
          <Tetris
            game={this.game}
            onGameOver={() => undefined}
            staticPath={""}
          />
        </div>
        <style global={true} jsx>{`
          html,
          body,
          #root {
            width: 100%;
            height: 100%;
          }

          .tetris-wrapper {
            width: 95%;
            height: 95%;
          }
        `}</style>
      </Fragment>
    )
  }
}
