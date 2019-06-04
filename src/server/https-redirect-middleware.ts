import { Request, Response, NextFunction } from "express"

export function httpsRedirectMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (req.secure) {
    next()
  } else {
    res.redirect(`https://${req.headers.host}${req.url}`)
  }
}
