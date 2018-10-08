import { Component } from 'react'

export default class DisplayGameOver extends Component {
  render () {
    const { score } = this.props

    return (
      <div className='wrap'>
        <h1>💥 Game Over 💥</h1>
        <h1>You got {score} points 😬</h1>
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

          h1 {
            width: 100%;
          }
        `}</style>
      </div>
    )
  }
}
