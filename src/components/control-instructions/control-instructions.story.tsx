import { storiesOf } from "@storybook/react"
import React from "react"
import { ControlInstructions } from "./control-instructions"

storiesOf("Control Instructions", module).add("Default", () => (
  <ControlInstructions
    swipeInstruction="Swipe to move them"
    tapInstruction="Tap to rotate them"
  />
))
