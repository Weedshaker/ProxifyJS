export class Proxify {
  constructor (proxyRef, targetRef, ProxyConstructor) {
    this.proxyRef = proxyRef
    this.targetRef = targetRef
    this.ProxyConstructor = ProxyConstructor
  }
  // Helper Functions**********************************************
  convertArgsTo (type, value) {
    // catching arguments-arrays and converting its content, if targetRef is required (Note: HTMLNodeList's, etc. don't handle proxies)
    return value.map(e => this.convertTo(type, e))
  }
  convertTo (type, value) {
    if (value === null || typeof value !== 'object') return value
    // return already converted objects
    let result
    if ((result = value[type])) return result
    return type === this.proxyRef ? this.addProxy(value) : value
  }
  addProxy (value) {
    return (value[this.proxyRef] = new Proxy(value, new this.ProxyConstructor(this.proxyRef, this.targetRef)))
  }
}
