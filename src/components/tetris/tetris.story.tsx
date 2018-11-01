import React, { Component, Fragment } from "react"

import { storiesOf } from "@storybook/react"
import { Tetris } from "./tetris"

storiesOf("Tetris", module).add("Tetris", () => <TetrisWrapper />)

class TetrisWrapper extends Component {
  componentDidMount() {
    const tetris = this.refs.tetris as Tetris
    document.addEventListener("keydown", e => {
      switch (e.key) {
        case "ArrowDown":
          tetris.down()
          break
        case "ArrowLeft":
          tetris.left()
          break
        case "ArrowRight":
          tetris.right()
          break
        case "Enter":
        case " ":
        case "ArrowUp":
          tetris.rotate()
          break
      }
    })
  }

  render() {
    return (
      <Fragment>
        <div className="tetris-wrapper">
          <Tetris ref="tetris" onGameOver={() => undefined} />
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
