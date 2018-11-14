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
): React.ComponentType<WithoutAnalyticsProps<Props>> {
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
  } as NextComponentType<WithoutAnalyticsProps<Props>>

  const component = Component as NextComponentType<WithoutAnalyticsProps<Props>>
  if (component.getInitialProps) {
    WithAnalytics.getInitialProps = component.getInitialProps
  }

  return WithAnalytics
}
