import React, { SFC, Fragment } from "react"
import { colors } from "../../../styles/colors"

interface HUDItemProps {
  name: string
  value: string
}

export const HUDItem: SFC<HUDItemProps> = ({ name, value }) => (
  <Fragment>
    <div className="hud-item">
      <span className="name">{name}</span>
      <span className="value">{value}</span>
    </div>
    <style jsx>{`
      .hud-item {
        width: 50%;
        text-align: center;
        margin-top: 0.5rem;
      }

      .hud-item > span {
        margin: 5px;
      }

      .name {
        color: ${colors.LIGHT_GRAY};
        font-size: 3vmax;
        text-transform: uppercase;
      }

      .value {
        color: ${colors.WHITE};
        font-size: 6vmax;
      }
    `}</style>
  </Fragment>
)
