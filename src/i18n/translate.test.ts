import { defaultTranslations, TranslationKey } from "./default-translations"
import { createTranslate } from "./translate"

test("default translation", () => {
  const translate = createTranslate({} as any)

  const key = Object.keys(defaultTranslations)[0] as TranslationKey
  const result = translate(key)

  expect(result).toEqual(defaultTranslations[key])
})

test("translation", () => {
  const translate = createTranslate(translations)

  const result = translate(translationKey)

  expect(result).toEqual(translations[translationKey])
})

test("interpolation", () => {
  const translate = createTranslate({
    ...translations,
    [translationKey]: "hello {{world}}",
  })

  const result = translate(translationKey, { world: "foo" })

  expect(result).toEqual("hello foo")
})

const translationKey = "aTranslationKey" as TranslationKey
const translations = {
  [translationKey]: "translationValue",
} as any
