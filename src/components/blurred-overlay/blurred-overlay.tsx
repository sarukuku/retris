import classNames from "classnames"
import React, { Fragment } from "react"
import { colors } from "../../styles/colors"
import { zIndices } from "../../styles/z-indices"

interface BlurredOverlayProps {
  isActive?: boolean
}

export const BlurredOverlay: React.SFC<BlurredOverlayProps> = ({
  children,
  isActive = true,
}) => (
  <Fragment>
    <div
      className={classNames("blurred-overlay", {
        "blurred-overlay--active": isActive,
      })}
    >
      <div className="blurred-overlay__children">{children}</div>
    </div>
    <style jsx>{`
      .blurred-overlay {
        width: 100%;
        height: 100%;
        text-align: center;
      }

      .blurred-overlay--active {
        position: absolute;
        z-index: ${zIndices.BACKGROUND};
        top: 0;
        left: 0;
        filter: brightness(50%);
        background-color: ${colors.DARK_GRAY};
      }

      .blurred-overlay__children {
        width: 100%;
        height: 100%;
      }

      .blurred-overlay--active .blurred-overlay__children {
        filter: blur(8px);
      }
    `}</style>
  </Fragment>
)
