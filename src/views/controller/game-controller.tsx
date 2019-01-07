import React, { Component } from "react"
import Swipeable from "react-swipeable"
import { Subject } from "rxjs"
import { clientConfig } from "../../client-config"
import { commands } from "../../commands"
import { ControlInstructions } from "../../components/control-instructions"
import { TranslateProps, withTranslate } from "../../components/with-translate"
import { colors } from "../../styles/colors"

interface GameControllerProps extends TranslateProps {
  actionCommand: Subject<string>
}

class _GameController extends Component<GameControllerProps> {
  render() {
    const { actionCommand, translate } = this.props

    return (
      <Swipeable
        onSwipedRight={() => actionCommand.next(commands.RIGHT)}
        onSwipedDown={() => actionCommand.next(commands.DOWN)}
        onSwipedLeft={() => actionCommand.next(commands.LEFT)}
        onSwipedUp={() => actionCommand.next(commands.SMASH)}
        stopPropagation={true}
        delta={50}
      >
        <main className="wrap" onClick={() => actionCommand.next(commands.TAP)}>
          <ControlInstructions
            swipeInstruction={translate(
              "controller.start-game.swipe-instruction",
            )}
            tapInstruction={translate("controller.start-game.tap-instruction")}
          />
        </main>
        <style jsx>{`
          .wrap {
            width: 100%;
            height: 100%;
            position: absolute;
            background-color: ${colors.BLACK};
            color: ${colors.WHITE};
            background-image: url("${clientConfig.staticPath}/grid.svg");
            background-repeat: no-repeat;
            background-size: 90%;
            background-position: 50% 75%;
          }

          p {
            color: ${colors.BELIZE_HOLE};
          }
        `}</style>
      </Swipeable>
    )
  }
}

export const GameController = withTranslate(_GameController)
