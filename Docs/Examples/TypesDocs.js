/* global alert, __ */
import MasterExamples from './MasterExamples.js'
// used for examples
import { ProxifyHook } from '../../JavaScript/Classes/Helper/ProxifyHook.js'
import { Types } from '../../JavaScript/Classes/Traps/Misc/Types.js'

export default class TypesDocs extends MasterExamples {
  constructor (makeGlobal) {
    super(makeGlobal)
    this.name = 'typesDocs'
    return this.html(__('div'), ...this.text())
  }
  text () {
    return [
      'Types',
      `The trap called Types at /JavaScript/Classes/Traps/Misc/Types.js, does spy on all object properties and gets 
            triggered, when a value gets replaced with a different type than the old type was.`,
      `Types checking is invoked by simply hooking the trap. Here isn't any more syntax for the moment.`,
      `import { ProxifyHook } from './JavaScript/Classes/Helper/ProxifyHook.js'<br>
            import { Types } from './JavaScript/Classes/Traps/Misc/Types.js'<br><br>`,
      'Example',
      this.example1,
      `Just, click the button above and look at your console's output!`
    ]
  }
  example1 (receiver) {
    // assemble the ProxifyHook with the minimum traps required
    const inject = new ProxifyHook(Types()).get()

    // proxify the object to which types checking is applied
    const typeState = this.makeGlobal('typeState', inject(
      {
        a: 'Hello',
        b: 'World',
        c: '!'
      }
    ))

    let counter = 0
    const btn = document.createElement('button')
    btn.innerHTML = 'Click Me!'
    btn.onclick = () => {
      if (counter === 0) alert('Please, open the console in your developer tools before clicking "OK"!')
      const modulus = counter % 3
      typeState.a = modulus === 0 ? 236 : modulus === 1 ? ['Hello'] : 'Hello'
      counter++
    }
    receiver.appendChild(btn)
  }
}
