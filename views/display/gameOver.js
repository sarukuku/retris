import { Component } from 'react'

export default class DisplayGameOver extends Component {
  render () {
    return (
      <div className='wrap'>
        <h1>Game Over!</h1>
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
