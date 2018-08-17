import { Master } from '../../Handler/Master.js'
import { WebWorkers as WebWorkersHelper } from '../../Helper/Misc/WebWorkers.js'

export const WebWorkers = (Root = Master()) => class WebWorkers extends Root {
  // !!!Don't overwrite this two. Required at Proxify.js
  constructor (proxyRef, targetRef) {
    super(proxyRef, targetRef)

    // !!!Adds to the namespace!!!***********************************
    this.WebWorkersHelper = new WebWorkersHelper()

    // Traps for get*************************************************
    // make any function on target be run within WebWorkers
    const getTrapWebWorkers = (target, prop, receiver) => {
      if (!/^\$ww/.test(prop) || !((prop = prop.charAt(3).toLowerCase() + prop.slice(4)) in target)) return false
      return (func, ...args) => {
        let scripts = false
        if (Array.isArray(func) && func.length === 2) [func, scripts] = func
        const index = this.WebWorkersHelper.create(target[prop], func, scripts)
        const promise = this.WebWorkersHelper.run(args, this.WebWorkersHelper.workers[index], func)
        return func ? receiver : promise
      }
    }

    this.trap_get_none = this.trap_get_none.concat([getTrapWebWorkers])
  }
  // Handler Class ext*********************************************
  ownKeys (target) {
    // get possible keys
    let keys = super.ownKeys(...arguments)
    for (let key in target) {
      if (typeof target[key] === 'function') {
        key = key.charAt(0).toUpperCase() + key.slice(1)
        keys.push(`$ww${key}`)
      }
    }
    return keys
  }
}
