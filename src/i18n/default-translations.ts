export type Translations = typeof defaultTranslations

export type TranslationKey = keyof Translations

export const defaultTranslations = {
  "display.waiting.header.big": "Play tetris!",
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
  "controller.start-game.heading": "You're up! 🙋‍♀️",
  "controller.start-game.swipe-instruction": "Swipe to move them",
  "controller.start-game.tap-instruction": "Tap to rotate them",
  "controller.start-game.start-button": "Start",
  "controller.in-queue.heading": "Hang tight! 🎮",
  "controller.in-queue.queue-intro-start": "There are",
  "controller.in-queue.queue-intro-end": "players in the line before you.",
  "controller.game-controls.bottom-instruction":
    "Protip: swipe down to nudge down, swipe up to smash down.",
  "controller.game-over.heading": "Game over 😒",
  "controller.game-over.score-label": "Score",
  "controller.game-over.copy":
    "Would you like to solve technical puzzles for a living? We're looking for people like you.",
  "controller.game-over.link-title": "👉 reaktor.com/careers",
  "controller.game-over.link": "https://www.reaktor.com/careers/",
  "controller.game-over.button-label": "Restart",
}

export type DefaultTranslations = typeof defaultTranslations
