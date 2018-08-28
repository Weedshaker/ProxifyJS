/* global __ */
import MasterDocs from '../MasterDocs.js'

export default class MasterExamples extends MasterDocs {
  constructor (makeGlobal) {
    super(makeGlobal)
    this.name = ''
    this.state = __({ expl: 1 })
  }
  html (el, ...args) {
    const [title, text, api, codeShared, codeTitle1, code1, result1, codeTitle2, code2, result2] = args
    return el.$appendChildren([
      typeof title !== 'undefined' && __('h2')
        .$setInnerHTML(title)
        .$css(false, 'h2'),
      typeof text !== 'undefined' && __('p')
        .$setInnerHTML(text)
        .$css(false, 'p'),
      typeof api !== 'undefined' && __('p')
        .$setInnerHTML(api)
        .$css(`{
                    background-color: FloralWhite;
                    border: solid 5px white;
                    color: darkgrey;
                    font-family: Arial;
                    margin: 15px 30px;
                    padding: 20px;
                }`, 'doc')
        .$css(` ul{
                    margin: 15px 0;
                    padding-left: 40px;
                }`, 'docUl')
        .$css(` ul li{
                    list-style: decimal;
                }`, 'docLi'),
      typeof codeTitle1 !== 'undefined' && __('h3')
        .$setInnerHTML(codeTitle1)
        .$setId(this.name + 1)
        .$getClassList((receiver, prop, classList) => classList.add(this.name + 'active'))
        .$setOnclick(() => (this.state.expl = 1))
        .$css([
          `{
                        color: darkblue;
                        cursor: pointer;
                        float: left;
                        font-size: 25px;
                        font-style: italic;
                        margin: 10px 30px 0;
                        text-align: center;
                        transition: color 0.3s ease;
                    }`,
          `:hover{
                        color: pink;
                    }`,
          `[class*='active']{
                        color: pink;
                        cursor: default;
                    }`
        ], 'h3'),
      typeof codeTitle2 !== 'undefined' && __('h3')
        .$setInnerHTML(codeTitle2)
        .$setId(this.name + 2)
        .$setOnclick(() => (this.state.expl = 2))
        .$css(false, 'h3'),
      __('div')
        .$setStyle('clear: both;'),
      __('div')
        .$func((receiver) => {
          let firstRender = true
          this.state.$subscribe(receiver, undefined, 'expl', (value) => {
            Array.from(document.getElementsByClassName(this.name + 'active')).forEach(e => e.classList.remove(this.name + 'active'))
            const activeEl = document.getElementById(this.name + value)
            if (activeEl) activeEl.classList.add(this.name + 'active')
            switch (value) {
              case 1:
                this.exampleHtml(receiver, code1, codeShared, this.example1.bind(this), result1, !firstRender)
                break
              case 2:
                this.exampleHtml(receiver, code2, codeShared, this.example2.bind(this), result2, !firstRender)
                break
            }
            firstRender = false
          })
        }),
      __('hr')
        .$css(false, 'hr')
    ])
  }
  exampleHtml (receiver, code, codeShared, example, result, useWebWorker = true) {
    const oldHeight = receiver.offsetHeight || 410 // initial value of 410 as average height of example box
    receiver.innerHTML = ''
    receiver.$appendChildren([
      typeof code !== 'undefined' && typeof codeShared !== 'undefined' && __('div')
        .$css(false, 'code')
        .$func((receiver, ...args) => {
          // transition
          receiver.$setStyle(`opacity: 0; height: ${oldHeight}px;`)
          if (useWebWorker) {
            // do all the regex stuff at webworker
            __(this).$wwRegexCodeStr((codeStr) => {
              receiver
                .$setInnerHTML(codeShared + codeStr)
                .$setStyle('opacity: 1; height: auto;')
            }, code.toLocaleString())
          } else {
            // or faster for this not calc intensive regex at dom threat
            receiver.$setInnerHTML(codeShared + this.regexCodeStr(code.toLocaleString())).$setStyle('opacity: 1; height: auto;')
          }
        }),
      typeof example !== 'undefined' && __('div')
        .$func((receiver, ...args) => example(receiver))
        .$css(`{
                    background-color: LightSteelBlue;
                    border: solid 5px white;
                    color: black;
                    font-family: Arial;
                    font-size: 14px;
                    margin: 15px 30px;
                    padding: 20px;
                    text-align: right;
                }`, 'result'),
      typeof result !== 'undefined' && __('p')
        .$setInnerHTML(result)
        .$css(false, 'p')
        .$css(`{
                    color: darkred;
                    text-align: center;
                }`, 'resultText')
    ])
  }
  regexCodeStr (code) {
    return code
      .replace(/(\r\n|\r|\n)\s{4}/g, '$1') // remove indentation
      .replace(/.*?\(.*?\).*?\{(\r\n|\r|\n)([\s\S]*)\}$/m, '$2') // replace function start and end
      .replace(/\/\/(.*)(\r\n|\r|\n)/g, '<span>//$1</span>\n') // format commands
      .replace(/\/\*([\s\S]*)\*\//gm, '<span>/*$1*/</span>') // format multiline command
      .replace(/\r\n|\r|\n/g, '<br>')
      .replace(/\t|\s{2}/g, '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;')
      .replace(/this\.makeGlobal\('.*?',\s([\s\S]*?)\)\)/gm, '$1)')
      .replace(/receiver\.appendChild\((.*?)\)/gm, 'document.getElementsByTagName(\'body\')[0].appendChild($1)')
      .replace(/inject\(receiver\)/gm, 'inject(document.getElementsByTagName(\'body\')[0])')
  }
}
