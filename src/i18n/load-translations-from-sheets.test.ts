import nock from "nock"
import { defaultTranslations, TranslationKey } from "./default-translations"
import {
  createLoadTranslationsFromSheets,
  SheetsResponse,
} from "./load-translations-from-sheets"

test("default translations if no sheet API config is provided", async () => {
  const loadDefaultTranslations = createLoadTranslationsFromSheets(
    defaultTranslations,
  )

  const translations = await loadDefaultTranslations()

  expect(translations).toEqual(defaultTranslations)
})

const sheetsAPIMock = nock("https://sheets.googleapis.com/v4/spreadsheets")
const apiKey = "apiKey"
const sheetName = "sheetName"
const spreadsheetID = "spreadsheetID"
const fakeDefaultTranslations = { aTranslationKey: "aTranslationValue" } as any
const loadTranslations = createLoadTranslationsFromSheets(
  fakeDefaultTranslations,
  {
    apiKey,
    sheetName,
    spreadsheetID,
  },
)

test("load translation", async () => {
  mockWithResponse(sheetsResponse)

  const translations = await loadTranslations()

  const [key, value] = sheetsResponse.values[0]
  expect(translations).toEqual({
    [key]: value,
  })
})

describe("validation error", () => {
  test("Response is not JSON", async () => {
    mockWithResponse("NotAJSON")

    await expect(loadTranslations()).rejects.toThrow(
      'Invalid Sheets Response: ["Response is not JSON"]',
    )
  })

  test("JSON has no values key", async () => {
    mockWithResponse({ notValues: [] })

    await expect(loadTranslations()).rejects.toThrow(
      'Invalid Sheets Response: ["JSON has no values key"]',
    )
  })

  test("'values' is not an array", async () => {
    mockWithResponse({ values: "notAnArray" })

    await expect(loadTranslations()).rejects.toThrow(
      `Invalid Sheets Response: ["'values' is not an array"]`,
    )
  })

  test("'foo' is not a [key, value] pair", async () => {
    mockWithResponse({ values: ["foo"] })

    await expect(loadTranslations()).rejects.toThrow(
      `Invalid Sheets Response: ["'foo' is not a [key, value] pair"]`,
    )
  })

  test("'not.a.valid.translation.key' is not a valid translation key", async () => {
    mockWithResponse({ values: [["not.a.valid.translation.key", "foo"]] })

    await expect(loadTranslations()).rejects.toThrow(
      `Invalid Sheets Response: ["'not.a.valid.translation.key' is not a valid translation key"]`,
    )
  })

  test("'1' is not a valid translated string, type is number", async () => {
    mockWithResponse({ values: [["aTranslationKey", 1]] })

    await expect(loadTranslations()).rejects.toThrow(
      `Invalid Sheets Response: ["'1' is not a valid translated string, key is 'aTranslationKey', type is number"]`,
    )
  })

  test("multiple errors", async () => {
    mockWithResponse({
      values: [
        "foo",
        ["not.a.valid.translation.key", "foo"],
        ["aTranslationKey", null],
      ],
    })

    const errors = [
      "'foo' is not a [key, value] pair",
      "'not.a.valid.translation.key' is not a valid translation key",
      "'null' is not a valid translated string, key is 'aTranslationKey', type is object",
    ]
    await expect(loadTranslations()).rejects.toThrow(
      `Invalid Sheets Response: ${JSON.stringify(errors)}`,
    )
  })
})

function mockWithResponse(response: any): void {
  sheetsAPIMock
    .get(`/${spreadsheetID}/values/${sheetName}?key=${apiKey}`)
    .reply(200, response)
}

const sheetsResponse: SheetsResponse = {
  values: [["aTranslationKey" as TranslationKey, "aDefaultTranslationValue"]],
}
