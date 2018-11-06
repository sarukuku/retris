import fetch from "isomorphic-unfetch"
import { isEmpty } from "ramda"
import { defaultTranslation, TranslationMap, TranslationKey } from "./default"

interface Args {
  apiKey: string
  spreadsheetID: string
  sheetName: string
}

type LoadTranslationMap = () => Promise<TranslationMap>

export function createLoadTranslationMapFromSheets({
  apiKey,
  spreadsheetID,
  sheetName,
}: Args): LoadTranslationMap {
  return async () => {
    const res = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetID}/values/${sheetName}?key=${apiKey}`,
    )
    const text = await res.text()
    if (!text) {
      throw new InvalidSheetsResponseError(["Response is falsy"])
    }

    let json: SheetsResponse
    try {
      json = JSON.parse(text)
    } catch (err) {
      throw new InvalidSheetsResponseError(["Response is not JSON"])
    }

    const errors = await validateJSON(json)
    if (!isEmpty(errors)) {
      throw new InvalidSheetsResponseError(errors)
    }

    return parseToTranslationMap(json)
  }
}

export interface SheetsResponse {
  values: Array<[TranslationKey, string]>
}

function validateJSON(json: SheetsResponse): string[] {
  if (!json.values) {
    return ["JSON has no values key"]
  }

  if (!Array.isArray(json.values)) {
    return ["'values' is not an array"]
  }

  const errors: string[] = []
  const translationKeys = Object.keys(defaultTranslation)
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

function parseToTranslationMap(sheets: SheetsResponse): TranslationMap {
  return sheets.values.reduce(
    (acc, [key, translation]) => ({ ...acc, [key]: translation }),
    defaultTranslation,
  )
}

export class InvalidSheetsResponseError extends Error {
  constructor(errors: string[]) {
    super(`Invalid Sheets Response: ${JSON.stringify(errors)}`)
  }
}
