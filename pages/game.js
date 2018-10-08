import { Component } from 'react'
import {
  DISPLAY_WAITING,
  DISPLAY_GAME,
  DISPLAY_WAITING_TO_START,
  DISPALY_GAME_OVER
} from '../lib/views'
import Waiting from '../views/display/waiting'
import WaitingToStart from '../views/display/waitingToStart'
import Game from '../views/display/game'
import GameOver from '../views/display/gameOver'

export default class Display extends Component {
  state = {
    commands: [],
    subscribe: false,
    subscribed: false,
    context: null,
    activeView: DISPLAY_WAITING
  }

  static getDerivedStateFromProps (props, state) {
    if (props.socket && !state.subscribe) return { subscribe: true }
    return null
  }

  subscribeToCommands = callbackFunc => {
    if (this.state.subscribe && !this.state.subscribed) {
      this.props.socket.on('commands', callbackFunc)
      this.setState({ subscribed: true })
    }
  }

  unsubscribeFromCommands = callbackFunc => {
    this.props.socket.off('commands', callbackFunc)
  }

  render () {
    let { activeView } = this.state

    return (
      <main>
        {(() => {
          switch(activeView) {
            case DISPLAY_WAITING:
              return <Waiting />
            case DISPLAY_WAITING_TO_START:
              return <WaitingToStart />
            case DISPLAY_GAME:
              return <Game
                       subscribeToCommands={this.subscribeToCommands}
                       unsubscribeFromCommands={this.unsubscribeFromCommands}
                     />
            case DISPALY_GAME_OVER:
              return <GameOver />
          }
        })()}
      </main>
    )
  }
}
