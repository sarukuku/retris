import React, { Component } from "react"
import Swipeable from "react-swipeable"
import { Subject } from "rxjs"
import { commands } from "../../commands"
import { colors } from "../../styles/colors"

interface GameControllerProps {
  actionCommand: Subject<string>
}

export class GameController extends Component<GameControllerProps> {
  render() {
    const { actionCommand } = this.props

    return (
      <Swipeable
        onSwipedRight={() => actionCommand.next(commands.RIGHT)}
        onSwipedDown={() => actionCommand.next(commands.DOWN)}
        onSwipedLeft={() => actionCommand.next(commands.LEFT)}
        stopPropagation={true}
        delta={50}
      >
        <main className="wrap" onClick={() => actionCommand.next(commands.TAP)}>
          <p>Tap and swipe to play!</p>
        </main>
        <style jsx>{`
          .wrap {
            width: 100%;
            height: 100%;
            position: fixed;
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: ${colors.PETER_RIVER};
            border: 6px solid ${colors.BELIZE_HOLE};
            padding: 2rem;
          }

          p {
            color: ${colors.BELIZE_HOLE};
          }
        `}</style>
      </Swipeable>
    )
  }
}
