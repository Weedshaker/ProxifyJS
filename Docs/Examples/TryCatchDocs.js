/* global alert, __ */
import MasterExamples from './MasterExamples.js'
// used for examples
import { ProxifyHook } from '../../JavaScript/Classes/Helper/ProxifyHook.js'
import { TryCatch } from '../../JavaScript/Classes/Traps/Misc/TryCatch.js'

export default class TryCatchDocs extends MasterExamples {
  constructor (makeGlobal) {
    super(makeGlobal)
    this.name = 'tryCatchDocs'
    return this.html(__('div'), ...this.text())
  }
  text () {
    return [
      'TryCatch',
      `The trap called TryCatch at /JavaScript/Classes/Traps/Misc/TryCatch.js, does catch errors on all object 
            functions called through the Proxy and returns detailed information about the error.`,
      `TryCatch is invoked by simply hooking the trap. Here isn't any more syntax for the moment.`,
      `import { ProxifyHook } from './JavaScript/Classes/Helper/ProxifyHook.js'<br>
            import { TryCatch } from './JavaScript/Classes/Traps/Misc/TryCatch.js'<br><br>`,
      'Example',
      this.example1,
      `Just, click the button above and look at your console's output!`
    ]
  }
  example1 (receiver) {
    // assemble the ProxifyHook with the minimum traps required
    const inject = new ProxifyHook(TryCatch()).get()

    // proxify the object to which tryCatch checking is applied
    const tryCatchState = this.makeGlobal('tryCatchState', inject(
      {
        a: (arg) => { throw new Error('baaaahhhh I am an Errrrroooor!') }
      }
    ))

    let counter = 0
    const btn = document.createElement('button')
    btn.innerHTML = 'Click Me!'
    btn.onclick = () => {
      if (counter === 0) alert('Please, open the console in your developer tools before clicking "OK"!')
      const modulus = counter % 3
      if (modulus === 0) {
        tryCatchState.a('Hello Function First')
      } else if (modulus === 1) {
        tryCatchState.a('Hello Function Second')
      } else {
        tryCatchState.a('Hello Function Last')
      }
      counter++
    }
    receiver.appendChild(btn)
  }
}
