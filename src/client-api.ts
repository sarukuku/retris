import { IncomingMessage } from "http"
import fetch from "isomorphic-unfetch"
import { parseJSONResponse } from "./helpers"
import { Translations } from "./i18n/default-translations"

export class ClientAPI {
  private baseURL: string

  constructor(req?: IncomingMessage) {
    if (req) {
      const proto = req.headers["X-Forwarded-Proto"] || "http"
      this.baseURL = `${proto}://${req.headers.host!}`
    } else {
      const proto = window.location.protocol
      this.baseURL = `${proto}://${window.location.origin}`
    }
  }

  async getTranslations(): Promise<Translations> {
    const res = await fetch(`${this.baseURL}/api/translations`)
    const json = await parseJSONResponse(res)
    return json
  }
}
