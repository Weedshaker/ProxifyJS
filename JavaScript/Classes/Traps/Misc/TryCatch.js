import { Proxify } from '../../Handler/Proxify.js'

export const TryCatch = (Root = Proxify()) => class TryCatch extends Root {
  // Handler Class ext*********************************************
  getFunction (target, prop, receiver) {
    return (...args) => {
      try {
        return super.getFunction(target, prop, receiver)(...args)
      } catch (error) {
        console.error('Error:', { error, target, prop, receiver, args })
      }
    }
  }
}
