import React, { Component } from "react"
import Swipeable from "react-swipeable"
import io from "socket.io-client"
import { commands } from "../../commands"
import { colors } from "../../styles/colors"

interface GameControllerProps {
  socket: typeof io.Socket
}

export class GameController extends Component<GameControllerProps> {
  sendCommand = (value: string) => {
    this.props.socket.emit("action", value)
  }

  onTap = () => {
    this.sendCommand(commands.TAP)
  }

  onSwipeRight = () => {
    this.sendCommand(commands.RIGHT)
  }

  onSwipeLeft = () => {
    this.sendCommand(commands.LEFT)
  }

  onSwipeDown = () => {
    this.sendCommand(commands.DOWN)
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
