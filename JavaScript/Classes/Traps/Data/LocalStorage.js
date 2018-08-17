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
      return (prop) => {
        this.LocalStorageHelper.storeArr.push(prop)
        return receiver
      }
    }
    const getTrapeRemove = (target, prop, receiver) => {
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

    this.trap_get_none = this.trap_get_none.concat([getTrapAdd, getTrapeRemove, getTrapGet])
    this.trap_get = this.trap_get.concat([getTrapGet])

    // Traps for set*************************************************
    const setTrapSet = (target, prop, value, receiver) => {
      if (!this.LocalStorageHelper.storeArr.includes(prop) && !this.LocalStorageHelper.storeArr.includes('all')) return false
      this.LocalStorageHelper.set(prop, value, target)
      return true // break the default behavior and avoid default set on target
    }

    this.trap_set = this.trap_set.concat([setTrapSet])
  }
  // Handler Class ext*********************************************
  ownKeys (target) {
    // get possible keys
    return super.ownKeys(...arguments).concat(['$lStoreAdd', '$lStoreRemove'].concat(this.LocalStorageHelper.storeArr.filter(prop => !(prop in target))))
  }
}
