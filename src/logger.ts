export interface Logger {
  info(msg: string, ...args: any[]): void
  error(msg: string, ...args: any[]): void
}
