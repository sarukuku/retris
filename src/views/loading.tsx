import React, { Component } from "react"

export class Loading extends Component {
  render() {
    return (
      <main>
        <img src="/static/r-symbol.png" />
        <style jsx>{`
          img {
            position: fixed;
            top: 50%;
            left: 50%;
            width: 20%;
            margin: -10% 0 0 -10%;
            animation: spin 3s linear infinite;
          }

          @keyframes spin {
            49%,
            51% {
              transform: scale(-1, 1);
            }

            100% {
              transform: scale(1, 1);
            }
          }
        `}</style>
      </main>
    )
  }
}
