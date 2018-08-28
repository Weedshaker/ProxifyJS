import { Init as Proxify, proxyRef as ProxifyProxyRef, targetRef as ProxifyTargetRef } from '../Controller/Init.js'

export class ProxifyHook {
  constructor (Handler = Proxify, proxyRef = ProxifyProxyRef, targetRef = ProxifyTargetRef) {
    this.Handler = Handler

    // !!!Don't overwrite this two inside traps, though you could use this to hide the hooks
    this.proxyRef = proxyRef
    this.targetRef = targetRef
  }
  get (Handler = this.Handler) {
    return (value, force = false) => {
      if (force) {
        // force to overwrite possibly previously set Proxy
        if (value[this.targetRef]) {
          value = value[this.targetRef]
          if (value[this.proxyRef]) delete value[this.proxyRef]
        }
      } else {
        // return if proxy is already set
        if (value[this.proxyRef]) return value[this.proxyRef]
      }
      if (typeof value === 'string') value = document.createElement(value)
      if (typeof value !== 'object' || value === null) {
        console.warn(value, `is not an object!`)
        return value
      }
      return (value[this.proxyRef] = new Proxy(value, new Handler(this.proxyRef, this.targetRef)))
    }
  }
}
