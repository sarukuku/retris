import React, { SFC, Fragment } from "react"
import { colors } from "../../../styles/colors"

interface HUDItemProps {
  name: string
  value: string
}

export const HUDItem: SFC<HUDItemProps> = ({ name, value }) => (
  <Fragment>
    <div className="hud-item">
      <span style={{ color: colors.LIGHT_GRAY }}>{name}</span>
      <span style={{ color: colors.WHITE }}>{value}</span>
    </div>
    <style jsx>{`
      .hud-item {
        width: 50%;
        text-align: center;
      }

      .hud-item > span {
        margin: 5px;
      }
    `}</style>
  </Fragment>
)
