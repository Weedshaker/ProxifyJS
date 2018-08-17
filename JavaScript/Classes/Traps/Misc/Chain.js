import { Proxify } from '../../Handler/Proxify.js'

export const Chain = (Root = Proxify()) => class Chain extends Root {
  // !!!Don't overwrite this two. Required at Proxify.js
  constructor (proxyRef, targetRef) {
    super(proxyRef, targetRef)

    // Traps for get*************************************************
    const getTrapGet = (target, prop, receiver) => {
      // if (!/^\$get/.test(prop) || !((prop = prop.charAt(4).toLowerCase() + prop.slice(5)) in target)) return false;
      if (!/^\$get/.test(prop)) return false
      prop = prop.charAt(4).toLowerCase() + prop.slice(5)
      return (func, ...args) => {
        // escape functions and simply execute those, get is meant for properties
        if (typeof target[prop] === 'function') return receiver[prop](...args)
        if (typeof func !== 'function') return receiver[prop]
        func(receiver, prop, receiver[prop], ...args)
        return receiver
      }
    }
    const getTrapSet = (target, prop, receiver) => {
      // if (!/^\$set/.test(prop) || !((prop = prop.charAt(4).toLowerCase() + prop.slice(5)) in target)) return false;
      if (!/^\$set/.test(prop)) return false
      prop = prop.charAt(4).toLowerCase() + prop.slice(5)
      return (...args) => {
        // escape functions and simply execute those, set is meant for properties
        if (typeof target[prop] === 'function') return receiver[prop](...args)
        receiver[prop] = args[0]
        return receiver
      }
    }
    // simply executes a function
    const getTrapFunc = (target, prop, receiver) => {
      if (prop !== '$func') return false
      return (func, ...args) => {
        if (typeof func === 'function') func(receiver, ...args)
        return receiver
      }
    }
    // make any function on target return the proxy
    const getTrap_ = (target, prop, receiver) => {
      if (!/^\$_/.test(prop) || !((prop = prop.charAt(2).toLowerCase() + prop.slice(3)) in target)) return false
      return (...args) => receiver[prop](...args, '__returnReceiver__')
    }

    this.trap_get_none = this.trap_get_none.concat([getTrapGet, getTrapSet, getTrapFunc, getTrap_])
  }
  // Handler Class ext*********************************************
  getFunction (target, prop, receiver) {
    return (...args) => {
      // calls with __$ return target
      let returnReceiver = false
      if (args.slice(-1)[0] === '__returnReceiver__') {
        args.splice(-1)
        returnReceiver = true
      }
      // calls with proxy in args map to responding this.targetRef
      const result = super.getFunction(target, prop, receiver)(...args)
      // results with target map to responding __proxy__
      if (!returnReceiver) return result
      return receiver
    }
  }
  ownKeys (target) {
    // get possible keys
    let keys = super.ownKeys(...arguments)
    for (let key in target) {
      keys.push(key)
      if (typeof target[key] === 'function') {
        keys.push(`$_${key}`)
      } else if (key !== this.proxyRef) {
        key = key.charAt(0).toUpperCase() + key.slice(1)
        keys.push(`$get${key}`)
        keys.push(`$set${key}`)
      }
    }
    keys.push('$func')
    return keys
  }
}
