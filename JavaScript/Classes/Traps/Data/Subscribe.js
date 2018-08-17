import { Proxify } from '../../Handler/Proxify.js'
import { Subscribe as SubscribeHelper } from '../../Helper/Data/Subscribe.js'

// !!!requires Classes->Helper.Proxify.js->convertTo!!!
export const Subscribe = (Root = Proxify()) => class Subscribe extends Root {
  // !!!Don't overwrite this two. Required at Proxify.js
  constructor (proxyRef, targetRef) {
    super(proxyRef, targetRef)

    // !!!Adds to the namespace!!!***********************************
    this.SubscribeHelper = new SubscribeHelper()

    // Traps for get*************************************************
    const getTrapSubscribe = (target, prop, receiver) => {
      if (prop !== '$subscribe') return false
      return (destination, key, localKey = 'all', func = null) => {
        if (!this.SubscribeHelper.subscribeMap) this.SubscribeHelper.subscribeMap = new Map()
        this.SubscribeHelper.subscribeMap.get(localKey) ? this.SubscribeHelper.subscribeMap.get(localKey).push([destination, key, func]) : this.SubscribeHelper.subscribeMap.set(localKey, [[destination, key, func]])
        const result = func ? func(receiver[localKey] || receiver) : this.convertTo(this.targetRef, receiver[localKey]) || receiver
        if (key in destination) destination[key] = result
        return receiver
      }
    }
    const getTrapunsubscribe = (target, prop, receiver) => {
      if (prop !== '$unsubscribe') return false
      return (destination, key, localKey = 'all') => {
        let subscribeArr = this.SubscribeHelper.subscribeMap.get(localKey)
        if (subscribeArr) {
          this.SubscribeHelper.subscribeMap.set(localKey, (subscribeArr = subscribeArr.filter(e => e[1] !== key || this.convertTo(this.targetRef, e[0]) !== this.convertTo(this.targetRef, destination))))
          if (subscribeArr.length === 0) this.SubscribeHelper.subscribeMap.delete(localKey)
          if (!Array.from(this.SubscribeHelper.subscribeMap.entries()).length) this.SubscribeHelper.subscribeMap = null
        }
        return receiver
      }
    }

    this.trap_get_none = this.trap_get_none.concat([getTrapSubscribe, getTrapunsubscribe])
  }
  // Handler Class ext*********************************************
  set (target, prop, value, receiver) {
    if (this.SubscribeHelper.subscribeMap) {
      const subscribeArr = this.SubscribeHelper.subscribeMap.get(prop) || this.SubscribeHelper.subscribeMap.get('all')
      if (subscribeArr) {
        subscribeArr.forEach(e => {
          const result = e[2] ? e[2](value) : this.convertTo(this.targetRef, value)
          if (e[1] in e[0]) e[0][e[1]] = result
        })
      }
    }
    return super.set(...arguments)
  }
  ownKeys (target) {
    // get possible keys
    return super.ownKeys(...arguments).concat(['$subscribe', '$unsubscribe'])
  }
}
