import React, { Component } from "react"
import { withTranslate, TranslateProps } from "../../components/with-translate"

interface InQueueProps extends TranslateProps {
  queueLength: number
}

class _InQueue extends Component<InQueueProps> {
  render() {
    const { queueLength, translate } = this.props

    return (
      <main className="wrap">
        <h1>{translate("controller.in-queue.heading")}</h1>
        <p>
          <span className="opaque">
            {translate("controller.in-queue.queue-intro-start")}
          </span>
          <span>{queueLength}</span>
          <span className="opaque">
            {translate("controller.in-queue.queue-intro-end")}
          </span>
        </p>
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
            margin-bottom: -0.8rem;
          }
        `}</style>
      </main>
    )
  }
}

export const InQueue = withTranslate(_InQueue)
