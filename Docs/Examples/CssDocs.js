/* global __ */
import MasterExamples from './MasterExamples.js'
// used for examples
import { ProxifyHook } from '../../JavaScript/Classes/Helper/ProxifyHook.js'
import { Css } from '../../JavaScript/Classes/Traps/Dom/Css.js'

export default class CssDocs extends MasterExamples {
  constructor (makeGlobal) {
    super(makeGlobal)
    this.name = 'cssDocs'
    return this.html(__('div'), ...this.text())
  }
  text () {
    return [
      'CSS',
      `The trap called Css at /JavaScript/Classes/Traps/Dom/Css.js, does manage inline style tags for convenience and  
            enables Dom nodes to use pseudo classes, etc.<br><br>Note: By default the styles will be appended to the head. Although, if you have an element with the id="css-container", it will use that container.`,
      `$css(css, id = ["lastUsedId" || node.id || "randomString"])
            <ul>
                <li>css: string | Array&lt;string&gt; | false = CSS styles. Use an empty string to clear the CSS and the 
                style tag, if no other node uses that style tag. Use false, to reuse an already set style, requires the 
                id to match the target styles id.</li>
                <li>[id]: string = the reference to the style, can be used for sharing styles between elements. Not setting 
                an id will cause it to fallback to the lastUsedId, the node.id or then just applies a randomString.</li>
            </ul>
            => returns the Proxy`,
      `import { ProxifyHook } from './JavaScript/Classes/Helper/ProxifyHook.js'<br>
            import { Css } from './JavaScript/Classes/Traps/Dom/Css.js'<br><br>`,
      'Example One',
      this.example1,
      `Please, open the console in your developer tools and change p.$css(\`{ ...anything }\`)!`,
      'Example Two',
      this.example2,
      `Please, open the console in your developer tools and change p.$css(\`:hover{ ...anything }\`, 'cssDocsExpl2')!`
    ]
  }
  example1 (receiver) {
    // assemble the ProxifyHook with the minimum traps required
    const inject = new ProxifyHook(Css()).get()

    const p = document.createElement('p')
    p.innerHTML = 'Hello World!'

    // proxify the object to which the CSS shall be applied
    this.makeGlobal('p', inject(p)
      .$css(`{
        color: red;
        font-weight: bold;
      }`))

    // append p to body
    receiver.appendChild(p)
  }
  example2 (receiver) {
    // assemble the ProxifyHook with the minimum traps required
    const inject = new ProxifyHook(Css()).get()

    const p = document.createElement('p')
    p.innerHTML = 'Hello World!'

    // proxify the object to which the CSS shall be applied and copy the h1 style
    inject(p).$css(false, 'h1')
    this.makeGlobal('p', inject(p)
      .$css([
        `{
          text-align: right;
        }`,
        `:hover{
          background: 0;
          text-shadow: none;
        }`
      ], 'cssDocsExpl2'))

    // append p to body
    receiver.appendChild(p)
  }
}
