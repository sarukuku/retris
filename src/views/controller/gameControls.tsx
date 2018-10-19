import React, { Component } from "react"
import Swipeable from "react-swipeable"
import io from "socket.io-client"
import { commands } from "../../lib/commands"
import { PETER_RIVER, BELIZE_HOLE } from "../../lib/styles/colors"

interface GameControllerProps {
  socket: typeof io.Socket
}

export default class GameController extends Component<GameControllerProps> {
  sendCommand = (value: string) => {
    this.props.socket.emit("gameCommand", value)
  }

  onTap = () => {
    this.sendCommand(commands.COMMAND_ROTATE)
  }

  onSwipeRight = () => {
    this.sendCommand(commands.COMMAND_RIGHT)
  }

  onSwipeLeft = () => {
    this.sendCommand(commands.COMMAND_LEFT)
  }

  onSwipeDown = () => {
    this.sendCommand(commands.COMMAND_DOWN)
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
