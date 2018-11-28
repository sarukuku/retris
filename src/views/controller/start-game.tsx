import React, { Component } from "react"
import { TranslateProps, withTranslate } from "../../components/with-translate"
import { colors } from "../../styles/colors"

interface StartGameProps extends TranslateProps {
  onStartGame: () => void
}

class _StartGame extends Component<StartGameProps> {
  render() {
    const { onStartGame, translate } = this.props

    return (
      <main className="wrap">
        <h1>{translate("controller.start-game.heading")}</h1>
        <div className="instructions">
          <div>
            <p>{translate("controller.start-game.swipe-instruction")}</p>
            <div className="swipe-illustration">
              <div className="swipe-illustration__wrap">
                <img className="arrow" src="/static/arrow.svg" />
                <span />
                <img className="arrow" src="/static/arrow.svg" />
              </div>
              <img className="hand" src="/static/hand.svg" />
            </div>
          </div>
          <div>
            <p>{translate("controller.start-game.tap-instruction")}</p>
            <div className="tap-illustration">
              <span />
              <img className="hand" src="/static/hand.svg" />
            </div>
          </div>
        </div>
        <button onClick={onStartGame}>
          {translate("controller.start-game.start-button")}
        </button>
        <style jsx>{`
          .wrap {
            width: 100%;
            height: 100%;
            position: fixed;
            display: flex;
            justify-content: center;
            align-content: center;
            align-items: center;
            padding: 1rem;
            flex-wrap: wrap;
            text-align: center;
            flex-direction: column;
          }

          h1 {
            font-size: 1.6rem;
            font-weight: 500;
          }

          .instructions {
            display: flex;
            margin-bottom: 2rem;
            opacity: 0.5;
            text-transform: lowercase;
          }

          .instructions p {
            width: 5.6rem;
          }

          .instructions > div {
            margin: 1rem;
          }

          .arrow,
          .hand {
            align-self: center;
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

          button {
            display: block;
            position: relative;
            background: ${colors.BLACK};
            width: 10rem;
            height: 10rem;
            border-radius: 100%;
            color: ${colors.WHITE};
            border: none;
            font-size: 2rem;
            text-transform: uppercase;
            font-weight: 500;
          }

          button:after {
            content: "";
            position: absolute;
            top: -0.25rem;
            left: -0.1rem;
            width: 10.2rem;
            height: 10.5rem;
            border-radius: 100%;
            background: linear-gradient(
              to bottom,
              ${colors.YELLOW} 0%,
              ${colors.ORANGE} 100%
            );
            z-index: -1;
            text-transform: uppercase;
            animation: rotate 10s linear infinite;
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
      </main>
    )
  }
}

export const StartGame = withTranslate(_StartGame)
