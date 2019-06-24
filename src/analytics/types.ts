export interface Analytics {
  sendPageView(pageURL: string): void
  sendCustomEvent(eventArgs: EventArgs): void
}

export interface EventArgs {
  category: string
  action: string
  label?: string
  value?: number
}
