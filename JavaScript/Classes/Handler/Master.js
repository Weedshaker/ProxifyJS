// defines the namespace of the handler
export const Master = (Root = Object) => class Master extends Root {
  constructor () {
    super()
    this.trap_getPrototypeOf = []
    this.trap_setPrototypeOf = []
    this.trap_isExtensible = []
    this.trap_preventExtensions = []
    this.trap_getOwnPropertyDescriptor = []
    this.trap_defineProperty = []
    this.trap_has = []
    this.trap_get = []
    this.trap_get_none = [] // for none existent property
    this.trap_set = []
    this.trap_deleteProperty = []
    this.trap_ownKeys = []
    this.trap_apply = []
    this.trap_construct = []
  }
  getPrototypeOf (target) {
    let result
    if (this.trap_getPrototypeOf.some(func => (result = func(...arguments)))) return result
    return Reflect.getPrototypeOf(...arguments)
  }
  setPrototypeOf (target, prototype) {
    let result
    if (this.trap_setPrototypeOf.some(func => (result = func(...arguments)))) return result
    return Reflect.setPrototypeOf(...arguments)
  }
  isExtensible (target) {
    let result
    if (this.trap_isExtensible.some(func => (result = func(...arguments)))) return result
    return Reflect.isExtensible(...arguments)
  }
  preventExtensions (target) {
    let result
    if (this.trap_preventExtensions.some(func => (result = func(...arguments)))) return result
    return Reflect.preventExtensions(...arguments)
  }
  getOwnPropertyDescriptor (target, prop) {
    let result
    if (this.trap_getOwnPropertyDescriptor.some(func => (result = func(...arguments)))) return result
    return Reflect.getOwnPropertyDescriptor(...arguments)
  }
  defineProperty (target, prop, descriptor) {
    let result
    if (this.trap_defineProperty.some(func => (result = func(...arguments)))) return result
    return Reflect.defineProperty(...arguments)
  }
  has (target, prop) {
    let result
    if (this.trap_has.some(func => (result = func(...arguments)))) return result
    return Reflect.has(...arguments)
  }
  get (target, prop, receiver) {
    let result
    if (prop in target) {
      if (this.trap_get.some(func => (result = func(...arguments)))) return result
    } else {
      if (this.trap_get_none.some(func => (result = func(...arguments)))) return result
    }
    return Reflect.get(...arguments)
  }
  set (target, prop, value, receiver) {
    let result
    if (this.trap_set.some(func => (result = func(...arguments)))) return result
    return Reflect.set(...arguments)
  }
  deleteProperty (target, prop) {
    let result
    if (this.trap_deleteProperty.some(func => (result = func(...arguments)))) return result
    return Reflect.deleteProperty(...arguments)
  }
  ownKeys (target) {
    let result
    if (this.trap_ownKeys.some(func => (result = func(...arguments)))) return result
    return Reflect.ownKeys(...arguments)
  }
  apply (target, thisArg, argumentsList) {
    let result
    if (this.trap_apply.some(func => (result = func(...arguments)))) return result
    return Reflect.apply(...arguments)
  }
  construct (target, argumentsList, newTarget) {
    let result
    if (this.trap_construct.some(func => (result = func(...arguments)))) return result
    return Reflect.construct(...arguments)
  }
}
// mostly as defined at https://developer.mozilla.org/en-US/Docs/Web/JavaScript/Reference/Global_Objects/Proxy
