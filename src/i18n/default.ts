export type TranslationMap = typeof defaultTranslation

export type TranslationKey = keyof TranslationMap

export const defaultTranslation = {
  "display.waiting.header.line1": "Take out your phone and go to {{url}}.",
  "display.waiting.header.line2": "This screen will turn into a Tetris matrix.",
}
