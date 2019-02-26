import * as React from 'react'
import { NextAppContext } from 'next'
import App, { Container } from 'next/app'
import NProgress from 'nprogress'
import Router from 'next/router'
import Delegate from 'delegate'

import '../styles/main.less'
import '../styles/nprogress.css'

import Notification from '../components/Notification/Notification'

export default class MyApp extends App {
  static async getInitialProps({ Component, ctx }: NextAppContext) {
    let pageProps = {}

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }

    return { pageProps }
  }
  
  componentDidMount() {
    // Delegar um evento global para todos os links da página
    Delegate('a', 'click', this.handleLinkClick)

    console.log('%c👀', 'font-size: 20px;');
  }
  
  handleLinkClick(event: any) {
    let link = event.delegateTarget,
      url = link.href
    
    // Checar se é um link específico da sessão "Sobre"
    if (/\#work-tecbolt$/g.test(url)) {
      event.preventDefault()
  
      // Mover o scroll até a sessão #works
      location.hash = '#works'
  
      // Dar foco ao link do tecbolt
      document.getElementById('work-tecbolt')!.focus()
    }

    // Enviar evento para o Google Analytics
    gtag('event', 'click', {
      'event_category': 'links',
      'event_label': `Cliques em "${url}"`
    })
  }

  render () {
    const { Component, pageProps } = this.props

    return (
      <Container>
        <Component {...pageProps} />
        <Notification />
      </Container>
    )
  }
}

NProgress.configure({
  trickleSpeed: 100,
  showSpinner: false
})

Router.events.on('routeChangeStart', (url: string) => {
  console.log(`Loading: ${url}`)
  NProgress.start()
})
Router.events.on('routeChangeComplete', () => NProgress.done())
Router.events.on('routeChangeError', () => NProgress.done())