import { Component } from 'react'
import GameControls from '../views/controller/gameControls'
import GameQueue from '../views/controller/queue'
import JoinGame from '../views/controller/joinGame'

export default class GameController extends Component {
  state = {
    subscribe: false,
    subscribed: false,
    queue: [],
    currentPlayerId: null,
    thisId: null,
    gameRunning: false
  }

  static getDerivedStateFromProps(props, state) {
    if (props.socket && !state.subscribe) return { subscribe: true }
    return null;
  }

  subscribe = () => {
    if (this.state.subscribe && !this.state.subscribed) {
      this.props.socket.on('gameState', this.updateGameState);
      this.props.socket.on('gameJoined', this.joinGame)
      this.setState({ subscribed: true });
    }
  }

  componentDidMount() {
    this.subscribe()
  }

  componentDidUpdate() {
    this.subscribe()
  }

  joinGame = id => {
    this.setState({ thisId: id })
  }

  updateGameState = newState => {
    const { queue, currentPlayerId } = JSON.parse(newState);
    this.setState({ queue, currentPlayerId });
  }

  isCurrentPlayer = () => {
    return this.state.thisId && this.state.currentPlayerId === this.state.thisId;
  }

  start = () => {
    this.setState({ gameRunning: true });
  }

  stop = () => {
    this.setState({ gameRunning: false });
  }

  render() {
    return (
      <div>
        {(() => {
          if (!this.state.thisId) {
            return <JoinGame socket={this.props.socket} />;
          } else if (this.isCurrentPlayer() && this.state.gameRunning) {
            return <GameControls socket={this.props.socket} stop={this.stop} />;
          } else {
            return <GameQueue {...this.state} socket={this.props.socket} start={this.start} />;
          }
        })()}
      </div>
    )
  }
}
