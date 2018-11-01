import React, { Component } from "react"
import css from "styled-jsx/css"
import { JoinHelpBar } from "../../components/join-help-bar"

export class WaitingToStart extends Component {
  render() {
    const { className, styles } = css.resolve`
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
    `

    return (
      <div className="wrap">
        <h1>Waiting for a player to start... 🤖</h1>
        <JoinHelpBar className={className} />
        {styles}
        <style jsx>{`
          .wrap {
            flex-grow: 1;
            display: flex;
            justify-content: center;
            align-items: center;
          }
        `}</style>
      </div>
    )
  }
}
