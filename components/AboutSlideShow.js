import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Promise from './promisePolyfill'

function getTransitionDuration(element) {
  let val = window.getComputedStyle(element).getPropertyValue('transition-duration')
  return Number( val.slice(0, -1) ) * 1000
}

class AboutSlideShow extends Component {
  state = {
    current_slide: 0
  }

  componentDidMount() {
    this.timer = setInterval(() => this.nextSlide(), this.props.duration)

    // Carregar as próximas imagens do slide
    Promise.all(
      this.props.slides.slice(1).map(item => this.loadImg(item.src))
    )
  }

  componentWillUnmount() {
    clearInterval(this.timer)
  }

  nextSlide() {
    // Ocultar o slide
    this.slideEl.className = 'code-sample hide'

    let fadeDuration = getTransitionDuration(this.slideEl)
    // Esperar a animação de fade-out do slide anterior
    setTimeout(() => {
      // Mudar para o próximo slide
      this.setState((prevState) => ({
        current_slide: (prevState.current_slide >= (this.props.slides.length - 1)) ? 0 : ++prevState.current_slide
      }), () => {
        // Mostrar o slide
        this.slideEl.className = 'code-sample show'
      })
    }, fadeDuration)
  }
  
  loadImg(url) {
    return new Promise((resolve, reject) => {
      let img = new Image()
	  
      img.addEventListener('load', e => resolve(img))
      img.addEventListener('error', () => reject(new Error(`Failed to load image's URL: ${url}`)))

      img.src = url
    })
  }

  render() {
    // Pegar os atributos do slide atual
    let attrs = this.props.slides[this.state.current_slide]

    return (
      <div className="code-sample-container">
        <img className="code-sample" ref={(node) => this.slideEl = node} {...attrs} />
      </div>
    )
  }
}

AboutSlideShow.defaultProps = {
  duration: 10000 // Tempo que cada slide fica exposto antes de ser trocado (em ms)
}

AboutSlideShow.propTypes = {
  slides: PropTypes.arrayOf(
    PropTypes.shape({
      src: PropTypes.string.isRequired,
      alt: PropTypes.string.isRequired
    })
  ).isRequired,
  duration: PropTypes.number
}

export default AboutSlideShow