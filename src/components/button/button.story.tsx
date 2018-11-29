import { storiesOf } from "@storybook/react"
import React from "react"
import { Button } from "./button"

storiesOf("Button", module).add("Big", () => (
  <Button
    isBig
    onClick={() => {
      // tslint:disable-next-line
      console.log("Click!")
    }}
    label="Start"
  />
))

storiesOf("Button", module).add("Small", () => (
  <Button
    onClick={() => {
      // tslint:disable-next-line
      console.log("Click!")
    }}
    label="Restart"
  />
))
