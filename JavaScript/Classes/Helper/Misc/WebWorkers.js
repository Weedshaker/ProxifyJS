/* global Blob, BlobBuilder, Worker */
export class WebWorkers {
  constructor (spreadArgs = true) {
    this.spreadArgs = spreadArgs
    this.name = 'MasterWorker'
    this.workers = []
    this.callbacks = []
    this.trackers = [] // simply used to track if function has already been set as this.workers
    this.scripts = []
  }
  // handled by the structured clone algorithm, so no need for convertTo
  // workerFunc can not reference anything outside (func becomes string), data has to be passed to the worker function
  create (workerFunc = this.workerFunc, callback = this.callbackFunc, scripts) {
    const index = this.trackers.indexOf(workerFunc)
    if (index === -1) {
      this.workers.push(this.getWebWorker(workerFunc, scripts))
      this.callbacks.push(callback)
      this.trackers.push(workerFunc)
      return this.trackers.length - 1
    } else if (scripts) {
      console.warn(`SST: Scripts: "${scripts.join(',')}" were not added to the webworker. Scripts must be applied on first create for workerFunc: ${workerFunc.toLocaleString()}`)
    }
    return index
  }
  run (data = [], worker = this.workers[0], callback = this.callbacks[0]) {
    return new Promise((resolve, reject) => {
      worker(data, (err, result) => {
        if (err) reject(err, console.warn(`SST: Error at ${this.name} -> ${err.message}`))
        if (callback) resolve(callback(result))
        resolve(result)
      })
    })
  }
  // dummy examples
  workerFunc (data) {
    return data
  }
  callbackFunc (result) {
    console.log(result)
  }
  getWebWorker (workerFunc, scripts = this.scripts) {
    // URL.createObjectURL
    window.URL = window.URL || window.webkitURL

    // add scripts outside of event
    scripts = Array.isArray(scripts) && scripts.length ? `importScripts('${scripts.join("','")}');\n` : ''
    if (typeof workerFunc !== 'string') {
      workerFunc = workerFunc.toLocaleString()
      workerFunc = workerFunc.replace(/this\./g, '')
      if (/^\(.*?\).*?=>.*?\{/.test(workerFunc)) {
        // arrow functions need to be wrapped with ()
        workerFunc = `(${workerFunc})`
      } else if (!/^function/.test(workerFunc)) {
        // class functions need the keyword function
        workerFunc = `function ${workerFunc}`
      }
    }
    const response = `onmessage=(event)=>{postMessage(${workerFunc}(${this.spreadArgs ? '...' : ''}event.data));}`

    let blob
    try {
      blob = new Blob([scripts, response], { type: 'application/javascript' })
    } catch (e) { // Backwards-compatibility
      window.BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder
      blob = new BlobBuilder()
      blob.append(scripts)
      blob.append(response)
      blob = blob.getBlob()
    }

    const worker = new Worker(URL.createObjectURL(blob))
    return (data = [], callback = () => { }) => {
      let ran
      worker.onmessage = (e) => {
        if (ran) return
        ran = true
        callback(null, e.data)
      }
      worker.onerror = (e) => {
        if (ran) return
        ran = true
        callback(e)
        return false
      }
      worker.postMessage(data) // can only have one argument as message
    }
  }
}
