import React, { ComponentType } from "react"
import { retainGetInitialProps } from "./retain-get-initial-props"
import { WithoutProps } from "./without-props"

interface Subscription {
  unsubscribe(): void
}

export interface AutoUnsubscribeProps {
  unsubscribeOnUnmount(...subscriptions: Subscription[]): void
}

type WithoutAutoUnsubscribeProps<Props> = WithoutProps<
  Props,
  AutoUnsubscribeProps
>

export function withAutoUnsubscribe<Props>(
  Component: ComponentType<Props & AutoUnsubscribeProps>,
): ComponentType<WithoutAutoUnsubscribeProps<Props>> {
  class WithAutoUnsubscribe extends React.Component<
    WithoutAutoUnsubscribeProps<Props>
  > {
    private subscriptions: Subscription[] = []

    componentWillUnmount() {
      this.subscriptions.forEach(s => s.unsubscribe())
    }

    render() {
      return (
        <Component
          unsubscribeOnUnmount={(...s) => this.subscriptions.push(...s)}
          {...this.props}
        />
      )
    }
  }

  return WithAutoUnsubscribe
}

export const pageWithAutoUnsubscribe = retainGetInitialProps(
  withAutoUnsubscribe,
)
