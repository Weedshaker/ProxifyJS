import { Master } from '../../Handler/Master.js'

export const Types = (Root = Master()) => class Types extends Root {
  // Handler Class ext*********************************************
  set (target, prop, value, receiver) {
    if (typeof target[prop] !== typeof value) console.warn('$types->setProp changed', { target, prop, oldValue: `<${typeof target[prop]}>${target[prop]}`, newValue: `<${typeof value}>${value}`, receiver })
    return super.set(...arguments)
  }
}
