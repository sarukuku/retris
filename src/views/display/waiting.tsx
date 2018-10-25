import React, { Component } from "react"

interface WaitingProps {
  address: string
}

export class Waiting extends Component<WaitingProps> {
  render() {
    const { address } = this.props
    return (
      <div className="wrap">
        <h1>{`Go to ${address} to start playing! 🎮`}</h1>
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
