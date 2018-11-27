import React, { Fragment, SFC } from "react"
import {
  withTranslate,
  TranslateProps,
} from "../../../components/with-translate"
import { colors } from "../../../styles/colors"

const _WaitingToStart: SFC<TranslateProps> = ({ translate }) => (
  <Fragment>
    <div className="waiting-to-start">
      <h1 style={{ color: colors.WHITE }}>
        {translate("display.waiting-to-start.header.big")}
      </h1>
      <h2 style={{ color: colors.WHITE }}>
        {translate("display.waiting-to-start.header.small.line1")}
      </h2>
      <h2 style={{ color: colors.WHITE }}>
        {translate("display.waiting-to-start.header.small.line2")}
      </h2>
    </div>
    <style jsx>{`
      .waiting-to-start {
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      }
    `}</style>
  </Fragment>
)

export const WaitingToStart = withTranslate(_WaitingToStart)
