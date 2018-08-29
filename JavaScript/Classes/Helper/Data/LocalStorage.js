/* global localStorage */
export class LocalStorage {
  constructor () {
    this.storeArr = []
    this._key = 0
  }
  // UTF-16 DOMString at storage, so no need for convertTo
  get (prop, target) {
    return localStorage.getItem(`${this.getKey(target)}:${prop}`)
  }
  set (prop, value, target, addToKeys = true) {
    if (addToKeys && this.storeArr.includes('all') && !(prop in target)) localStorage.setItem(`${this.getKey(target)}:keys`, JSON.stringify([...new Set((JSON.parse(this.get('keys', target)) || []).concat([prop]))]))
    localStorage.setItem(`${this.getKey(target)}:${prop}`, value)
  }
  delete (prop, target) {
    localStorage.removeItem(`${this.getKey(target)}:${prop}`)
    const keys = JSON.parse(this.get('keys', target)) || []
    let index = keys.indexOf(prop)
    if (index !== -1) {
      keys.splice(index, 1)
      this.set('keys', JSON.stringify(keys), target, false)
    }
  }
  getKey (target, key) {
    // TODO: Please, let me know, if you find a better way to get a unique key of an object without using values, timestamps and all the stuff which doesn't work in this scenario. THX!
    if (!this._key) this._key = this.getHash(`${key}:${target.constructor.name}:${target.constructor.toLocaleString()}:${JSON.stringify(Object.keys(target))}`)
    return this._key
  }
  getHash (str) {
    let hash = 0
    let i
    let chr
    for (i = 0; i < str.length; i++) {
      chr = str.charCodeAt(i)
      hash = ((hash << 5) - hash) + chr
      hash |= 0 // Convert to 32bit integer
    }
    return Math.abs(hash)
  }
}
