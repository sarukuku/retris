import classNames from "classnames"
import React, { Fragment } from "react"
import { colors } from "../../styles/colors"

interface ButtonProps {
  isBig?: boolean
  onClick: () => void
  label: string
}

export const Button: React.SFC<ButtonProps> = ({
  isBig = false,
  onClick,
  label = "",
}) => (
  <Fragment>
    <div
      className={classNames("animated-btn", {
        "animated-btn--big": isBig,
      })}
    >
      <span />
      <button onClick={onClick}>{label}</button>
    </div>
    <style jsx>{`
      .animated-btn {
        position: relative;
      }

      .animated-btn button {
        display: block;
        position: relative;
        background: ${colors.BLACK};
        width: 5rem;
        height: 5rem;
        border-radius: 100%;
        color: ${colors.WHITE};
        border: none;
        font-size: 0.8rem;
        text-transform: uppercase;
        font-weight: 500;
      }

      .animated-btn--big button {
        width: 10rem;
        height: 10rem;
        font-size: 2rem;
      }

      .animated-btn span {
        display: block;
        position: absolute;
        top: -0.25rem;
        left: -0.1rem;
        width: 5.2rem;
        height: 5.5rem;
        border-radius: 100%;
        background: linear-gradient(
          to bottom,
          ${colors.YELLOW} 0%,
          ${colors.ORANGE} 100%
        );
        text-transform: uppercase;
        animation: rotate 10s linear infinite;
      }

      .animated-btn--big span {
        width: 10.2rem;
        height: 10.5rem;
      }

      @keyframes rotate {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(360deg);
        }
      }
    `}</style>
  </Fragment>
)
