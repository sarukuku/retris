import React, { Component } from "react"
import { isBrowser } from "../../helpers"

export class Waiting extends Component {
  render() {
    return (
      <div className="wrap">
        <h1>{`Go to ${
          isBrowser() ? window.location.origin : "..."
        } to start playing! 🎮`}</h1>
        <style jsx>{`
          .wrap {
            width: 100%;
            height: 100vh;
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
