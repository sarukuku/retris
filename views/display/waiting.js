import { Component } from 'react'

export default class GameController extends Component {
  render () {
    return (
      <div className='warp'>
        <h1>{`Go to ${window.location.origin} to start playing!`}</h1>
        <style jsx>{`
          .wrap {
            width: 100%;
            height: 100vh;
            background: gray;
            display: flex;
            text-align: center;
          }
        `}</style>
      </div>
    )
  }
}
