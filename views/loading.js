import { Component } from "react"

export default class Loading extends Component {
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
            -webkit-animation: spin 3s linear infinite;
            -moz-animation: spin 3s linear infinite;
            animation: spin 3s linear infinite;
          }

          @-moz-keyframes spin {
            49%,
            51% {
              -moz-transform: scale(-1, 1);
            }

            100% {
              -moz-transform: scale(1, 1);
            }
          }

          @-webkit-keyframes spin {
            49%,
            51% {
              -webkit-transform: scale(-1, 1);
            }

            100% {
              -webkit-transform: scale(1, 1);
            }
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
