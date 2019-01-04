import React, { Fragment } from "react"
import { clientConfig } from "../../client-config"
import { colors } from "../../styles/colors"

interface ButtonProps {
  swipeInstruction: string
  tapInstruction: string
}

export const ControlInstructions: React.SFC<ButtonProps> = ({
  swipeInstruction = "",
  tapInstruction = "",
}) => (
  <Fragment>
    <div className="instructions">
      <div>
        <p>{swipeInstruction}</p>
        <div className="swipe-illustration">
          <div className="swipe-illustration__wrap">
            <img
              className="arrow"
              src={`${clientConfig.staticPath}/arrow.svg`}
            />
            <span />
            <img
              className="arrow"
              src={`${clientConfig.staticPath}/arrow.svg`}
            />
          </div>
          <img className="hand" src={`${clientConfig.staticPath}/hand.svg`} />
        </div>
      </div>
      <div>
        <p>{tapInstruction}</p>
        <div className="tap-illustration">
          <span />
          <img className="hand" src={`${clientConfig.staticPath}/hand.svg`} />
        </div>
      </div>
    </div>
    <style jsx>{`
      .instructions {
        display: flex;
        margin-bottom: 2rem;
        opacity: 0.5;
        text-transform: lowercase;
        justify-content: center;
        text-align: center;
        background-color: ${colors.BLACK};
        color: ${colors.WHITE};
      }

      .instructions p {
        width: 5.6rem;
      }

      .instructions > div {
        display: flex;
        flex-direction: column;
        margin: 1rem;
      }

      .arrow,
      .hand {
        align-self: center;
      }

      .swipe-illustration,
      .tap-illustration {
        margin-top: auto;
      }

      .swipe-illustration__wrap {
        display: flex;
        justify-content: center;
      }

      .swipe-illustration__wrap > span {
        display: block;
        width: 1rem;
        height: 1rem;
        box-shadow: inset 0 0 0.5rem 0 ${colors.WHITE};
        border-radius: 100%;
      }

      .swipe-illustration__wrap .arrow {
        margin-bottom: -0.4rem;
      }

      .swipe-illustration__wrap .arrow:last-child {
        transform: scaleX(-1);
      }

      .swipe-illustration .hand,
      .tap-illustration .hand {
        margin-top: 0.4rem;
      }

      .swipe-illustration .hand {
        margin-right: -0.6rem;
      }

      .tap-illustration .hand {
        margin-right: -0.6rem;
      }

      .tap-illustration > span {
        display: block;
        position: relative;
        width: 1rem;
        height: 1rem;
        box-shadow: inset 0 0 0.5rem 0 ${colors.WHITE};
        border-radius: 100%;
        margin: 0 auto;
      }

      .tap-illustration > span:after {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        content: "";
        width: 1.9rem;
        height: 1.9rem;
        opacity: 0.29;
        box-shadow: inset 0 0 1rem 0 ${colors.WHITE};
        border-radius: 100%;
      }
    `}</style>
  </Fragment>
)
