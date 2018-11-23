import { storiesOf } from "@storybook/react"
import React, { Fragment } from "react"
import { ReaktorTetris } from "./reaktor-tetris"

storiesOf("ReaktorTetris", module).add("Tetris", () => (
  <Fragment>
    <div className="tetris-wrapper">
      <ReaktorTetris staticPath="" />
    </div>
    <style global={true} jsx>{`
      html,
      body,
      #root {
        width: 100%;
        height: 100%;
      }

      .tetris-wrapper {
        width: 95%;
        height: 95%;
      }
    `}</style>
  </Fragment>
))
