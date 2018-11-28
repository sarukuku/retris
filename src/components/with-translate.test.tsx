import React from "react"
import TestRenderer from "react-test-renderer"
import { TranslationKey } from "../i18n/default-translations"
import { createTranslate } from "../i18n/translate"
import { TranslationContext } from "./contexts"
import { withTranslate } from "./with-translate"

const translationKey = "aTranslationKey" as TranslationKey
test("translate HOC", () => {
  const Component = withTranslate(({ translate }) => {
    const value = translate(translationKey)
    return <div>{value}</div>
  })
  const translationValue = "fooBar"
  const translateFn = createTranslate({
    [translationKey]: translationValue,
  } as any)

  const testRenderer = TestRenderer.create(
    <TranslationContext.Provider value={translateFn}>
      <Component />
    </TranslationContext.Provider>,
  )

  expect(testRenderer.toJSON()).toEqual(
    expect.objectContaining({ children: [translationValue] }),
  )
})
