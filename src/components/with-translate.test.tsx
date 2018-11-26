import React from "react"
import TestRenderer from "react-test-renderer"
import { createTranslate } from "../i18n/translate"
import { TranslationContext } from "./contexts"
import { withTranslate } from "./with-translate"

test("translate HOC", () => {
  const Component = withTranslate(({ translate }) => {
    const value = translate("display.waiting.header.line1")
    return <div>{value}</div>
  })
  const translationValue = "fooBar"
  const translateFn = createTranslate({
    "display.waiting.header.line1": translationValue,
  })

  const testRenderer = TestRenderer.create(
    <TranslationContext.Provider value={translateFn}>
      <Component />
    </TranslationContext.Provider>,
  )

  expect(testRenderer.toJSON()).toEqual(
    expect.objectContaining({ children: [translationValue] }),
  )
})
