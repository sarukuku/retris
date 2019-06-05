import { storiesOf } from "@storybook/react"
import React, { Fragment } from "react"
import { ReaktorTetris } from "../tetris/reaktor-tetris"
import { ScoreEffects } from "./score-effects"

storiesOf("Score effects", module).add("Reaktor tetris", () => (
  <Fragment>
    <div className="tetris-wrapper">
      <WithScore>
        {({ score, onScoreIncreased }) => (
          <Fragment>
            <ScoreEffects score={score}>
              <ReaktorTetris />
            </ScoreEffects>
            <div>
              <button onClick={() => onScoreIncreased(10)}>Play effect</button>
            </div>
          </Fragment>
        )}
      </WithScore>
    </div>
    <style global={true} jsx>{`
      html,
      body,
      #root {
        width: 100%;
        height: 100%;
      }

      .tetris-wrapper {
        width: 95%;
        height: 95%;
      }
    `}</style>
  </Fragment>
))

interface WithScoreState {
  score: number
}

interface WithScoreRendererProps {
  score: number
  onScoreIncreased: (increment: number) => void
}

interface WithScoreProps {
  children: React.SFC<WithScoreRendererProps>
}

class WithScore extends React.Component<WithScoreProps, WithScoreState> {
  state = { score: 0 }

  handleScoreIncreased = (increment: number) => {
    this.setState(prevState => ({
      score: prevState.score + increment,
    }))
  }

  render() {
    const { children: Renderer } = this.props
    return (
      <Renderer
        score={this.state.score}
        onScoreIncreased={this.handleScoreIncreased}
      />
    )
  }
}
