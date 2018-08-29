/* global __ */
import MasterExamples from './MasterExamples.js'
// used for examples
import { ProxifyHook } from '../../JavaScript/Classes/Helper/ProxifyHook.js'
import { LocalStorage } from '../../JavaScript/Classes/Traps/Data/LocalStorage.js'

export default class LocalStorageDocs extends MasterExamples {
  constructor (makeGlobal) {
    super(makeGlobal)
    this.name = 'localStorageDocs'
    return this.html(__('div'), ...this.text())
  }
  text () {
    return [
      'LocalStorage',
      `The trap called LocalStorage at /JavaScript/Classes/Traps/Data/LocalStorage.js, does mock and serve primitive properties on your object from localStorage. The 
            object doesn't need to posses such property but will still get and set, from and to, localStorage. If the object does posses a value on a localStorage property, 
            it would fallback to it, incase the localStorage does return a falsy value... Please, have a look at the limitations of <a href="https://developer.mozilla.org/en-US/docs/Web/API/Storage/LocalStorage" target="_blank">localStorage</a>, 
            especially the way it stores its values as UTF-16 DOMStrings.`,
      `$lStoreAdd(prop)
            <ul>
                <li>prop: string | 'all' = The property which the localStorage shall mock.</li>
                <li>[key]: string = A key to additionally, uniquely identify at localStorage. Can only be set at first init.</li>
            </ul>
            => returns the Proxy<br><br><br>
            $lStoreRemove(prop)
            <ul>
                <li>prop: string = The property which the localStorage shall stop mocking.</li>
            </ul>
            => returns the Proxy`,
      `import { ProxifyHook } from './JavaScript/Classes/Helper/ProxifyHook.js'<br>
            import { LocalStorage } from './JavaScript/Classes/Traps/Data/LocalStorage.js'<br><br>`,
      'Example',
      this.example1,
      `Please, open the console in your developer tools and inspect lsStateRaw. Also, navigate to the Storage tab, open Local Storage and "get" and "set" values on lsState!`
    ]
  }
  example1 (receiver) {
    // assemble the ProxifyHook with the minimum traps required
    const inject = new ProxifyHook(LocalStorage()).get()

    // proxify the object to which the LocalStorage shall be applied
    const lsState = this.makeGlobal('lsState', inject(window.lsStateRaw = {
      a: 'Hello value from Object!'
    }))

    // serve property "a" from localStorage or fallback to objects value
    lsState.$lStoreAdd('a', 'LocalStorageDocs')
    let p = receiver.appendChild(document.createElement('p'))
    // no value on localStorage => falls back to lsState.a
    p.innerHTML = lsState.a // on first run or after clearing the localStorage: "Hello value from Object!" else "Hello localStorage"

    // sets value to localStorage
    lsState.a = 'Hello localStorage'
    p = receiver.appendChild(document.createElement('p'))
    // serves value from localStorage
    p.innerHTML = lsState.a // "Hello localStorage"

    // removes localStorage mocking
    lsState.$lStoreRemove('a')
    p = receiver.appendChild(document.createElement('p'))
    // serves value as usual from lsState.a
    p.innerHTML = lsState.a // "Hello value from Object!"

    // serve property "x", which does not exist on lsState from localStorage
    lsState.$lStoreAdd('x')
    lsState.x = 'Hello non existing prop!'
    p = receiver.appendChild(document.createElement('p'))
    // serves value from localStorage
    p.innerHTML = lsState.x // "Hello non existing prop!"

    // serve all properties, which do and do not exist on lsState from localStorage
    lsState.$lStoreAdd('all')
    lsState.one = 'One'
    lsState.two = 'Two'
    lsState.three = 'Three'
    p = receiver.appendChild(document.createElement('p'))
    // serves value from localStorage
    p.innerHTML = `${lsState.one}, ${lsState.two}, ${lsState.three}` // "One, Two, Three"
  }
}
