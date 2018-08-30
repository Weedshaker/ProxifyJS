/* global __ */
import MasterDocs from './MasterDocs.js'

export default class TrapsDocs extends MasterDocs {
  constructor () {
    super()
    return this.html(__('div'), ...this.text())
  }
  text () {
    return [
      'Traps:',
      `Assemble traps as you like and/or write your own trap. In general its important to note, that not all traps require 
            the Proxify class. Have a look at the trap and make sure that it automatically includes Proxify or add Proxify at 
            the center of your class assembling: <span>Events(Html(Css(Subscribe(LocalStorage(WebWorkers(Chain(Proxify())))))))</span>. Be carefull 
            not to have a trap at the center of your assembling, which only requires Master, when further out traps require Proxify! 
            Each trap extends the trap passed to it...<br><br>
            Get started by creating a hook and hand it your desired trap collection:`,
      `<span>// The hook serves a function which will be able to Proxify objects (including classes)</span><br>
            import { ProxifyHook } from './JavaScript/Classes/Helper/ProxifyHook.js'<br><br>
            <span>// The Proxify Handler is responsible to inject proxies into any objects you interact with.</span><br>
            import { Proxify } from './JavaScript/Classes/Handler/Proxify.js'<br><br>
            <span>// Traps</span><br>
            import { Chain } from './JavaScript/Classes/Traps/Misc/Chain.js'<br>
            import { WebWorkers } from './JavaScript/Classes/Traps/Misc/WebWorkers.js'<br>
            import { LocalStorage } from './JavaScript/Classes/Traps/Data/LocalStorage.js'<br>
            import { Subscribe } from './JavaScript/Classes/Traps/Data/Subscribe.js'<br>
            import { Css } from './JavaScript/Classes/Traps/Dom/Css.js'<br>
            import { Html } from './JavaScript/Classes/Traps/Dom/Html.js'<br>
            import { Events } from './JavaScript/Classes/Traps/Dom/Events.js'<br><br>
            const inject = new ProxifyHook(Events(Html(Css(Subscribe(LocalStorage(WebWorkers(Chain(Proxify())))))))).get()`,
      `Or simply use the preset collection called InitBasic:`,
      `import { ProxifyHook } from './JavaScript/Classes/Helper/ProxifyHook.js'<br><br>
            <span>// Includes traps: Events, Html, Css, Subscribe, LocalStorage, WebWorkers, Chain, Proxify</span><br>
            import { InitBasic } from './JavaScript/Classes/Controller/InitBasic.js'<br><br>
            const inject = new ProxifyHook(InitBasic).get()`,
      `<span>This example page is completely driven by ProxifyJS. You can see on how it works by looking at the source files of 
            the "Docs" folder + index.html.</span>`
    ]
  }
  html (el, ...args) {
    const [title, text1, code1, text2, code2, note] = args
    return el.$appendChildren(
      [
        __('h2')
          .$setInnerHTML(title)
          .$css(false, 'h2'),
        __('p')
          .$setInnerHTML(text1)
          .$css(false, 'p')
          .$func((receiver, ...args) => {
            const spanTag = receiver.getElementsByTagName('span')[0]
            spanTag.$css(false, 'note')
          }),
        __('div')
          .$setInnerHTML(code1)
          .$css(false, 'code'),
        __('p')
          .$setInnerHTML(text2)
          .$css(false, 'p'),
        __('div')
          .$setInnerHTML(code2)
          .$css(false, 'code'),
        __('p')
          .$setInnerHTML(note)
          .$css(false, 'p')
          .$func((receiver, ...args) => {
            const spanTag = receiver.getElementsByTagName('span')[0]
            spanTag.$css(false, 'note')
          }),
        __('hr')
          .$css(false, 'hr')
      ])
  }
}
