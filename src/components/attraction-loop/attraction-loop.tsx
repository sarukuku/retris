import React from "react"
import { BlurredOverlay } from "../blurred-overlay"
import { ReaktorTetris } from "../tetris/reaktor-tetris"

export const AttractionLoop = () => (
  <BlurredOverlay>
    <ReaktorTetris />
  </BlurredOverlay>
)
