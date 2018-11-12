import { Application } from "express"
import next from "next"

export async function createNextApp(
  env: string,
  app: Application,
): Promise<void> {
  const dev = env === "development"
  const nextApp = next({ dev, dir: __dirname })
  const nextHandler = nextApp.getRequestHandler()

  await nextApp.prepare()

  app.get("*", (req, res) => {
    return nextHandler(req, res)
  })
}
