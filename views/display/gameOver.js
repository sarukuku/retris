import { Component } from 'react'
import JoinHelpBar from '../../components/joinHelpBar'
import css from 'styled-jsx/css'

export default class DisplayGameOver extends Component {
  render () {
    const { score } = this.props

    const { className, styles } = css.resolve`
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
    `

    return (
      <div className='wrap'>
        <h1>💥 Game Over 💥</h1>
        <h1>You got {score} points 😬</h1>
        <JoinHelpBar className={className} />
        {styles}
        <style jsx>{`
          .wrap {
            width: 100%;
            height: 100vh;
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
