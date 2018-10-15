import { Component } from "react"
import Swipeable from "react-swipeable"
import {
  COMMAND_LEFT,
  COMMAND_RIGHT,
  COMMAND_DOWN,
  COMMAND_ROTATE
} from "../../lib/commands"
import { PETER_RIVER, BELIZE_HOLE } from "../../lib/styles/colors"

export default class GameController extends Component {
  sendCommand = value => {
    this.props.socket.emit("gameCommand", value)
  }

  onTap = () => {
    this.sendCommand(COMMAND_ROTATE)
  }

  onSwipeRight = () => {
    this.sendCommand(COMMAND_RIGHT)
  }

  onSwipeLeft = () => {
    this.sendCommand(COMMAND_LEFT)
  }

  onSwipeDown = () => {
    this.sendCommand(COMMAND_DOWN)
  }

  render() {
    return (
      <Swipeable
        onSwipedRight={this.onSwipeRight}
        onSwipedDown={this.onSwipeDown}
        onSwipedLeft={this.onSwipeLeft}
        stopPropagation={true}
        delta={50}
      >
        <main className="wrap" onClick={this.onTap}>
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
            background-color: ${PETER_RIVER};
            border: 6px solid ${BELIZE_HOLE};
            padding: 2rem;
          }

          p {
            color: ${BELIZE_HOLE};
          }
        `}</style>
      </Swipeable>
    )
  }
}
