import { Component } from 'react';
import { START } from '../../lib/commands';

export default class GameQueue extends Component {
  createCommand = value => {
    return {
      value: value
    }
  }

  start = () => {
    this.props.socket.emit('start');
    this.props.start();
  }

  isCurrentPlayer = () => {
    return this.props.thisId && this.props.currentPlayerId === this.props.thisId;
  }

  queuePosition = () => {
    const pos = '' + this.props.queue.indexOf(this.props.thisId);
    if (pos.endsWith('1')) return `${pos}st`;
    else if (pos.endsWith('2')) return `${pos}nd`;
    else if (pos.endsWith('3')) return `${pos}rd`;
    else return `${pos}th`;
  }

  render() {
    return (
      <main style={{ width: '100%', height: '100%', position: 'fixed', backgroundColor: 'green' }}>
        {this.isCurrentPlayer() ? (
          <div>
            <p>You are the next player. Press start to begin when ready.</p>
            <button onClick={this.start}>Start the game!</button>
          </div>
        ) : (
            <p>You are {this.queuePosition()} in the queue</p>
          )}
        <ul>
          <li>Tap to rotate</li>
          <li>Swipe left or right to move sideways</li>
          <li>Swipe down to drop</li>
        </ul>
      </main>
    )
  }
}
