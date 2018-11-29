import React, { Fragment, SFC } from "react"
import {
  withTranslate,
  TranslateProps,
} from "../../../components/with-translate"
import { colors } from "../../../styles/colors"

const _WaitingToStart: SFC<TranslateProps> = ({ translate }) => (
  <Fragment>
    <div className="waiting-to-start">
      <h1>{translate("display.waiting-to-start.header.big")}</h1>
      <p>
        {translate("display.waiting-to-start.header.small.line1")}
        <span>{translate("display.waiting-to-start.header.small.line2")}</span>
      </p>
    </div>
    <style jsx>{`
      .waiting-to-start {
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        color: ${colors.WHITE};
        text-align: center;
      }

      h1 {
        font-size: 10vmax;
        text-transform: uppercase;
        margin: 1rem;
      }

      p {
        font-size: 3.5vmax;
        text-transform: uppercase;
      }

      p span {
        display: block;
        opacity: 0.5;
      }
    `}</style>
  </Fragment>
)

export const WaitingToStart = withTranslate(_WaitingToStart)
