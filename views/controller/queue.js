import { Component } from 'react'
import { PETER_RIVER, EMERALD } from '../../lib/styles/colors'

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
      <main className='wrap'>
        {this.isCurrentPlayer() ? (
          <React.Fragment>
            <p>It's your turn to play! Press Start playing when you're ready.</p>
            <button onClick={this.start}>Start playing</button>
          </React.Fragment>
        ) : (
            <p>You are {this.queuePosition()} in the queue...</p>
          )}
        <style jsx>{`
          .wrap {
            width: 100%;
            height: 100%;
            position: fixed;
            display: flex;
            justify-content: center;
            align-content: center;
            align-items: center;
            background-color: ${PETER_RIVER};
            padding: 1rem;
            flex-wrap: wrap;
            text-align: center;
          }

          p {
            width: 100%;
          }

          button {
            border: 1px solid black;
            padding: 1rem;
            border-radius: 100px;
            background: ${EMERALD};
            box-shadow: 0px 0px 8px 0px rgba(0,0,0,0.75);
          }
        `}</style>
      </main>
    )
  }
}
