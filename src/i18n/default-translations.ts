export type Translations = typeof defaultTranslations

export type TranslationKey = keyof Translations

export const defaultTranslations = {
  "display.waiting.header.big": "play game!",
  "display.waiting.header.small": "go to",
  "display.waiting.info": "This screen will turn into a Tetris matrix.",
  "display.waiting-to-start.header.big": "ready",
  "display.waiting-to-start.header.small.line1": "press start",
  "display.waiting-to-start.header.small.line2": "on your mobile",
  "display.display-game.score": "score",
  "display.display-game.time": "time",
  "display.game-over.your-score": "your score",
  "display.game-over.about-us": "We solve the most complex puzzles.",
  "display.game-over.website": "reaktor.com",
}

export type DefaultTranslations = typeof defaultTranslations
