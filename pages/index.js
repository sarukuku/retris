import { Component } from 'react'
import GameControls from '../views/controller/gameControls'
import GameQueue from '../views/controller/queue'
import JoinGame from '../views/controller/joinGame'
import GameNotRunning from '../views/controller/notRunning'

export default class GameController extends Component {
  state = {
    queue: [],
    currentPlayerId: null,
    thisId: null,
    gameRunning: false, // 'Host' is present 
    gameStarted: false // This player is playing the game
  }

  addListener(name, callback) {
    if (!this.props.socket.hasListeners(name)) this.props.socket.on(name, callback);
  }

  componentDidMount() {
    this.addListener('gameState', this.updateGameState);
    this.addListener('gameJoined', this.joinGame);
  }

  componentDidUpdate() {
    this.addListener('gameState', this.updateGameState);
    this.addListener('gameJoined', this.joinGame);
  }

  joinGame = id => {
    this.setState({ thisId: id })
  }

  reset = () => {
    this.setState({ queue: [], currentPlayerId: null, thisId: null, gameRunning: false, gameStarted: false });
  }

  updateGameState = newState => {
    console.log(newState);
    const { queue, currentPlayerId, gameRunning } = JSON.parse(newState);
    if (!gameRunning) this.reset();
    else this.setState({ queue, currentPlayerId, gameRunning });
  }

  isCurrentPlayer = () => {
    return this.state.thisId && this.state.currentPlayerId === this.state.thisId;
  }

  start = () => {
    this.setState({ gameStarted: true });
  }

  stop = () => {
    this.setState({ gameStarted: false });
  }

  render() {
    return (
      <div>
        {(() => {
          if (!this.state.gameRunning) {
            return <GameNotRunning />
          } else if (!this.state.thisId) {
            return <JoinGame socket={this.props.socket} />;
          } else if (this.isCurrentPlayer() && this.state.gameStarted) {
            return <GameControls socket={this.props.socket} stop={this.stop} />;
          } else {
            return <GameQueue {...this.state} socket={this.props.socket} start={this.start} />;
          }
        })()}
      </div>
    )
  }
}
