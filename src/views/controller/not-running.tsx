import React, { Component } from "react"
import { colors } from "../../styles/colors"

export class NotRunning extends Component {
  render() {
    return (
      <div className="wrap">
        <p>The game display isn't connected. Please connect it first.</p>
        <style jsx>{`
          .wrap {
            width: 100%;
            height: 100%;
            position: absolute;
            display: flex;
            justify-content: center;
            align-items: center;
            text-align: center;
            background-color: ${colors.BLACK};
            color: ${colors.WHITE};
          }

          p {
            padding: 5vw;
          }
        `}</style>
      </div>
    )
  }
}
