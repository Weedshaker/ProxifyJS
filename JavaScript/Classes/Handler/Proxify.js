// !!!This contains an overwrite and should be placed as low as possible!!! See: Classes->Controller->Init.js

import { Master } from './Master.js'
import { Proxify as ProxifyHelper } from '../Helper/Handler/Proxify.js'

// Proxify Terminology vs MDN: Raw = Target
// ConvertTo attaches the proxy to the raw object and also returns the raw object when called prop this.targetRef on proxy
// Prop get => returns Proxy representation of Raw
// Function do the same with return values
// Prop set => returns Raw Object hold by proxy
export const Proxify = (Root = Master()) => class Proxify extends Root {
  constructor (proxyRef, targetRef) {
    super()

    // !!!Adds to the namespace!!!***********************************
    this.proxyRef = proxyRef || '__proxy__'
    this.targetRef = targetRef || '__raw__'
    this.ProxifyHelper = new ProxifyHelper(this.proxyRef, this.targetRef, this.constructor)

    // Traps for get*************************************************
    // returns the proxy, this is important to avoid recursions
    const getTrapProxy = (target, prop, receiver) => {
      if (prop !== this.proxyRef) return false
      return receiver
    }
    // returns the raw target object attached to the proxy
    const getTrapRaw = (target, prop, receiver) => {
      if (prop !== this.targetRef) return false
      return target
    }
    // returns a function converting to targetRef on input and output to proxyRef
    const getTrapFunction = (target, prop, receiver) => {
      if (typeof target[prop] !== 'function') return false
      return this.getFunction(target, prop, receiver)
    }

    this.trap_get.push(getTrapFunction, getTrapProxy)
    this.trap_get_none.push(getTrapRaw)
  }
  // !!!Handler Class overwrite!!!*********************************
  getOwnPropertyDescriptor (target, prop) {
    if (prop === this.proxyRef) return undefined // used for "for"-loops, avoid giving the __proxy__ reference
    let result
    if (this.trap_getOwnPropertyDescriptor.some(func => (result = func(...arguments)))) return result
    return Reflect.getOwnPropertyDescriptor(...arguments)
  }
  get (target, prop, receiver) {
    let result
    // for performance reason; existing props and none existing props get handled in different arrays
    if (prop in target) {
      if (this.trap_get.some(func => (result = func(...arguments)))) return result
    } else {
      if (this.trap_get_none.some(func => (result = func(...arguments)))) return result
    }
    // cant convert Reflect.get(...arguments)
    return this.convertTo(this.proxyRef, target[prop])
  }
  set (target, prop, value, receiver) {
    let result
    if (this.trap_set.some(func => (result = func(...arguments)))) return result
    return Reflect.set(target, prop, this.convertTo(this.targetRef, value), target)
  }
  ownKeys (target) {
    // get possible keys
    let result
    if (this.trap_ownKeys.some(func => (result = func(...arguments)))) return result
    return [this.targetRef]
  }
  // !!!Adds to the namespace!!!***********************************
  getFunction (target, prop, receiver) {
    return (...args) => {
      // calls with proxy in args map to responding this.targetRef
      return this.convertTo(this.proxyRef, target[prop](...this.convertArgsTo(this.targetRef, args)))
      // returns results with target map to responding this.proxyRef
    }
  }
  convertTo (type, value) {
    return this.ProxifyHelper.convertTo(type, value)
  }
  convertArgsTo (type, value) {
    return this.ProxifyHelper.convertArgsTo(type, value)
  }
}
