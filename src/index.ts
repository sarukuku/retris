import dotenv from "dotenv"
dotenv.config()

import express, { ErrorRequestHandler } from "express"
import { createServer } from "http"
import pino from "pino"
import socketio from "socket.io"
import { config } from "./config"
import { createLoadTranslationsFromSheets } from "./i18n/load-translations-from-sheets"
import { createNextApp } from "./next"
import { asyncMiddleware } from "./server/express-async-middleware"
import { createSocketIOServer } from "./server/socketio"
import {
  SocketIOControllers,
  SocketIODisplays,
} from "./server/socketio-adapters"
import { State } from "./server/state"

async function main() {
  const logger = pino()
  const loadTranslations = createLoadTranslationsFromSheets(config.sheets)

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
    new SocketIODisplays(displayNamespace),
    new SocketIOControllers(controllerNamespace),
  )
  createSocketIOServer(state, {
    display: displayNamespace,
    controller: controllerNamespace,
  })

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
