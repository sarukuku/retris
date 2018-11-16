import React, { ComponentType } from "react"
import { Analytics } from "../analytics"
import { AnalyticsContext } from "./contexts"
import { retainGetInitialProps } from "./retain-get-initial-props"
import { WithoutProps } from "./without-props"

export interface AnalyticsProps {
  analytics: Analytics
}

type WithoutAnalyticsProps<Props> = WithoutProps<Props, AnalyticsProps>

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

export const pageWithAnalytics = retainGetInitialProps(withAnalytics)
