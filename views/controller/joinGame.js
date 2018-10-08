import { Component } from 'react'

export default class JoinGame extends Component {
  
  joinGame = () => {
    this.props.socket.emit('joinGame')
  }

  render() {
    return (
      <div style={{ width: '100%', height: '100%', position: 'fixed', backgroundColor: 'green' }}>
        <div onClick={this.joinGame}>Click to join the game</div>
      </div>
    )
  }
}
