/* global __ */
import MasterDocs from './MasterDocs.js'

export default class HowDocs extends MasterDocs {
  constructor () {
    super()
    return this.html(__('div'), ...this.text())
  }
  text () {
    return [
      'How?',
      `Proxies are pretty low-level within JS and need to be directly supported by the JavaScript engine. There isn't any good ES5 
            polyfill. Which points out how powerful these are. They came alive with ECMAScript 6 compatibility and allow 
            you to trap fundamental operations like get, set, construct, etc. This keeps your object 100% shielded within 
            the Proxy without altering it.<br><br>
            ProxifyJS lifts these capabilities to a further level by injecting Proxies to every object and function returns. This then applies not only to your object or function within the Proxy but keeps your 
            whole program thread shielded until you willingly break out.<br><br>
            <span>Here should be an image on how it works, I got it in my mind, though I am too lazzy for drawing now...</span><br><br>
            Anyways, you may imagine that your thread goes through the program from objects through 
            functions, etc. ProxifyJS is like a pipe around your thread, everytime your thread accesses an object it will first 
            hit the Proxy's shield (the pipes wall). Which then applies itself to every object the tread interacts with, as 
            well as every operation goes through some logic. Those logics are called traps. This allows you to not only trap 
            properties but also functions and even trap properties and functions, which don't exist on the target object.`
    ]
  }
  html (el, ...args) {
    const [title, text] = args
    return el.appendChild(__('h2'))
      .$setInnerHTML(title)
      .$css(`{
                color: darkgrey;
                font-size: 44px;
                font-style: italic;
                margin: 25px 0 25px;
                text-align: center;
            }`, 'h2')
      .parentElement
      .appendChild(__('p'))
      .$setInnerHTML(text)
      .$css(false, 'p')
      .$func((receiver, ...args) => {
        const spanTag = receiver.getElementsByTagName('span')[0]
        spanTag.$css(
          `{
                        font-style: italic;
                    }`, 'note'
        )
      })
      .parentElement
      .appendChild(__('hr'))
      .$css(false, 'hr')
      .parentElement
  }
}
