import App, { AppComponentContext, Container } from "next/app"
import Head from "next/head"
import "normalize.css/normalize.css"
import React from "react"
import { GoogleAnalytics } from "../analytics/google-analytics"
import { ClientAPI } from "../client-api"
import { clientConfig } from "../client-config"
import { AnalyticsContext, TranslationContext } from "../components/contexts"
import { Translations } from "../i18n/default-translations"
import { createTranslate } from "../i18n/translate"
import { colors } from "../styles/colors"
import { fonts, withFallback } from "../styles/fonts"

interface RetrisProps {
  translations: Translations
}

class Retris extends App<RetrisProps> {
  static async getInitialProps({ Component, ctx }: AppComponentContext) {
    let pageProps = {}
    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }

    const clientAPI = new ClientAPI(ctx.req)
    const translations = await clientAPI.getTranslations()

    return { pageProps, translations }
  }

  render() {
    const { Component, pageProps, translations } = this.props
    const analytics = new GoogleAnalytics(clientConfig.googleAnalytics)

    return (
      <AnalyticsContext.Provider value={analytics}>
        <TranslationContext.Provider value={createTranslate(translations)}>
          <Container>
            <Head>
              <meta
                name="viewport"
                content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, shrink-to-fit=no"
              />
              <link rel="stylesheet" type="text/css" href="/static/fonts/fonts.css" />
            </Head>
            <Component {...pageProps} />
            <style global jsx>{`
              html {
                box-sizing: border-box;
              }

              *,
              *:before,
              *:after {
                box-sizing: inherit;
              }

              body {
                overflow-y: hidden;
                font-family: ${withFallback(fonts.JUNGKA)};
                color: ${colors.WHITE};
                background-color: ${colors.BLACK};
                line-height: 1.35;
              }

              @font-face {
                font-family: "Jungka";
                src: url("/static/fonts/jungka-light.otf") format("opentype");
                font-weight: 200;
              }

              @font-face {
                font-family: "Jungka";
                src: url("/static/fonts/jungka-regular.otf") format("opentype");
                font-weight: 400;
              }

              @font-face {
                font-family: "Jungka";
                src: url("/static/fonts/jungka-medium.otf") format("opentype");
                font-weight: 500;
              }

              @font-face {
                font-family: "Jungka";
                src: url("/static/fonts/jungka-bold.otf") format("opentype");
                font-weight: 600;
              }
            `}</style>
          </Container>
        </TranslationContext.Provider>
      </AnalyticsContext.Provider>
    )
  }
}

export default Retris
