import { NextComponentType } from "next"
import React, { ComponentType } from "react"
import { Analytics } from "../analytics"
import { AnalyticsContext } from "./contexts"

export interface AnalyticsProps {
  analytics: Analytics
}

type WithoutAnalyticsProps<Props> = Pick<
  Props,
  Exclude<keyof Props, keyof AnalyticsProps>
>

export function withAnalytics<Props>(
  Component: ComponentType<Props & AnalyticsProps>,
): ComponentType<WithoutAnalyticsProps<Props>> {
  const WithAnalytics = class extends React.Component<
    WithoutAnalyticsProps<Props>
  > {
    render() {
      return (
        <AnalyticsContext.Consumer>
          {analytics => {
            if (!analytics) {
              throw new Error("AnalyticsContext has no analytics provided")
            }
            return <Component analytics={analytics} {...this.props} />
          }}
        </AnalyticsContext.Consumer>
      )
    }
  }
  return WithAnalytics
}

type Page<P> = NextComponentType<P>

export function pageWithAnalytics<Props>(
  Component: ComponentType<Props & AnalyticsProps>,
): NextComponentType<WithoutAnalyticsProps<Props>> {
  const WithAnalytics = withAnalytics(Component)
  const PageComponent = Component as Page<Props>
  const WithAnalyticsPage = WithAnalytics as Page<WithoutAnalyticsProps<Props>>
  if (WithAnalyticsPage.getInitialProps) {
    WithAnalyticsPage.getInitialProps = PageComponent.getInitialProps
  }
  return WithAnalyticsPage
}
