import { createContext } from "react"
import { Analytics } from "../analytics"
import { Translate } from "../i18n/translate"

export const AnalyticsContext = createContext<Analytics | undefined>(undefined)

export const TranslationContext = createContext<Translate | undefined>(
  undefined,
)
