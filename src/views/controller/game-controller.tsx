import React, { Component } from "react"
import Swipeable from "react-swipeable"
import { colors } from "../../styles/colors"

interface GameControllerProps {
  onSwipeRight: () => void
  onSwipeLeft: () => void
  onSwipeDown: () => void
  onTap: () => void
}

export class GameController extends Component<GameControllerProps> {
  render() {
    const { onSwipeDown, onSwipeLeft, onSwipeRight, onTap } = this.props

    return (
      <Swipeable
        onSwipedRight={onSwipeRight}
        onSwipedDown={onSwipeDown}
        onSwipedLeft={onSwipeLeft}
        stopPropagation={true}
        delta={50}
      >
        <main className="wrap" onClick={onTap}>
          <p>Tap and swipe to play!</p>
        </main>
        <style jsx>{`
          .wrap {
            width: 100%;
            height: 100%;
            position: fixed;
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: ${colors.PETER_RIVER};
            border: 6px solid ${colors.BELIZE_HOLE};
            padding: 2rem;
          }

          p {
            color: ${colors.BELIZE_HOLE};
          }
        `}</style>
      </Swipeable>
    )
  }
}
