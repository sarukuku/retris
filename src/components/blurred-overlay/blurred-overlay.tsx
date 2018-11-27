import React, { Fragment } from "react"
import { colors } from "../../styles/colors"
import { zIndices } from "../../styles/z-indices"

export const BlurredOverlay: React.SFC = ({ children }) => (
  <Fragment>
    <div className="blurred-overlay">
      <div className="blurred-overlay__children">{children}</div>
    </div>
    <style jsx>{`
      .blurred-overlay {
        background-color: ${colors.DARK_GRAY};
        position: absolute;
        z-index: ${zIndices.BACKGROUND};
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        text-align: center;
        filter: brightness(50%);
      }

      .blurred-overlay__children {
        filter: blur(8px);
        width: 100%;
        height: 100%;
      }
    `}</style>
  </Fragment>
)
