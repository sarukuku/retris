import React, { Component } from "react"
import Swipeable from "react-swipeable"
import { Subject } from "rxjs"
import { clientConfig } from "../../client-config"
import { commands } from "../../commands"
import { colors } from "../../styles/colors"

interface GameControllerProps {
  actionCommand: Subject<string>
}

export class GameController extends Component<GameControllerProps> {
  render() {
    const { actionCommand } = this.props

    return (
      <Swipeable
        onSwipedRight={() => actionCommand.next(commands.RIGHT)}
        onSwipedDown={() => actionCommand.next(commands.DOWN)}
        onSwipedLeft={() => actionCommand.next(commands.LEFT)}
        stopPropagation={true}
        delta={50}
      >
        <main
          className="wrap"
          onClick={() => actionCommand.next(commands.TAP)}
        />
        <style jsx>{`
          .wrap {
            width: 100%;
            height: 100%;
            position: absolute;
            display: flex;
            justify-content: center;
            align-items: center;
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
