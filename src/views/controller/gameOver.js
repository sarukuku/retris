import { Component } from "react"
import { PETER_RIVER } from "../../lib/styles/colors"

export default class GameQueue extends Component {
  render() {
    return (
      <main className="wrap">
        <p>Game Over!</p>
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
        `}</style>
      </main>
    )
  }
}
