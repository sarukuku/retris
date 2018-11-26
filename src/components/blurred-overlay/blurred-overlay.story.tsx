import { storiesOf } from "@storybook/react"
import React from "react"
import { colors } from "../../styles/colors"
import { ReaktorTetris } from "../tetris/reaktor-tetris"
import { BlurredOverlay } from "./blurred-overlay"

storiesOf("BlurredOverlay", module).add("Text background", () => (
  <BlurredOverlay>
    <div style={{ backgroundColor: colors.EMERALD }}>
      <h1>Hello</h1>
    </div>
  </BlurredOverlay>
))

storiesOf("BlurredOverlay", module).add("Tetris background", () => (
  <BlurredOverlay>
    <ReaktorTetris />
  </BlurredOverlay>
))
