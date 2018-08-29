import { Master } from '../../Handler/Master.js'
import { Debug as DebugHelper } from '../../Helper/Misc/Debug.js'

export const Debug = (Root = Master()) => class Debug extends Root {
  // !!!Don't overwrite this two. Required at Proxify.js
  constructor (proxyRef, targetRef) {
    super(proxyRef, targetRef)

    // !!!Adds to the namespace!!!***********************************
    this.DebugHelper = new DebugHelper()

    // Traps for get*************************************************
    const getTrapDebug = (target, prop, receiver) => {
      if (prop !== '$debug') return false
      return (propNames) => {
        this.DebugHelper.debugArr = Array.isArray(propNames) ? propNames : propNames ? [propNames] : []
        return receiver
      }
    }
    const getTrapConsoleLog = (target, prop, receiver) => {
      if (prop !== '$clog') return false
      return (propNames) => {
        this.DebugHelper.clogArr = Array.isArray(propNames) ? propNames : propNames ? [propNames] : []
        return receiver
      }
    }

    this.trap_get_none = this.trap_get_none.concat([getTrapDebug, getTrapConsoleLog])
  }
  // Handler Class ext*********************************************
  get (target, prop, receiver) {
    if (this.DebugHelper.debugArr.includes(prop) || this.DebugHelper.debugArr.includes('all')) debugger// eslint-disable-line
    if (this.DebugHelper.clogArr.includes(prop) || this.DebugHelper.clogArr.includes('all')) console.log('$clog->getProp', { target, prop, receiver })
    return super.get(...arguments)
  }
  set (target, prop, value, receiver) {
    if (this.DebugHelper.debugArr.includes(prop) || this.DebugHelper.debugArr.includes('all')) debugger// eslint-disable-line
    if (this.DebugHelper.clogArr.includes(prop) || this.DebugHelper.clogArr.includes('all')) console.log('$clog->setProp', { target, prop, oldValue: target[prop], newValue: value, receiver })
    return super.set(...arguments)
  }
  ownKeys (target) {
    // get possible keys
    return super.ownKeys(...arguments).concat(['$debug', '$clog'])
  }
}
