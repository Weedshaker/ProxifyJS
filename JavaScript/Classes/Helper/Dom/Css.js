export class Css {
  // Helper Functions**********************************************
  getId (receiver, idName, id) {
    if (id !== undefined) return id
    const ids = Array.from(receiver.classList).filter(e => e.includes(idName)) || []
    // means it just grabs the last added style or falls back to el id || randomString
    return ids.length && ids.slice(-1)[0] !== undefined ? ids.slice(-1)[0].replace(`${idName}-`, '') : receiver.getAttribute('id') || this.getRandomString()
  }
  getContainer (containerIdName) {
    return document.getElementById(containerIdName) ? document.getElementById(containerIdName) : document.getElementsByTagName('head')[0]
  }
  getStyle (style, container, idName, id) {
    if (style) return style
    style = container.appendChild(document.createElement('style'))
    style.setAttribute('type', 'text/css')
    style.setAttribute(idName, id)
    return style
  }
  getRandomString () {
    if (window.crypto && window.crypto.getRandomValues && navigator.userAgent.indexOf('Safari') === -1) {
      let a = window.crypto.getRandomValues(new Uint32Array(3))
      let token = ''
      for (let i = 0, l = a.length; i < l; i++) {
        token += a[i].toString(36)
      }
      return token
    } else {
      return (Math.random() * new Date().getTime()).toString(36).replace(/\./g, '')
    }
  }
  getCssFormatted (className, css) {
    if (!Array.isArray(css)) css = [css]
    return css.reduce((acc, curr) => {
      if (!curr) return acc
      const regex = /(.*?)(\{)/
      return acc + curr.replace(regex, `${curr.match(regex)[1].split(',').reduce((acc, curr, i, arr) => acc + `.${className}${curr}${i < arr.length - 1 ? ',' : ''}`, '')}$2`)
    }, '')
  }
}
