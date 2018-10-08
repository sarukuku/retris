import { Component } from 'react'
import GameControls from '../views/controller/gameControls'
import GameQueue from '../views/controller/queue'

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

  isCurrentPlayer = () => {
    return this.state.thisId && this.state.currentPlayerId === this.state.thisId;
  }

  start = () => {
    this.setState({ gameRunning: true});
  }

  stop = () => {
    this.setState({ gameRunning: false});
  }

  render() {
    return (
      <div>
        {(this.isCurrentPlayer() && this.state.gameRunning)? (
          <GameControls socket={this.props.socket} stop={this.stop}/>
        ) : (<GameQueue {...this.state} socket={this.props.socket} start={this.start}/>)}
      </div>
    )
  }
}
