import { storiesOf } from "@storybook/react"
import React, { Fragment } from "react"
import { colors } from "../../styles/colors"
import { FullscreenBar } from "./fullscreen-bar"

storiesOf("Fullscreen bar", module).add("Default", () => (
  <Fragment>
    <div className="fullscreen-bar-wrapper">
      <FullscreenBar />
    </div>
    <style global={true} jsx>{`
      html,
      body,
      #root {
        width: 100%;
        height: 100%;
        background: ${colors.BLACK};
      }

      .fullscreen-bar-wrapper {
        height: 110px;
      }
    `}</style>
  </Fragment>
))
