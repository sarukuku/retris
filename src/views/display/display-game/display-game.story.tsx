import { storiesOf } from "@storybook/react"
import React, { Component, Fragment } from "react"
import { Subject } from "rxjs"
import { commands } from "../../../commands"
import { DisplayGame } from "./display-game"

storiesOf("Tetris", module).add("Tetris", () => <TetrisWrapper />)

class TetrisWrapper extends Component {
  private actionCommand = new Subject<string>()

  componentDidMount() {
    document.addEventListener("keydown", e => {
      switch (e.key) {
        case "ArrowDown":
          this.actionCommand.next(commands.DOWN)
          break
        case "ArrowLeft":
          this.actionCommand.next(commands.LEFT)
          break
        case "ArrowRight":
          this.actionCommand.next(commands.RIGHT)
          break
        case "Enter":
        case " ":
        case "ArrowUp":
          this.actionCommand.next(commands.TAP)
          break
      }
    })
  }

  render() {
    return (
      <Fragment>
        <div className="tetris-wrapper">
          <DisplayGame
            actionCommand={this.actionCommand}
            gameOver={new Subject<number>()}
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

          .tetris-wrapper .wrap {
            width: 100%;
            height: 100%;
          }
        `}</style>
      </Fragment>
    )
  }
}
