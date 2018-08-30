/* global __ */
import MasterDocs from './MasterDocs.js'

export default class WhyDocs extends MasterDocs {
  constructor () {
    super()
    return this.html(__('div'), ...this.text())
  }
  text () {
    return [
      'Why?',
      `In general my client work includes frameworks like react, angular, etc. I like parts of those frameworks, eg.
            components. But I also love the MVC pattern simply utilizing ES6 classes. All the scenarios of those frameworks can be 
            covered with vanilla ES6, even though something is missing to conveniently interact with HTML nodes. This can be tackled 
            in a none intrusive manner using ProxifyJS.<br><br>
            A Proxy can be swiftly assembled with the needed functions (traps) without any 
            overhead nor dependencies and the program is free to escape the Proxy by using __raw__ or reenter by __proxy__ at anytime. Means it never 
            forces a pattern upon you and your program. The same is true for installing ProxifyJS. Use ECMAScript 2015 import statements, 
            which works with and without bundlers like webpack, etc. No compiling needed!!!<br><br>
            There are many ways for Proxy-Techniques to be applied to your problem. I think the traps, so far in this repo, just scratch the 
            surface of what is possible. Although, I got a few examples below, which go beyond the usual scenario of using
            Proxies for debugging. They are very well suited for handling any api's. Due to my line of work, the current state of this repo
            mainly deals with the DOM api. But anything is possible with Proxies!<br><br>
            This repo should be an inspiration to write more traps for numerous use cases.<br>
            <span>I would be very happy to get a lot of PR's!</span>`
    ]
  }
  html (el, ...args) {
    const [title, text] = args
    return el.appendChild(__('h2'))
      .$setInnerHTML(title)
      .$css(false, 'h2')
      .parentElement
      .appendChild(__('p'))
      .$setInnerHTML(text)
      .$css(false, 'p')
      .$func((receiver, ...args) => {
        const spanTag = receiver.getElementsByTagName('span')[0]
        spanTag.$css(false, 'note')
      })
      .parentElement
      .appendChild(__('hr'))
      .$css(false, 'hr')
      .parentElement
  }
}
