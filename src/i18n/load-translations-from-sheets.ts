import fetch from "isomorphic-unfetch"
import { isEmpty } from "ramda"
import { parseJSON } from "../helpers"
import {
  TranslationKey,
  Translations,
  DefaultTranslations,
} from "./default-translations"
import { LoadTranslations } from "./load-translations"

interface Args {
  apiKey?: string
  spreadsheetID?: string
  sheetName?: string
}

export interface SheetsResponse {
  values: Array<[TranslationKey, string]>
}

export function createLoadTranslationsFromSheets(
  defaultTranslations: DefaultTranslations,
  { apiKey, spreadsheetID, sheetName }: Args = {},
): LoadTranslations {
  return async () => {
    if (!apiKey || !spreadsheetID || !sheetName) {
      return defaultTranslations
    }

    const res = await fetchSheet()
    const json = await parseJSON(res)
    if (!json) {
      throw new InvalidSheetsResponseError(["Response is not JSON"])
    }

    const errors = await validateJSON(json)
    if (!isEmpty(errors)) {
      throw new InvalidSheetsResponseError(errors)
    }

    return parseToTranslations(json)
  }

  function fetchSheet(): Promise<Response> {
    return fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetID}/values/${sheetName}?key=${apiKey}`,
    )
  }

  function validateJSON(json: SheetsResponse): string[] {
    if (!json.values) {
      return ["JSON has no values key"]
    }

    if (!Array.isArray(json.values)) {
      return ["'values' is not an array"]
    }

    const errors: string[] = []
    const translationKeys = Object.keys(defaultTranslations)
    json.values.forEach(translationPair => {
      if (!Array.isArray(translationPair)) {
        errors.push(`'${translationPair}' is not a [key, value] pair`)
        return
      }

      const [key, translation] = translationPair
      if (!translationKeys.includes(key)) {
        errors.push(`'${key}' is not a valid translation key`)
      }

      if (typeof translation !== "string") {
        errors.push(
          `'${translation}' is not a valid translated string, key is '${key}', type is ${typeof translation}`,
        )
      }
    })

    return errors
  }

  function parseToTranslations(sheets: SheetsResponse): Translations {
    return sheets.values.reduce(
      (acc, [key, translation]) => ({ ...acc, [key]: translation }),
      defaultTranslations,
    )
  }
}

export class InvalidSheetsResponseError extends Error {
  constructor(errors: string[]) {
    super(`Invalid Sheets Response: ${JSON.stringify(errors)}`)
  }
}
