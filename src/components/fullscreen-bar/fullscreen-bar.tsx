import classNames from "classnames"
import fscreen from "fscreen"
import React, { Fragment } from "react"
import { colors } from "../../styles/colors"

interface FullscreenButtonProps {
  isFullScreen: boolean
  onClick: () => void
}

const FullscreenButton: React.SFC<FullscreenButtonProps> = ({
  isFullScreen,
  onClick,
}) => (
  <Fragment>
    <button onClick={onClick} className="fullscreen-button">
      <span className="text">
        {isFullScreen ? "Exit fullscreen" : "Go fullscreen"}
      </span>
    </button>
    <style jsx>{`
      .fullscreen-button {
        background: transparent;
        border: none;
        color: inherit;
        font: inherit;
        padding: 0.5em 1em;
        cursor: pointer;
      }
    `}</style>
  </Fragment>
)

interface FullscreenBarState {
  isFullscreen: boolean
}

const isInFullscreen = () => !!fscreen.fullscreenElement

export class FullscreenBar extends React.Component<{}, FullscreenBarState> {
  state: FullscreenBarState = {
    isFullscreen: false,
  }

  componentDidMount() {
    this.updateFullscreenState()
    fscreen.addEventListener("fullscreenchange", this.updateFullscreenState)
  }

  componentWillUnmount() {
    fscreen.removeEventListener("fullscreenchange", this.updateFullscreenState)
  }

  updateFullscreenState = () => {
    this.setState({
      isFullscreen: isInFullscreen(),
    })
  }

  handleClick = () => {
    if (this.state.isFullscreen) {
      fscreen.exitFullscreen()
    } else {
      fscreen.requestFullscreen(window.document.body)
    }
  }

  render() {
    const { isFullscreen } = this.state

    return (
      <Fragment>
        <div
          className={classNames("fullscreen-bar", {
            "fullscreen-bar--fullscreen": isFullscreen,
          })}
        >
          <div className="button-wrapper">
            <FullscreenButton
              onClick={this.handleClick}
              isFullScreen={isFullscreen}
            />
          </div>
        </div>
        <style jsx>{`
          .fullscreen-bar {
            color: ${colors.WHITE};
            display: flex;
            flex-direction: row;
            padding: 3rem 1rem 2rem 1rem;
            overflow-y: hidden;
          }

          .fullscreen-bar--fullscreen > .button-wrapper {
            transform: translateY(-100px);
            transition: transform 0.3s cubic-bezier(0.4, 0, 1, 1) 2s;
          }

          .fullscreen-bar:hover > .button-wrapper {
            transform: translateY(0px);
            transition: transform 0.3s cubic-bezier(0, 0, 0.2, 1);
          }

          .button-wrapper {
            margin-left: auto;
          }
        `}</style>
      </Fragment>
    )
  }
}
