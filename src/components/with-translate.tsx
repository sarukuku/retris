import React, { ComponentType } from "react"
import { Translate } from "../i18n/translate"
import { TranslationContext } from "./contexts"

export interface TranslateProps {
  translate: Translate
}

type WithoutTranslateProps<Props> = Pick<
  Props,
  Exclude<keyof Props, keyof TranslateProps>
>

export function withTranslate<Props>(
  Component: ComponentType<Props & TranslateProps>,
): React.ComponentType<WithoutTranslateProps<Props>> {
  class WithTranslate extends React.Component<WithoutTranslateProps<Props>> {
    render() {
      return (
        <TranslationContext.Consumer>
          {translate => {
            if (!translate) {
              throw new Error("TranslationContext has no translate provided")
            }
            return <Component translate={translate} {...this.props} />
          }}
        </TranslationContext.Consumer>
      )
    }
  }

  return WithTranslate
}
