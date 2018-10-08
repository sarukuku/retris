import { Component } from 'react'
import Swipeable from 'react-swipeable'
import { LEFT, RIGHT, DOWN, ROTATE } from '../lib/commands'
let commandCounter = 0

export default class GameController extends Component {
  state = {
    subscribe: false,
    subscribed: false,
    queue: [],
    currentPlayerId: null,
    thisId: null
  }

  static getDerivedStateFromProps(props, state) {
    if (props.socket && !state.subscribe) return { subscribe: true }
    return null;
  }

  subscribe = () => {
    if (this.state.subscribe && !this.state.subscribed) {
      this.props.socket.on('gameState', this.updateGameState);
      this.props.socket.on('connect', () => {
        this.setState({ thisId: this.props.socket.id })
      });
      this.setState({ subscribed: true });
    }
  }

  componentDidMount() {
    this.subscribe()
  }

  componentDidUpdate() {
    this.subscribe()
  }

  updateGameState = newState => {
    const { queue, currentPlayerId } = JSON.parse(newState);
    this.setState({ queue, currentPlayerId });
    console.dir(this.state);
  }

  createCommand = value => {
    commandCounter++
    return {
      id: commandCounter,
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

  isCurrentPlayer = () => {
    return this.state.currentPlayerId === this.state.thisId;
  }

  queuePosition = () => {
    const pos = '' + this.state.queue.indexOf(this.state.thisId);
    if (pos.endsWith('1')) return `${pos}st`;
    else if (pos.endsWith('2')) return `${pos}nd`;
    else if (pos.endsWith('3')) return `${pos}rd`;
    else return `${pos}th`;
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
        <main style={{ width: '100%', height: '100%', position: 'fixed', backgroundColor: 'green' }} onClick={this.onTap}>
          {this.isCurrentPlayer() ? (
            <p>You are the next player. Press start to begin when ready.</p>
          ) : (
              <p>You are {this.queuePosition()} in the queue</p>
            )}
          <ul>
            <li>Tap to rotate</li>
            <li>Swipe left or right to move sideways</li>
            <li>Swipe down to drop</li>
          </ul>
        </main>
      </Swipeable>
    )
  }
}
