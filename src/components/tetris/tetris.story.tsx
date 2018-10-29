import React, { Component } from "react"

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
      <div style={{ height: "500px", width: "500px" }}>
        <Tetris ref="tetris" />
      </div>
    )
  }
}
