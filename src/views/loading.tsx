import React from "react"

export class Loading extends React.Component {
  render() {
    return (
      <div className="wrap">
        <h1>Loading...</h1>
        <style jsx>{`
          .wrap {
            flex-grow: 1;
            display: flex;
            justify-content: center;
            align-items: center;
          }

          h1 {
            text-align: center;
          }
        `}</style>
      </div>
    )
  }
}
