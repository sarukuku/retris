import React, { Fragment } from "react"
import { colors } from "../../styles/colors"

const screenShakeKeyframes = [
  { transform: "scale(1.05)" },
  { transform: "none" },
] as Keyframe[]

const scoreGainKeyframes = [
  {
    opacity: "1",
    transform: "translateY(0) scale(3)",
  },
  {
    opacity: "0",
    transform: "translateY(-80vh) scale(1)",
  },
] as Keyframe[]

interface ScoreEffectsProps {
  score: number
}

interface ScoreEffectsState {
  scoreGained: number
}

export class ScoreEffects extends React.Component<
  ScoreEffectsProps,
  ScoreEffectsState
> {
  state = {
    scoreGained: 0,
  }

  private rootRef = React.createRef<HTMLDivElement>()
  private scoreRef = React.createRef<HTMLDivElement>()

  componentDidUpdate(prevProps: ScoreEffectsProps) {
    if (prevProps.score < this.props.score) {
      // play effects only if score was gained
      this.setState({
        scoreGained: this.props.score - prevProps.score,
      })
      this.rootRef.current!.animate(screenShakeKeyframes, {
        easing: "cubic-bezier(0.0, 0.0, 0.2, 1)",
        duration: 820,
      })
      this.scoreRef.current!.animate(scoreGainKeyframes, {
        easing: "cubic-bezier(0.0, 0.0, 0.2, 1)",
        duration: 2000,
      })
    }
  }

  render() {
    const { children } = this.props
    const { scoreGained } = this.state

    return (
      <Fragment>
        <div className="score-effects" ref={this.rootRef}>
          <div className="score-effects__score" ref={this.scoreRef}>
            +{scoreGained}
          </div>
          {children}
        </div>
        <style jsx>{`
          .score-effects {
            height: 100%;
            transform-origin: bottom;
            position: relative;
          }
          .score-effects__score {
            position: absolute;
            width: 100%;
            bottom: 0;
            color: ${colors.WHITE};
            font-size: 4.5vmax;
            pointer-events: none;
            text-align: center;
            opacity: 0;
            transform-origin: initial;
            text-shadow: 0 3px 6px rgba(0, 0, 0, 0.16),
              0 3px 6px rgba(0, 0, 0, 0.23);
          }
        `}</style>
      </Fragment>
    )
  }
}
