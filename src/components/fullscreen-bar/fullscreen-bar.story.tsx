import { storiesOf } from "@storybook/react"
import React, { Fragment } from "react"
import { defaultTranslations } from "../../i18n/default-translations"
import { createTranslate } from "../../i18n/translate"
import { colors } from "../../styles/colors"
import { TranslationContext } from "../contexts"
import { FullscreenBar } from "./fullscreen-bar"

storiesOf("Fullscreen bar", module).add("Default", () => (
  <Fragment>
    <div className="fullscreen-bar-wrapper">
      <TranslationContext.Provider value={createTranslate(defaultTranslations)}>
        <FullscreenBar />
      </TranslationContext.Provider>
    </div>
    <style global={true} jsx>{`
      html,
      body,
      #root {
        width: 100%;
        height: 100%;
        background: ${colors.BLACK};
      }

      .fullscreen-bar-wrapper {
        height: 110px;
      }
    `}</style>
  </Fragment>
))
