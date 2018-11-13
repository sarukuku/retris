import { clientConfig } from "./client-config"

export const config = {
  ...clientConfig,
  port: parseInt(process.env.PORT || "3000", 10),
  env: process.env.NODE_ENV || "development",
  sheets: {
    apiKey: process.env.SHEETS_API_KEY,
    spreadsheetID: process.env.TRANSLATION_SPREADSHEET_ID,
    sheetName: process.env.TRANSLATION_SHEET_NAME,
  },
}
