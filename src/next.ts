import http from "http"
import next from "next"

type RequestHandler = (
  req: http.IncomingMessage,
  res: http.ServerResponse,
) => void

interface WebApp {
  get(url: string, handler: RequestHandler): void
}

export async function createNextApp(
  env: string,
  webApp: WebApp,
): Promise<void> {
  const dev = env === "development"
  const nextApp = next({ dev, dir: __dirname })
  const nextHandler = nextApp.getRequestHandler()

  await nextApp.prepare()

  webApp.get("*", (req, res) => {
    return nextHandler(req, res)
  })
}
