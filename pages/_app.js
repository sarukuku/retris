import App, { Container } from 'next/app'
import React from 'react'
import io from 'socket.io-client'
import Head from 'next/head'
import '../node_modules/normalize.css/normalize.css'

class MyApp extends App {
  static async getInitialProps ({ Component, ctx }) {
    let pageProps = {}

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }

    return { pageProps }
  }

  state = {
    socket: null
  }

  componentDidMount () {
    const socket = io()
    this.setState({ socket })
  }

  componentWillUnmount () {
    this.state.socket.close()
  }

  render () {
    const {Component, pageProps} = this.props
    return (
      <Container>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, shrink-to-fit=no" />
        </Head>
        <Component {...pageProps} socket={this.state.socket} />
        <style global jsx>{`
          body {
            overflow-y: hidden;
          }
        `}</style>
      </Container>
    )
  }
}

export default MyApp
