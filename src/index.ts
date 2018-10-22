import express from "express"
import { createServer } from "http"
import next from "next"
import { createSocketIOServer } from "./server/socketio"

const port = parseInt(process.env.PORT || "3000", 10)
const dev = process.env.NODE_ENV !== "production"
const nextApp = next({ dev, dir: __dirname })
const nextHandler = nextApp.getRequestHandler()

nextApp.prepare().then(() => {
  const app = express()
  const server = createServer(app)
  createSocketIOServer(server)

  app.get("*", (req, res) => {
    return nextHandler(req, res)
  })

  server.listen(port, (err: Error) => {
    if (err) {
      throw err
    }
    console.log(`> Ready on http://localhost:${port}`) // tslint:disable-line:no-console
  })
})
