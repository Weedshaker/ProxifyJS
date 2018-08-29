import { Master } from '../../Handler/Master.js'
import { LocalStorage as LocalStorageHelper } from '../../Helper/Data/LocalStorage.js'

// !!!requires Classes->Helper.Master.js->convertTo!!!
export const LocalStorage = (Root = Master()) => class LocalStorage extends Root {
  // !!!Don't overwrite this two. Required at Master.js
  constructor (proxyRef, targetRef) {
    super(proxyRef, targetRef)

    // !!!Adds to the namespace!!!***********************************
    this.LocalStorageHelper = new LocalStorageHelper()

    // Traps for get*************************************************
    const getTrapAdd = (target, prop, receiver) => {
      if (prop !== '$lStoreAdd') return false
      return (prop, key) => {
        if (this.LocalStorageHelper.storeArr.indexOf(prop) === -1) this.LocalStorageHelper.storeArr.push(prop)
        if (key) this.LocalStorageHelper.getKey(target, key)
        return receiver
      }
    }
    const getTrapRemove = (target, prop, receiver) => {
      if (prop !== '$lStoreRemove') return false
      return (prop) => {
        // eliminate any doublicated values
        this.LocalStorageHelper.storeArr = [...new Set(this.LocalStorageHelper.storeArr)]
        let index = this.LocalStorageHelper.storeArr.indexOf(prop)
        if (index !== -1) this.LocalStorageHelper.storeArr.splice(index, 1)
        return receiver
      }
    }

    const getTrapGet = (target, prop, receiver) => {
      if (!this.LocalStorageHelper.storeArr.includes(prop) && !this.LocalStorageHelper.storeArr.includes('all')) return false
      return this.LocalStorageHelper.get(prop, target) // returns null and continues the default behavior
    }

    this.trap_get_none = this.trap_get_none.concat([getTrapAdd, getTrapRemove, getTrapGet])
    this.trap_get = this.trap_get.concat([getTrapGet])

    // Traps for set*************************************************
    const setTrapSet = (target, prop, value, receiver) => {
      if (!this.LocalStorageHelper.storeArr.includes(prop) && !this.LocalStorageHelper.storeArr.includes('all')) return false
      this.LocalStorageHelper.set(prop, value, target)
      return true // break the default behavior and avoid default set on target
    }

    this.trap_set = this.trap_set.concat([setTrapSet])

    // Traps for getOwnPropertyDescriptor, Used for loops*************************************************
    const getOwnPropertyDescriptorTrap = (target, prop) => {
      let value
      if (prop in target || (!(value = this.LocalStorageHelper.get(prop, target)) && !this.LocalStorageHelper.storeArr.includes(prop))) return false
      return { value, writable: true, enumerable: true, configurable: true }
    }

    this.trap_getOwnPropertyDescriptor = this.trap_getOwnPropertyDescriptor.concat([getOwnPropertyDescriptorTrap])
  }
  // Handler Class ext*********************************************
  deleteProperty (target, prop) {
    this.LocalStorageHelper.delete(prop, target)
    return super.deleteProperty(...arguments)
  }
  ownKeys (target) {
    // get possible keys
    return super.ownKeys(...arguments).concat(['$lStoreAdd', '$lStoreRemove'].concat([...new Set((JSON.parse(this.LocalStorageHelper.get('keys', target)) || []).concat(this.LocalStorageHelper.storeArr.filter(prop => !(prop in target) && prop !== 'all')))]))
  }
}
