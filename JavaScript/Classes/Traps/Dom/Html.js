import { Proxify } from '../../Handler/Proxify.js'

export const Html = (Root = Proxify()) => class Html extends Root {
  // !!!Don't overwrite this two. Required at Proxify.js
  constructor (proxyRef, targetRef) {
    super(proxyRef, targetRef)

    // Traps for get*************************************************
    const getTrapAppendChildren = (target, prop, receiver) => {
      if (prop !== '$appendChildren') return false
      return (children) => {
        children.forEach(child => { if (child) receiver.appendChild(child) })
        return receiver
      }
    }
    const getTrapRemoveChildren = (target, prop, receiver) => {
      if (prop !== '$removeChildren') return false
      return (children) => {
        children.forEach(child => receiver.removeChild(child))
        return receiver
      }
    }

    this.trap_get_none = this.trap_get_none.concat([getTrapAppendChildren, getTrapRemoveChildren])
  }
  // Handler Class ext*********************************************
  ownKeys (target) {
    // get possible keys
    return super.ownKeys(...arguments).concat(['$appendChildren', '$removeChildren'])
  }
}
