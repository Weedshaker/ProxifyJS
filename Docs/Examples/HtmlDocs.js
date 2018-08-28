/* global __ */
import MasterExamples from './MasterExamples.js'
// used for examples
import { ProxifyHook } from '../../JavaScript/Classes/Helper/ProxifyHook.js'
import { Html } from '../../JavaScript/Classes/Traps/Dom/Html.js'

export default class HtmlDocs extends MasterExamples {
  constructor (makeGlobal) {
    super(makeGlobal)
    this.name = 'htmlDocs'
    return this.html(__('div'), ...this.text())
  }
  text () {
    return [
      'HTML',
      `The trap called Html at /JavaScript/Classes/Traps/Dom/Html.js, does extend DOM commands for managing HTML nodes. At the moment this trap only includes two functions, 
            although this will hopefully increase.`,
      `$appendChildren(children)
            <ul>
                <li>children: Array&lt;Node | Proxy(Node)&gt; = HTMLNodes to be appended.</li>
            </ul>
            => returns the Proxy<br><br><br>
            $removeChildren(children)
            <ul>
                <li>children: Array&lt;Node | Proxy(Node)&gt; = HTMLNodes to be removed.</li>
            </ul>
            => returns the Proxy`,
      `import { ProxifyHook } from './JavaScript/Classes/Helper/ProxifyHook.js'<br>
            import { Html } from './JavaScript/Classes/Traps/Dom/Html.js'<br><br>`,
      'Example',
      this.example1,
      `Please, open the console in your developer tools and inspect the appended div!`
    ]
  }
  example1 (receiver) {
    // assemble the ProxifyHook with the minimum traps required
    const inject = new ProxifyHook(Html()).get()

    const div = document.createElement('div')
    // use plain and/or proxified nodes
    const span1 = document.createElement('span')
    span1.innerHTML = 'Hello'
    const span2 = inject(document.createElement('span'))
    span2.innerHTML = 'World'
    const span3 = inject('span')
    span3.innerHTML = '!'

    // proxify the object to which the HTML nodes shall be appended
    this.makeGlobal('div', inject(div).$appendChildren([span1, span2, span3]))

    // append div to body
    receiver.appendChild(div)
  }
}
