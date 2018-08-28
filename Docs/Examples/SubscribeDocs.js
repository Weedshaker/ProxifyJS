/* global __ */
import MasterExamples from './MasterExamples.js'
// used for examples
import { ProxifyHook } from '../../JavaScript/Classes/Helper/ProxifyHook.js'
import { Subscribe } from '../../JavaScript/Classes/Traps/Data/Subscribe.js'

export default class SubscribeDocs extends MasterExamples {
  constructor (makeGlobal) {
    super(makeGlobal)
    this.name = 'subscribeDocs'
    return this.html(__('div'), ...this.text())
  }
  text () {
    return [
      'Subscribe',
      `The trap called Subscribe at /JavaScript/Classes/Traps/Data/Subscribe.js, does make a relationship between values on two 
            different objects. Source automatically pushes designated values on localKey to target (destination[key]). A Dom 
            usecase scenario would be to have a state object, which gets manipulated by the result of your api calls, 
            and directly maps to a DOM nodes content.`,
      `$subscribe(destination, key, localKey, func = null)
            <ul>
                <li>destination: object = the object which holds the target property</li>
                <li>key: string = the name of the target property (can be purposefully wrong, incase the default behavior 
                shall be avoided)</li>
                <li>localKey: string = the name of the source property</li>
                <li>[func]: function = a callback, which receives: the newValue and can handle things on its own manually</li>
            </ul>
            => returns the Proxy<br><br><br>
            $unsubscribe(destination, key, localKey)
            <ul>
                <li>destination: object = the object which holds the target property</li>
                <li>key: string = the name of the target property</li>
                <li>localKey: string = the name of the source property</li>
            </ul>
            => returns the Proxy`,
      `import { ProxifyHook } from './JavaScript/Classes/Helper/ProxifyHook.js'<br>
            import { Subscribe } from './JavaScript/Classes/Traps/Data/Subscribe.js'<br><br>`,
      'Example One',
      this.example1,
      `Please, open the console in your developer tools and change the string values of state.a, state.b or state.c!`,
      'Example Two',
      this.example2,
      `Please, open the console in your developer tools and change the arrays value at state.a!`
    ]
  }
  example1 (receiver) {
    // assemble the ProxifyHook with the minimum traps required
    const inject = new ProxifyHook(Subscribe()).get()

    // proxify the object to which binding shall take place
    const state = this.makeGlobal('state', inject(
      {
        a: 'Hello',
        b: 'World',
        c: '!'
      }
    ))

    // use plain and/or proxified nodes
    const p1 = document.createElement('p')
    const p2 = inject(document.createElement('p'))
    const p3 = inject('p')

    // subscribe nodes innerHTML to the values of state 'a', 'b' and 'c'
    state.$subscribe(p1, 'innerHTML', 'a')
    state.$subscribe(p2, 'innerHTML', 'b')
    state.$subscribe(p3, 'innerHTML', 'c')

    // append all to body, has to use the raw node, since we don't proxify the body in this statement
    receiver.appendChild(p1)
    receiver.appendChild(p2.__raw__)
    receiver.appendChild(p3.__raw__)
  }
  example2 (receiver) {
    // assemble the ProxifyHook with the minimum traps required
    const inject = new ProxifyHook(Subscribe()).get()

    // proxify the object to which binding shall take place
    const state = this.makeGlobal('state', inject(
      {
        a: ['Hello', 'List', '!']
      }
    ))

    // append ul to body
    const ul = receiver.appendChild(document.createElement('ul'))

    // subscribe ul by custom function to the values of state 'a'
    state.$subscribe(ul, undefined, 'a', (values) => {
      ul.innerHTML = ''
      values.forEach(value => {
        const li = document.createElement('li')
        li.innerHTML = value
        ul.appendChild(li)
      })
    })
    setTimeout(() => {
      // the limitation is, that the prop has to be set directly, in the future Subscribe will may support push, splice, etc. on arrays
      state.a = state.a.concat(['and hi!'])
    }, 5000)
  }
}
