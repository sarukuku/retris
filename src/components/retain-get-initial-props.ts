import { NextComponentType } from "next"
import { ComponentType } from "react"
import { WithoutProps } from "./without-props"

export function retainGetInitialProps(
  hoc: (Component: ComponentType, ...args: any[]) => ComponentType,
) {
  return <Props, HOCProps>(
    Component: ComponentType<Props & HOCProps>,
    ...args: any[]
  ): NextComponentType<WithoutProps<Props, HOCProps>> => {
    const HOC = hoc(Component, ...args)
    const PageComponent = Component as NextComponentType<Props>
    const PageHOC = HOC as NextComponentType<WithoutProps<Props, HOCProps>>
    if (PageComponent.getInitialProps) {
      PageHOC.getInitialProps = PageComponent.getInitialProps
    }
    return PageHOC
  }
}
