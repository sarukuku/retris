import React, { Fragment, SFC } from "react"
import {
  withTranslate,
  TranslateProps,
} from "../../../components/with-translate"

const _Waiting: SFC<TranslateProps> = ({ translate }) => (
  <Fragment>
    <h1>{translate("display.waiting.header.line1")}</h1>
  </Fragment>
)

export const Waiting = withTranslate(_Waiting)
