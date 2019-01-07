import React, { Component } from "react"
import { ReaktorLogo } from "../../components/reaktor-logo/reaktor-logo"
import { TranslateProps, withTranslate } from "../../components/with-translate"
import { colors } from "../../styles/colors"

interface InQueueProps extends TranslateProps {
  positionInQueue: number
}

class _InQueue extends Component<InQueueProps> {
  render() {
    const { positionInQueue, translate } = this.props

    return (
      <main className="wrap">
        <h1>{translate("controller.in-queue.heading")}</h1>
        <p>
          <span className="opaque">
            {translate("controller.in-queue.queue-intro-start")}
          </span>
          <span>{positionInQueue}</span>
          <span className="opaque">
            {translate("controller.in-queue.queue-intro-end")}
          </span>
        </p>
        <div className="logo">
          <ReaktorLogo />
        </div>
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

          .logo {
            height: 2rem;
            position: absolute;
            bottom: 2rem;
          }

          .opaque {
            opacity: 0.5;
          }

          p > span.opaque {
            display: block;
            width: 8rem;
          }

          p > span:not(.opaque) {
            display: block;
            opacity: 1;
            font-size: 6rem;
            font-weight: 600;
            margin-bottom: -0.1rem;
          }
        `}</style>
      </main>
    )
  }
}

export const InQueue = withTranslate(_InQueue)
