import { Component } from 'react'
import { PETER_RIVER, EMERALD } from '../../lib/styles/colors'

export default class JoinGame extends Component {
  
  joinGame = () => {
    this.props.socket.emit('joinGame')
  }

  render() {
    return (
      <div className='wrap'>
        <button onClick={this.joinGame}>Join the game</button>
        <style jsx>{`
          .wrap {
            width: 100%;
            height: 100%;
            position: fixed;
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: ${PETER_RIVER};
          }

          button {
            border: 1px solid black;
            padding: 1rem;
            border-radius: 100px;
            background: ${EMERALD};
            box-shadow: 0px 0px 8px 0px rgba(0,0,0,0.75);
          }
        `}</style>
      </div>
    )
  }
}
