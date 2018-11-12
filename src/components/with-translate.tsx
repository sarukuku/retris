import React, { createContext, ComponentType } from "react"
import { defaultTranslations } from "../i18n/default-translations"
import { createTranslate, Translate } from "../i18n/translate"

export const TranslationContext = createContext<Translate>(
  createTranslate(defaultTranslations),
)

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
          {translate => <Component translate={translate} {...this.props} />}
        </TranslationContext.Consumer>
      )
    }
  }

  return WithTranslate
}
