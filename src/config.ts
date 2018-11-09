import dotenv from "dotenv"
dotenv.config()

export const config = {
  port: parseInt(process.env.PORT || "3000", 10),
  env: process.env.NODE_ENV || "development",
  sheetAPIKey: process.env.SHEET_API_KEY,
  translationSpreadsheetID: process.env.TRANSLATION_SPREADSHEET_ID,
  translationSheetName: process.env.TRANSLATION_SHEET_NAME,
}
