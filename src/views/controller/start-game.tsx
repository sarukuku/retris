import React, { Component } from "react"
import { Button } from "../../components/button"
import { ControlInstructions } from "../../components/control-instructions"
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
        <ControlInstructions
          swipeInstruction={translate(
            "controller.start-game.swipe-instruction",
          )}
          tapInstruction={translate("controller.start-game.tap-instruction")}
        />
        <Button
          isBig
          onClick={onStartGame}
          label={translate("controller.start-game.start-button")}
        />
        <style jsx>{`
          .wrap {
            width: 100%;
            height: 100%;
            position: absolute;
            display: flex;
            justify-content: center;
            align-content: center;
            align-items: center;
            flex-wrap: wrap;
            text-align: center;
            flex-direction: column;
            background-color: ${colors.BLACK};
            color: ${colors.WHITE};
          }

          h1 {
            font-size: 1.6rem;
            font-weight: 500;
          }
        `}</style>
      </main>
    )
  }
}

export const StartGame = withTranslate(_StartGame)
