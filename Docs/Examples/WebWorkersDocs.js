/* global alert, __ */
import MasterExamples from './MasterExamples.js'
// used for examples
import { ProxifyHook } from '../../JavaScript/Classes/Helper/ProxifyHook.js'
import { WebWorkers } from '../../JavaScript/Classes/Traps/Misc/WebWorkers.js'

export default class WebWorkersDocs extends MasterExamples {
  constructor (makeGlobal) {
    super(makeGlobal)
    this.name = 'webWorkersDocs'
    return this.html(__('div'), ...this.text())
  }
  text () {
    return [
      'WebWorkers',
      `The trap called WebWorkers at /JavaScript/Classes/Traps/Misc/WebWorkers.js, does allow to quickly execute a function within 
            a Web Worker. It does stringify a function, put it into a Blob and executes it on a separate thread appart from the main Dom thread. 
            Find more information about <a href="https://developer.mozilla.org/en-US/docs/Web/API/Worker" target="_blank">Web Workers</a> 
            and its limitations.`,
      `$ww + "functionName"(func, ...args = undefined)
            <ul>
                <li>[func]: function | Array&lt;[function], [scripts]: Array&lt;string&gt;&gt; = simply pass one function as callback. Or pass 
                an array with [function, [scripts (scripts to be imported to the Web Workers namespace)]]. The callback receives: 
                the result of the Web Worker.</li>
                <li>[...args]: any = arguments which will be passed to the function.</li>
            </ul>
            => returns the Proxy, if a callback function is passed in. Else, it will return a promise, which gets resolved with the result from 
            the Web Worker.`,
      `import { ProxifyHook } from './JavaScript/Classes/Helper/ProxifyHook.js'<br>
            import { WebWorkers } from './JavaScript/Classes/Traps/Misc/WebWorkers.js'<br><br>`,
      'Example One',
      this.example1,
      `Just, click the buttons above and wait for the alert with the result! You can also open the console in your developer tools 
            and run webWorkersObj.$wwFibonacci and webWorkersObj.fibonacci with your own number to calculate.`
    ]
  }
  example1 (receiver) {
    // assemble the ProxifyHook with the minimum traps required
    const inject = new ProxifyHook(WebWorkers()).get()

    // proxify the object, which holds the functions to execute at a Web Worker
    const webWorkersObj = this.makeGlobal('webWorkersObj', inject(
      {
        // the function must have a name, when it recursively calls itself
        fibonacci: function fibonacci (n, name, log = false) {
          const before = Date.now()
          const result = n < 1 ? 0 : n <= 2 ? 1 : this.fibonacci(n - 1) + this.fibonacci(n - 2)
          if (log) return `${name} [Result:${result}, time: ${Date.now() - before} ms.]`
          return result
        }
      }
    ))

    const btn1 = document.createElement('button')
    btn1.innerHTML = 'Click Me and calc fibonacci at Web Worker!'
    btn1.onclick = () => {
      // execute the function within a Web Worker and for that at a new program thread
      webWorkersObj.$wwFibonacci(alert, 25, 'From Web Worker', true)
    }
    receiver.appendChild(btn1)

    const btn2 = document.createElement('button')
    btn2.innerHTML = 'Click Me and calc fibonacci at Dom thread!'
    btn2.onclick = () => {
      // execute the function classically at the Dom thread
      alert(webWorkersObj.fibonacci(25, 'From Dom thread', true))
    }
    receiver.appendChild(btn2)
  }
}
