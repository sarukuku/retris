import nock from "nock"

import {
  createLoadTranslationMapFromSheets,
  SheetsResponse,
} from "./load-translation-map-from-sheets"

const sheetsAPIMock = nock("https://sheets.googleapis.com/v4/spreadsheets")
const apiKey = "apiKey"
const sheetName = "sheetName"
const spreadsheetID = "spreadsheetID"
const loadTranslationMap = createLoadTranslationMapFromSheets({
  apiKey,
  sheetName,
  spreadsheetID,
})

test("load translation", async () => {
  mockWithResponse(sheetsResponse)

  const translationMap = await loadTranslationMap()

  expect(translationMap).toEqual({
    "display.waiting.header.line1": "Line1",
    "display.waiting.header.line2": "Line2",
  })
})

describe("validation error", () => {
  test("Response is falsy", async () => {
    mockWithResponse(undefined)

    await expect(loadTranslationMap()).rejects.toThrow(
      'Invalid Sheets Response: ["Response is falsy"]',
    )
  })

  test("Response is not JSON", async () => {
    mockWithResponse("NotAJSON")

    await expect(loadTranslationMap()).rejects.toThrow(
      'Invalid Sheets Response: ["Response is not JSON"]',
    )
  })

  test("JSON has no values key", async () => {
    mockWithResponse({ notValues: [] })

    await expect(loadTranslationMap()).rejects.toThrow(
      'Invalid Sheets Response: ["JSON has no values key"]',
    )
  })

  test("'values' is not an array", async () => {
    mockWithResponse({ values: "notAnArray" })

    await expect(loadTranslationMap()).rejects.toThrow(
      `Invalid Sheets Response: ["'values' is not an array"]`,
    )
  })

  test("'foo' is not a [key, value] pair", async () => {
    mockWithResponse({ values: ["foo"] })

    await expect(loadTranslationMap()).rejects.toThrow(
      `Invalid Sheets Response: ["'foo' is not a [key, value] pair"]`,
    )
  })

  test("'not.a.valid.translation.key' is not a valid translation key", async () => {
    mockWithResponse({ values: [["not.a.valid.translation.key", "foo"]] })

    await expect(loadTranslationMap()).rejects.toThrow(
      `Invalid Sheets Response: ["'not.a.valid.translation.key' is not a valid translation key"]`,
    )
  })

  test("'1' is not a valid translated string, type is number", async () => {
    mockWithResponse({ values: [["display.waiting.header.line1", 1]] })

    await expect(loadTranslationMap()).rejects.toThrow(
      `Invalid Sheets Response: ["'1' is not a valid translated string, key is 'display.waiting.header.line1', type is number"]`,
    )
  })

  test("multiple errors", async () => {
    mockWithResponse({
      values: [
        "foo",
        ["not.a.valid.translation.key", "foo"],
        ["display.waiting.header.line1", null],
      ],
    })

    const errors = [
      "'foo' is not a [key, value] pair",
      "'not.a.valid.translation.key' is not a valid translation key",
      "'null' is not a valid translated string, key is 'display.waiting.header.line1', type is object",
    ]
    await expect(loadTranslationMap()).rejects.toThrow(
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
  values: [
    ["display.waiting.header.line1", "Line1"],
    ["display.waiting.header.line2", "Line2"],
  ],
}
