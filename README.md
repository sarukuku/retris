# Remotely Playable Tetris

## How to dev?

1. Clone the repo
2. Run `yarn`
3. Run `yarn dev`
4. ????
5. Create a PR
6. Profit

### Server side hot reloading

There is a Nodemon config for server side hot loading.

1. Install the Nodemon CLI tool: `npm install -g nodemon`
2. Start the dev app using: `nodemon`

## How to deploy?

When a PR is merged to master it's automatically deployed to https://reaktor-tetris-staging.herokuapp.com/. Master is deployed manually via Heroku to https://reaktor-retris-production.herokuapp.com/. To access the apps you'll need access. Joonas (@aki7) can help you with this.

## Good to know

When you're running `yarn dev` and you save a file in your editor it's automatically formatted with `prettier`.

## Add custom translations

Currently Google Spreadsheet based custom translation is offered.

### How to add custom translations

1. Open `src/i18n/default-translation.ts`
2. Fill an empty Google Spreadsheet's first column with the default translation keys
3. Add your translations to the second column
4. Make your Sheet publicly available (readable)
5. Go to https://console.cloud.google.com/apis/library/sheets.googleapis.com and generate an API key
6. When starting the application provide the following environment variables (you can use `.env` too):

- `SHEETS_API_KEY`: Your generated API key
- `TRANSLATION_SPREADSHEET_ID`: https://docs.google.com/spreadsheets/d/`TRANSLATION_SPREADSHEET_ID`/edit#gid=0
- `TRANSLATION_SHEET_NAME`: The name of the Sheet which can be found on the lowest part of the Spreadsheet page (by default it is `Sheet1`)

7. If the environment variables are provided, the app will try to download and merge the Spreadsheet translations into the defaults on each page load.

Check out the following sheet for an example structure: https://docs.google.com/spreadsheets/d/1KNi3vxCagcMp0x7dFKfo_CnIkWMaCwHadRPwuz23xm8/edit#gid=0
