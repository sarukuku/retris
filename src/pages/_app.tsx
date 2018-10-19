import App, { AppComponentContext, Container } from "next/app"
import Head from "next/head"
import "normalize.css/normalize.css"
import React from "react"
import { BLACK } from "../styles/colors"
import { JOSEFIN } from "../styles/fonts"

class Retris extends App {
  static async getInitialProps({ Component, ctx }: AppComponentContext) {
    let pageProps = {}

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }

    return { pageProps }
  }

  render() {
    const { Component, pageProps } = this.props
    return (
      <Container>
        <Head>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, shrink-to-fit=no"
          />
          <link
            href="https://fonts.googleapis.com/css?family=Josefin+Sans:400,700"
            rel="stylesheet"
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
            font-family: ${JOSEFIN};
            color: ${BLACK};
            line-height: 1.1;
          }
        `}</style>
      </Container>
    )
  }
}

export default Retris
