/* global __ */
export default class Scroll {
  constructor (body) {
    this.state = __({ scroll: 0 }).$lStoreAdd('scroll')
    window.onload = () => { window.scroll(0, this.state.scroll) }
    this.timeout = null
    this.saveScroll()
  }
  saveScroll () {
    window.addEventListener('scroll', (e) => {
      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        this.state.scroll = window.scrollY
      }, 500)
    })
  }
}
