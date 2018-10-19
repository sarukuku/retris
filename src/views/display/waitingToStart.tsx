import React, { Component } from "react"
import JoinHelpBar from "../../components/joinHelpBar"
import css from "styled-jsx/css"

export default class DisplayWaitingToStart extends Component {
  render() {
    const { className, styles } = css.resolve`
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
    `

    return (
      <div className="wrap">
        <h1>Players in queue! Waiting for a player to start... 🤖</h1>
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
        `}</style>
      </div>
    )
  }
}
