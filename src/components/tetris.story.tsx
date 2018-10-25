import React from "react"

import { storiesOf } from "@storybook/react"
import { Tetris } from "./tetris"

storiesOf("Tetris", module).add("Tetris", () => (
  <div>
    <Tetris />
  </div>
))
