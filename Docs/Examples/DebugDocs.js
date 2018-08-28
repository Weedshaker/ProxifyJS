/* global alert, __ */
import MasterExamples from './MasterExamples.js'
// used for examples
import { ProxifyHook } from '../../JavaScript/Classes/Helper/ProxifyHook.js'
import { Debug } from '../../JavaScript/Classes/Traps/Misc/Debug.js'

export default class DebugDocs extends MasterExamples {
  constructor (makeGlobal) {
    super(makeGlobal)
    this.name = 'debugDocs'
    return this.html(__('div'), ...this.text())
  }
  text () {
    return [
      'Debug',
      `The trap called Debug at /JavaScript/Classes/Traps/Misc/Debug.js, does spy on object properties and triggers on 'get' and 'set', 
            the commands "debugger" and/or "console.log()".`,
      `$debug(propNames)
            <ul>
                <li>propNames: string | Array&lt;string&gt; | 'all' = The properties on which the debugger shall be invoked on.</li>
            </ul>
            => returns the Proxy<br><br><br>
            $clog(propNames)
            <ul>
                <li>propNames: string | Array&lt;string&gt; | 'all' = The properties, which shall be logged out to the console.</li>
            </ul>
            => returns the Proxy`,
      `import { ProxifyHook } from './JavaScript/Classes/Helper/ProxifyHook.js'<br>
            import { Debug } from './JavaScript/Classes/Traps/Misc/Debug.js'<br><br>`,
      'Example',
      this.example1,
      `Just, click the button above and look at your console's output!`
    ]
  }
  example1 (receiver) {
    // assemble the ProxifyHook with the minimum traps required
    const inject = new ProxifyHook(Debug()).get()

    // proxify the object to which debugging shall be applied
    const dgState = this.makeGlobal('dgState', inject(
      {
        a: 'Hello',
        b: 'World',
        c: '!'
      }
    ))

    // start debugger as soon as dgState.a is accessed by get or set
    dgState.$debug('a')
    // log out to console as soon as any property of dgState is accessed by get or set
    dgState.$clog('all')

    let didClick = false
    const btn = document.createElement('button')
    btn.innerHTML = 'Click Me!'
    btn.onclick = () => {
      if (!didClick) {
        didClick = true
        alert('Please, open the console in your developer tools before clicking "OK"!')
        dgState.a = 'Good Morning'
      } else {
        dgState.a = '... and again Good Morning'
      }
    }
    receiver.appendChild(btn)
  }
}
