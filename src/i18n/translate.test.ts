import { defaultTranslations, Translations } from "./default-translations"
import { createTranslate } from "./translate"

test("default translation", () => {
  const translate = createTranslate({} as any)
  const key = "display.waiting.header.line1"

  const result = translate(key)

  expect(result).toEqual(defaultTranslations[key])
})

test("translation", () => {
  const translate = createTranslate(translations)
  const key = "display.waiting.header.line1"

  const result = translate(key)

  expect(result).toEqual(translations[key])
})

test("interpolation", () => {
  const key = "display.waiting.header.line1"
  const translate = createTranslate({
    ...translations,
    [key]: "hello {{world}}",
  })

  const result = translate(key, { world: "foo" })

  expect(result).toEqual("hello foo")
})

const translations: Translations = {
  "display.waiting.header.line1": "display.waiting.header.line1",
}
