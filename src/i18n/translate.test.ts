import { defaultTranslation, TranslationMap } from "./default"
import { createTranslate } from "./translate"

test("default translation", () => {
  const translate = createTranslate({} as any)
  const key = "display.waiting.header.line1"

  const result = translate(key)

  expect(result).toEqual(defaultTranslation[key])
})

test("translation", () => {
  const translate = createTranslate(translationMap)
  const key = "display.waiting.header.line1"

  const result = translate(key)

  expect(result).toEqual(translationMap[key])
})

test("interpolation", () => {
  const key = "display.waiting.header.line1"
  const translate = createTranslate({
    ...translationMap,
    [key]: "hello {{world}}",
  })

  const result = translate(key, { world: "foo" })

  expect(result).toEqual("hello foo")
})

const translationMap: TranslationMap = {
  "display.waiting.header.line1": "display.waiting.header.line1",
  "display.waiting.header.line2": "display.waiting.header.line2",
}
