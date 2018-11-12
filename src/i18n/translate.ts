import {
  TranslationKey,
  Translations,
  defaultTranslations,
} from "./default-translations"

export interface TranslationParams {
  [key: string]: string
}

export type Translate = (
  key: TranslationKey,
  params?: TranslationParams,
) => string

export function createTranslate(translations: Translations): Translate {
  return (key, params) => {
    const translated = translations[key]
    if (!translated) {
      return defaultTranslations[key]
    }

    if (!params) {
      return translated
    }

    return interpolateParams(translated, params)
  }
}

function interpolateParams(
  translated: string,
  params: TranslationParams,
): string {
  return Object.keys(params).reduce(
    (acc, paramKey) => acc.replace(`{{${paramKey}}}`, params[paramKey]),
    translated,
  )
}
