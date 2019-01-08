import React, { Fragment, SFC } from "react"
import { ReaktorLogo } from "../../../components/reaktor-logo/reaktor-logo"
import {
  TranslateProps,
  withTranslate,
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
      <div className="logo">
        <ReaktorLogo />
      </div>
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

      .logo {
        width: 30%;
        position: absolute;
        bottom: 2rem;
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
