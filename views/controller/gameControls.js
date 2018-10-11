import { Component } from 'react';
import Swipeable from 'react-swipeable';
import { LEFT, RIGHT, DOWN, ROTATE } from '../../lib/commands';
import { PETER_RIVER, BELIZE_HOLE } from '../../lib/styles/colors'

export default class GameController extends Component {
  createCommand = value => {
    return {
      value: value
    }
  }

  sendCommand = value => {
    const command = this.createCommand(value)
    this.props.socket.emit('commands', command)
  }

  onTap = () => {
    this.sendCommand(ROTATE)
  }

  onSwipeRight = () => {
    this.sendCommand(RIGHT)
  }

  onSwipeLeft = () => {
    this.sendCommand(LEFT)
  }

  onSwipeDown = () => {
    this.sendCommand(DOWN)
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
        <main className='wrap' onClick={this.onTap}>
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
