import React, { Fragment, SFC } from "react"
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
      <h1 style={{ color: colors.WHITE }}>
        {translate("display.waiting.header.big")}
      </h1>
      <h2 style={{ color: colors.WHITE }}>
        {translate("display.waiting.header.small")}
      </h2>
      <h3 style={{ color: colors.WHITE }}>{address}</h3>
      <h4 style={{ color: colors.WHITE }}>
        {translate("display.waiting.info")}
      </h4>
    </div>
    <style jsx>{`
      .waiting {
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      }
    `}</style>
  </Fragment>
)

export const Waiting = withTranslate(_Waiting)
