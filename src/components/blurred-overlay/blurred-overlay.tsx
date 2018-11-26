import React, { Fragment } from "react"
import { colors } from "../../styles/colors"

export const BlurredOverlay: React.SFC = ({ children }) => (
  <Fragment>
    <div className="blurred-overlay">{children}</div>
    <style jsx>{`
      .blurred-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        filter: blur(5px) brightness(60%);
        background-color: ${colors.DARK_GRAY};
        text-align: center;
      }
    `}</style>
  </Fragment>
)
