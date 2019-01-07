import React, { Fragment, SFC } from "react"
import { ReaktorLogo } from "../../../components/reaktor-logo/reaktor-logo"
import {
  TranslateProps,
  withTranslate,
} from "../../../components/with-translate"
import { colors } from "../../../styles/colors"

interface WaitingProps extends TranslateProps {
  address: string
}

const _Waiting: SFC<WaitingProps> = ({ translate, address }) => (
  <Fragment>
    <div className="waiting">
      <h1>{translate("display.waiting.header.big")}</h1>
      <p>{translate("display.waiting.info")}</p>
      <h2>{translate("display.waiting.header.small")}</h2>
      <p className="address">{address}</p>
      <div className="logo">
        <ReaktorLogo />
      </div>
    </div>
    <style jsx>{`
      .waiting {
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        color: ${colors.WHITE};
        text-align: center;
      }

      .logo {
        height: 2rem;
        position: absolute;
        bottom: 2rem;
      }

      h1 {
        font-size: 12vmax;
        text-transform: uppercase;
        margin: 2rem 2rem 6rem 2rem;
      }

      p {
        font-size: 4.5vmax;
        margin-top: 0;
        margin: 0 2rem 2rem 2rem;
      }

      .address {
        font-size: 5.5vmax;
      }

      h2 {
        font-size: 3.5vmax;
        text-transform: uppercase;
        margin-bottom: 0.5rem;
      }
    `}</style>
  </Fragment>
)

export const Waiting = withTranslate(_Waiting)
