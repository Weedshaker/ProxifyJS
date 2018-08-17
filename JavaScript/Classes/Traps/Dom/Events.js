import { Proxify } from '../../Handler/Proxify.js'
import { Events as EventsHelper } from '../../Helper/Dom/Events.js'

export const Events = (Root = Proxify()) => class Events extends Root {
  // !!!Don't overwrite this two. Required at Proxify.js
  constructor (proxyRef, targetRef) {
    super(proxyRef, targetRef)

    // !!!Adds to the namespace!!!***********************************
    this.EventsHelper = new EventsHelper()

    // Traps for get*************************************************
    const getTrapEventOn = (target, prop, receiver) => {
      if (!/^\$on[a-z]{1}[a-z]*?$/.test(prop) || !((prop = prop.slice(1)) in target)) return false
      return (funcArr, command = 'push') => {
        if (!Array.isArray(funcArr)) {
          funcArr = [funcArr, {}]
        } else if (!funcArr[1]) {
          funcArr[1] = {}
        }
        if (Array.hasOwnProperty(command)) {
          this.EventsHelper.events.get(prop) ? this.EventsHelper.events.get(prop)[command](funcArr) : this.EventsHelper.events.set(prop, [funcArr])
          target[prop] = (event) => {
            this.EventsHelper.events.get(prop).some(funcArr => {
              const [func, memory] = funcArr
              return func(this.convertTo(this.proxyRef, event), memory, target, prop, receiver)
            })
          }
        } else {
          // remove funcArr
          let eventsArr = this.EventsHelper.events.get(prop)
          if (eventsArr) {
            if (!funcArr[0] || typeof funcArr[0] !== 'function') {
              // clear all
              this.EventsHelper.events.set(prop, [])
            } else {
              // remove specific func
              this.EventsHelper.events.set(prop, (eventsArr = eventsArr.filter(event => event[0] !== funcArr[0])))
            }
          }
        }
        return receiver
      }
    }
    this.trap_get_none = this.trap_get_none.concat([getTrapEventOn])
  }
  // Handler Class ext*********************************************
  ownKeys (target) {
    // get possible keys
    let keys = super.ownKeys(...arguments)
    for (let key in target) {
      if (/^on[a-z]{1}[a-z]*?$/.test(key)) {
        keys.push(`$${key}`)
      }
    }
    return keys
  }
}
