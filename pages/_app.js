import App, { Container } from 'next/app'
import React from 'react'
import io from 'socket.io-client'
import Head from 'next/head'
import '../node_modules/normalize.css/normalize.css'
import { JOSEFIN } from '../lib/styles/fonts'
import { BLACK } from '../lib/styles/colors'

class MyApp extends App {
  static async getInitialProps({ Component, ctx }) {
    let pageProps = {}

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }

    return { pageProps }
  }

  state = {
    socket: null
  }

  addListenerOnce(name, callback) {
    this.props.socket.off(name);
    this.props.socket.on(name, callback);
  }

  componentDidMount() {
    const socket = io()
    socket.on('connect', () => {
      this.setState({ socket })
    })
  }

  componentWillUnmount() {
    this.state.socket.close()
  }

  render() {
    const { Component, pageProps } = this.props
    return (
      <Container>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, shrink-to-fit=no" />
          <link href="https://fonts.googleapis.com/css?family=Josefin+Sans:400,700" rel="stylesheet"></link>
        </Head>
        {this.state.socket ? (
          <Component {...pageProps} socket={this.state.socket} />
        ) : (<div>loading...</div>)}
        <style global jsx>{`
          body {
            overflow-y: hidden;
            font-family: ${JOSEFIN};
            color: ${BLACK};
          }
        `}</style>
      </Container>
    )
  }
}

export default MyApp
