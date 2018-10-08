import { Component } from 'react'

export default class DisplayWaitingToStart extends Component {
  render () {
    return (
      <div className='wrap'>
        <h1>Waiting for next player in queue to start... 🤖</h1>
        <style jsx>{`
          .wrap {
            width: 100%;
            height: 100vh;
            background: gray;
            display: flex;
            text-align: center;
            justify-content: center;
            align-items: center;
          }
        `}</style>
      </div>
    )
  }
}
