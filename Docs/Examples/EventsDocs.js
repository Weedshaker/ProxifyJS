/* global alert, __ */
import MasterExamples from './MasterExamples.js'
// used for examples
import { ProxifyHook } from '../../JavaScript/Classes/Helper/ProxifyHook.js'
import { Events } from '../../JavaScript/Classes/Traps/Dom/Events.js'

export default class EventsDocs extends MasterExamples {
  constructor (makeGlobal) {
    super(makeGlobal)
    this.name = 'eventsDocs'
    return this.html(__('div'), ...this.text())
  }
  text () {
    return [
      'Events',
      `The trap called Events at /JavaScript/Classes/Traps/Dom/Events.js, does manage Dom events starting with on..., 
            like onclick, onblur, etc. This trap allows multiple callback functions to be applied to a typical single callback 
            event binding.`,
      `$on + "eventName"(funcArr, command = 'push')
            <ul>
                <li>funcArr: function | Array&lt;function, [memory]: object&gt; = simply pass one function as callback and the memory 
                will be set as an empty object {}. Or pass an array with [function, memory]. The callback receives: dom event, memory, target, prop, receiver. 
                Executing callbacks will be halted after one callback returns a none falsy value.</li>
                <li>[command]: string = the command which will be executed on the array, holding all callbacks for this event. 
                Typically use 'push' to attach the event to the end of the execution loop or 'unshift' to push it at first position. Use an 
                unknown array command like 'remove', to have the passed in callback function removed. (You can also remove all 
                callbacks by passing $on + "eventName"(false, 'remove'))</li>
            </ul>
            => returns the Proxy`,
      `import { ProxifyHook } from './JavaScript/Classes/Helper/ProxifyHook.js'<br>
            import { Events } from './JavaScript/Classes/Traps/Dom/Events.js'<br><br>`,
      'Example One',
      this.example1,
      `Click on the text above. Also, open the console in your developer tools and add or remove more events to eventsP!`,
      'Example Two',
      this.example2,
      `Click on the text above. Also, open the console in your developer tools and add or remove more events to eventsP!`
    ]
  }
  example1 (receiver) {
    // assemble the ProxifyHook with the minimum traps required
    const inject = new ProxifyHook(Events()).get()

    // proxify the node to which event binding shall take place
    const eventsP = this.makeGlobal('eventsP', inject(document.createElement('p')))
    eventsP.innerHTML = `!!!Click me!!!`

    // attach first callback to p.onclick
    eventsP.$onclick((event, memory, target, prop, receiver) => {
      memory.a = !memory.a ? 1 : memory.a + 1
      alert(`I got ${memory.a} times clicked!`)
    })
    // attach second callback to p.onclick
    eventsP.$onclick((event, memory, target, prop, receiver) => {
      memory.a = !memory.a ? 2 : memory.a + 2
      alert(`${memory.a} times...`)
    })

    // append p to body
    receiver.appendChild(eventsP)
  }
  example2 (receiver) {
    // assemble the ProxifyHook with the minimum traps required
    const inject = new ProxifyHook(Events()).get()

    // proxify the node to which event binding shall take place
    const eventsP = this.makeGlobal('eventsP', inject(document.createElement('p')))
    eventsP.innerHTML = `Click me and don't P at an event!`

    // attach first callback to p.onclick
    eventsP.$onclick((event, memory, target, prop, receiver) => {
      memory.a = !memory.a ? 1 : memory.a + 1
      alert(`I got ${memory.a} times clicked!`)
    })

    const secondCallback = (event, memory, target, prop, receiver) => {
      alert(`I remove myself!`)
      // removes itself after first execution
      receiver.$onclick(secondCallback, 'remove')
    }
    // attach second callback to p.onclick
    eventsP.$onclick(secondCallback)

    // append p to body
    receiver.appendChild(eventsP)
  }
}
