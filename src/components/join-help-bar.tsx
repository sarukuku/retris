import React, { Component } from "react"
import { isBrowser } from "../helpers"
import { WHITE, EMERALD } from "../lib/styles/colors"

interface JoinHelpBarProps {
  className: string
}

interface JoinHelpBarState {
  intervalId: NodeJS.Timeout | null
}

export class JoinHelpBar extends Component<JoinHelpBarProps, JoinHelpBarState> {
  icon: React.RefObject<HTMLElement>

  constructor(props: JoinHelpBarProps) {
    super(props)
    this.icon = React.createRef()
    this.state = {
      intervalId: null
    }
  }

  toggleAnimationClass() {
    this.icon.current!.classList.toggle("animate")
  }

  componentDidMount() {
    if (!isBrowser()) {
      return
    }

    const id = setInterval(() => {
      this.toggleAnimationClass()
    }, 2000)
    this.setState({ intervalId: id })
  }

  componentWillUnmount() {
    if (!isBrowser()) {
      return
    }
    clearInterval(this.state.intervalId!)
  }

  render() {
    return (
      <div className={`help-bar ${this.props.className}`}>
        <p>
          {`To play go to ${
            isBrowser() ? window.location.origin : "..."
          } to start playing!`}{" "}
          <span className="icon" ref={this.icon}>
            🎮
          </span>
        </p>
        <style jsx>{`
          .help-bar {
            background-color: ${EMERALD};
            color: ${WHITE};
            font-size: 1.4vmax;
            text-align: center;
          }

          .icon {
            display: inline-block;
            animation-iteration-count: infinite;
            transform: translate3d(0, 0, 0);
            backface-visibility: hidden;
            perspective: 1000px;
            margin-left: 0.5rem;
          }

          .icon.animate {
            animation: shake 0.82s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
          }

          @keyframes shake {
            10%,
            90% {
              transform: translate3d(-1px, 0, 0);
            }

            20%,
            80% {
              transform: translate3d(2px, 0, 0);
            }

            30%,
            50%,
            70% {
              transform: translate3d(-4px, 0, 0);
            }

            40%,
            60% {
              transform: translate3d(4px, 0, 0);
            }
          }
        `}</style>
      </div>
    )
  }
}
