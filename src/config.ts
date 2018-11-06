import dotenv from "dotenv"
import { isEmpty } from "ramda"
dotenv.config()

const requiredConfig = {
  sheetAPIKey: process.env.SHEET_API_KEY!,
  translationSpreadsheetID: process.env.TRANSLATION_SPREADSHEET_ID!,
  translationSheetName: process.env.TRANSLATION_SHEET_NAME!,
}

validateRequiredConfig()

export const config = {
  port: parseInt(process.env.PORT || "3000", 10),
  env: process.env.NODE_ENV || "development",
  ...requiredConfig,
}

type RequiredConfigKey = keyof typeof requiredConfig

function validateRequiredConfig() {
  const missingConfigKeys: string[] = []
  Object.keys(requiredConfig).forEach((key: RequiredConfigKey) => {
    if (typeof requiredConfig[key] === "undefined") {
      missingConfigKeys.push(key)
    }
  })

  if (!isEmpty(missingConfigKeys)) {
    throw new Error(`Missing config keys: ${missingConfigKeys.join(", ")}`)
  }
}
