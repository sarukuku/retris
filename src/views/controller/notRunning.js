import { Component } from "react"

export default class GameNotRunning extends Component {
  render() {
    return (
      <div className="wrap">
        <p>The game display isn't connected. Please connect it first.</p>
        <style jsx>{`
          .wrap {
            width: 100%;
            height: 100%;
            position: fixed;
            display: flex;
            justify-content: center;
            align-items: center;
            text-align: center;
            border: 2px solid black;
          }

          p {
            padding: 5vw;
          }
        `}</style>
      </div>
    )
  }
}
