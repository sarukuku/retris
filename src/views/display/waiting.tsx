import React, { Component } from "react"
import { withTranslate, TranslateProps } from "../../components/with-translate"

interface WaitingProps extends TranslateProps {
  address: string
}

class _Waiting extends Component<WaitingProps> {
  render() {
    const { address, translate } = this.props
    return (
      <div className="wrap">
        <h1>{translate("display.waiting.header.line1", { address })}</h1>
        <style jsx>{`
          .wrap {
            flex-grow: 1;
            display: flex;
            justify-content: center;
            align-items: center;
          }
        `}</style>
      </div>
    )
  }
}

export const Waiting = withTranslate(_Waiting)
