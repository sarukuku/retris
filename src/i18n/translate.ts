import { TranslationKey, TranslationMap, defaultTranslation } from "./default"

export interface TranslationParams {
  [key: string]: string
}

export function createTranslate(translationMap: TranslationMap) {
  return (key: TranslationKey, params?: TranslationParams) => {
    const translated = translationMap[key]
    if (!translated) {
      return defaultTranslation[key]
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
