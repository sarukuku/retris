import dotenv from "dotenv"
import express, { ErrorRequestHandler } from "express"
import { createServer } from "http"
import pino from "pino"
import socketio from "socket.io"
import { config } from "./config"
import { Game } from "./games/tetris/game"
import { defaultTranslations } from "./i18n/default-translations"
import { createLoadTranslationsFromSheets } from "./i18n/load-translations-from-sheets"
import { createNextApp } from "./next"
import { asyncMiddleware } from "./server/express-async-middleware"
import { createSocketIOServer } from "./server/socketio"
import {
  SocketIOControllers,
  SocketIODisplays,
} from "./server/socketio-adapters"
import { State } from "./server/state"
dotenv.config()

async function main() {
  const logger = pino()
  const loadTranslations = createLoadTranslationsFromSheets(
    defaultTranslations,
    config.sheets,
  )

  const app = express()
  app.get(
    "/api/translations",
    asyncMiddleware(async (_req, res) => {
      const translations = await loadTranslations()
      res.send(translations)
    }),
  )
  await createNextApp(config.env, app)

  const server = createServer(app)
  const io = socketio(server)

  const displayNamespace = io.of("/display")
  const controllerNamespace = io.of("/controller")

  const state = new State(
    new SocketIODisplays(displayNamespace, logger),
    new SocketIOControllers(controllerNamespace, logger),
    () => new Game({ columnCount: 10, rowCount: 16 }),
  )
  createSocketIOServer(
    state,
    {
      display: displayNamespace,
      controller: controllerNamespace,
    },
    logger,
  )

  const errorRequestHandler: ErrorRequestHandler = (err, _req, res, _next) => {
    logger.error(`Request Error: ${err.stack || err}`)
    const error =
      config.env === "production" ? "Internal Server Error" : err.stack || err
    return res.status(500).send({
      error,
    })
  }
  app.use(errorRequestHandler)

  server.listen(config.port, (err: Error) => {
    if (err) {
      throw err
    }
    logger.info(`> Ready on http://localhost:${config.port}`)
  })
}

main()
