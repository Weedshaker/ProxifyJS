import { Proxify } from '../../Handler/Proxify.js'
import { Css as CssHelper } from '../../Helper/Dom/Css.js'

export const Css = (Root = Proxify()) => class Css extends Root {
  // !!!Don't overwrite this two. Required at Proxify.js
  constructor (proxyRef, targetRef) {
    super(proxyRef, targetRef)

    // !!!Adds to the namespace!!!***********************************
    this.CssHelper = new CssHelper()

    // Traps for get*************************************************
    const getTrapCss = (target, prop, receiver) => {
      if (prop !== '$css') return false
      return (css, id) => {
        // setup
        const idName = 'css-id'
        id = this.CssHelper.getId(receiver, idName, id)
        const containerIdName = 'css-container'
        const container = this.CssHelper.getContainer(containerIdName)
        let style = container.querySelector(`[${idName}="${id}"]`)
        if (css !== '') {
          style = this.CssHelper.getStyle(style, container, idName, id)
          let formatedCss = ''
          if (/\{.|\r|\n*\}$/.test(css) && (formatedCss = this.CssHelper.getCssFormatted(`${idName}-${id}`, css)) !== style.innerHTML) style.innerHTML = formatedCss
          if (!receiver.classList.contains(`${idName}-${id}`)) receiver.classList.add(`${idName}-${id}`)
        } else {
          if (receiver.classList.contains(`${idName}-${id}`)) receiver.classList.remove(`${idName}-${id}`)
          if (style && !document.getElementsByClassName(`${idName}-${id}`).length) style.remove()
        }
        return receiver
      }
    }

    this.trap_get_none = this.trap_get_none.concat([getTrapCss])
  }
  // Handler Class ext*********************************************
  ownKeys (target) {
    // get possible keys
    return super.ownKeys(...arguments).concat(['$css'])
  }
}
