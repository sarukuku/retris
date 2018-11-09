# Remotely Playable Tetris

## How to dev?

1. Clone the repo
2. Run `yarn`
3. Run `yarn dev`
4. ????
5. Create a PR
6. Profit

## How to deploy?

When a PR is merged to master it's automatically deployed to https://reaktor-tetris-staging.herokuapp.com/. Master is deployed manually via Heroku to https://reaktor-retris-production.herokuapp.com/. To access the apps you'll need access. Joonas (@aki7) can help you with this.

## Good to know

When you're running `yarn dev` and you save a file in your editor it's automatically formatted with `prettier`.

## Add custom translations

Currently Google Spreadsheet based custom translation is offered.

### How to add custom translations

1. Open `src/i18n/default-translation.ts`
2. Copy the keys to an empty Google Spreadsheet's first column
3. Add your translations to the second column
4. Make your Sheet publicly available (readable)
5. Go to https://console.cloud.google.com/apis/library/sheets.googleapis.com and generate an API key
6. When starting the application provide the following environment variables (you can use `.env`):

- `SHEETS_API_KEY`: Your generated API key
- `TRANSLATION_SPREADSHEET_ID`: https://docs.google.com/spreadsheets/d/`{{TRANSLATION_SPREADSHEET_ID}}`/edit#gid=0
- `TRANSLATION_SHEET_NAME`: The name of the Sheet on can be found on the lower part of the page (by default it's `Sheet1`)

7. For example check out this following sheet: https://docs.google.com/spreadsheets/d/1KNi3vxCagcMp0x7dFKfo_CnIkWMaCwHadRPwuz23xm8/edit#gid=0
