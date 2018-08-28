/* global __ */
import MasterExamples from './MasterExamples.js'
// used for examples
import { ProxifyHook } from '../../JavaScript/Classes/Helper/ProxifyHook.js'
import { Chain } from '../../JavaScript/Classes/Traps/Misc/Chain.js'

export default class ChainDocs extends MasterExamples {
  constructor (makeGlobal) {
    super(makeGlobal)
    this.name = 'chainDocs'
    return this.html(__('div'), ...this.text())
  }
  text () {
    return [
      'Chain',
      `The trap called Chain at /JavaScript/Classes/Traps/Misc/Chain.js, does Method Chaining. The $get and $set allow 
            accessing properties as a function statement. $func makes it easy to execute any function within the method chaining and $_ can be prepended 
            to any function name on the target object, to have it return the Proxy itself and for that doesn't break the chain.`,
      `$get + "propName"(func = undefined, ...args = undefined)
            <ul>
                <li>[func]: function = a callback, which receives: receiver, prop, receiver[prop] (the value of the property), ...args.</li>
                <li>[...args]: any = arguments which will be passed to the function.</li>
            </ul>
            => returns the Proxy, if a function is passed in. Else, it will return the value.<br><br><br>
            $set + "propName"(argument)
            <ul>
                <li>argument: any = the value which shall be set to the property.</li>
            </ul>
            => returns the Proxy<br><br><br>
            $func(func, ...args)
            <ul>
                <li>func: function = a function, which will be executed within the method chaining and receives: receiver, ...args.</li>
                <li>[...args]: any = arguments which will be passed to the function.</li>
            </ul>
            => returns the Proxy<br><br><br>
            $_ + "functionName"(...args = undefined)
            <ul>
                <li>[...args]: any = arguments which will be passed to the function.</li>
            </ul>
            => returns the Proxy`,
      `import { ProxifyHook } from './JavaScript/Classes/Helper/ProxifyHook.js<br>
            import { Chain } from './JavaScript/Classes/Traps/Misc/Chain.js'<br><br>`,
      'Example without comments',
      this.example1,
      `Please, open the console in your developer tools and play with chainState!`,
      'Example with comments',
      this.example2,
      `Please, open the console in your developer tools and play with chainState!`
    ]
  }
  example1 (receiver) {
    // assemble the ProxifyHook with the minimum traps required
    const inject = new ProxifyHook(Chain()).get()

    // proxify body
    const body = inject(receiver)

    // proxify the object to which the Chain shall be applied
    this.makeGlobal('chainState', inject({
      a: 'Hello World!',
      b: 'Hello Universe!',
      c: function (str) {
        this.b = str
        return str
      }
    })).$getA((receiver, prop, value, ...args) => {
      body.appendChild(inject('p')).$setInnerHTML(`${value}:${args[0]}`)
    }, 'My Argument')
      .$func((receiver, ...args) => {
        body.appendChild(inject('b')).$setInnerHTML(receiver.a).parentElement.appendChild(inject('b')).$setInnerHTML(receiver.b)
      })
      .$setB('Hello Galaxy!')
      .$getB((receiver, prop, value, ...args) => {
        body.appendChild(inject('p')).$setInnerHTML(`${value}`)
      })
      .$_c('Hello SpaceX!')
      .$getB((receiver, prop, value, ...args) => {
        body.appendChild(inject('p')).$setInnerHTML(`${value}`)
      })
  }
  example2 (receiver) {
    // assemble the ProxifyHook with the minimum traps required
    const inject = new ProxifyHook(Chain()).get()

    // proxify body
    const body = inject(receiver)

    // proxify the object to which the Chain shall be applied
    this.makeGlobal('chainState', inject({
      a: 'Hello World!',
      b: 'Hello Universe!',
      c: function (str) {
        this.b = str
        return str
      }
    }))
    // getTrapGet: get an object property and hand it over to custom callback. Returns Proxy.
      .$getA((receiver, prop, value, ...args) => {
      // append p to body
        body.appendChild(inject('p'))
        // getTrapSet: set an object property. Returns Proxy.
          .$setInnerHTML(`${value}:${args[0]}`) // "Hello World!:My Argument"
      }, 'My Argument')
    // getTrapFunc: hands over the receiver to a custom function. Returns Proxy.
      .$func((receiver, ...args) => {
      // append p to body
        body.appendChild(inject('b'))
        // getTrapSet: set an object property. Returns Proxy.
          .$setInnerHTML(receiver.a) // "Hello World!"
        // append p to body
        body.appendChild(inject('b'))
        // getTrapSet: set an object property. Returns Proxy.
          .$setInnerHTML(receiver.b) // "Hello Universe!"
      })
    // getTrapSet: set an object property. Returns Proxy.
      .$setB('Hello Galaxy!')
    // getTrapGet: get an object property and hand it over to custom callback. Returns Proxy.
      .$getB((receiver, prop, value, ...args) => {
      // append p to body
        body.appendChild(inject('p'))
        // getTrapSet: set an object property. Returns Proxy.
          .$setInnerHTML(`${value}`) // "Hello Galaxy!"
      })
    // getTrap_ (underscore): executes a function on the object. Returns Proxy and ignores the functions return.
      .$_c('Hello SpaceX!')
    // getTrapGet: get an object property and hand it over to custom callback. Returns Proxy.
      .$getB((receiver, prop, value, ...args) => {
      // append p to body
        body.appendChild(inject('p'))
        // getTrapSet: set an object property. Returns Proxy.
          .$setInnerHTML(`${value}`) // "Hello SpaceX!"
      })
  }
}
