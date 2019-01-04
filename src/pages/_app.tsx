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
import bugsnag from '@bugsnag/js'
import bugsnagReact from '@bugsnag/plugin-react'

const bugsnagClient = bugsnag('d6bc936b6e415dd8ccbf63d75dbd5641')
bugsnagClient.use(bugsnagReact, React)
const ErrorBoundary = bugsnagClient.getPlugin('react')

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
      <ErrorBoundary>
        <AnalyticsContext.Provider value={analytics}>
          <TranslationContext.Provider value={createTranslate(translations)}>
            <Container>
              <Head>
                <meta
                  name="viewport"
                  content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, shrink-to-fit=no"
                />
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
                  width: 100%;
                  height: 100%;
                  position: fixed;
                }
              `}</style>
            </Container>
          </TranslationContext.Provider>
        </AnalyticsContext.Provider>
      </ErrorBoundary>
    )
  }
}

export default Retris
