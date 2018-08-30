/* global __ */
import MasterDocs from './MasterDocs.js'

export default class TitleDocs extends MasterDocs {
  constructor () {
    super()
    return this.html(__('div'), ...this.text())
  }
  text () {
    return [
      'ProxifyJS',
      `import { ProxifyHook } from './JavaScript/Classes/Helper/ProxifyHook.js'<br>
            import { InitBasic } from './JavaScript/Classes/Controller/InitBasic.js'<br><br>
            <span>// InitBasic includes the traps: Events, Html, Css, Subscribe, LocalStorage, WebWorkers, Chain, Proxify</span><br>
            const __ = new ProxifyHook(InitBasic).get()<br>
            __(document.getElementsByTagName('body')[0])<br>
            ${this.t}.appendChild(__('h1'))<br>
            ${this.t}.$setInnerHTML('ProxifyJS')<br>
            ${this.t}.$css([<br>
            ${this.t}${this.t}\`{<br>
            ${this.t}${this.t}${this.t}background: -moz-linear-gradient(top, rgba(0, 1, 37, 0.65) 0%, rgba(0, 247, 255, 0) 100%);<br>
            ${this.t}${this.t}${this.t}background: -webkit-linear-gradient(top, rgba(0, 1, 37, 0.65) 0%, rgba(0, 247, 255, 0) 100%);<br>
            ${this.t}${this.t}${this.t}background: linear-gradient(to bottom, rgba(0, 1, 37, 0.65) 0%, rgba(0, 247, 255, 0) 100%);<br>
            ${this.t}${this.t}${this.t}-webkit-text-fill-color: transparent;<br>
            ${this.t}${this.t}${this.t}-webkit-background-clip: text;<br>
            ${this.t}${this.t}${this.t}font-size: 77px;<br>
            ${this.t}${this.t}${this.t}font-style: italic;<br>
            ${this.t}${this.t}${this.t}margin: 15px 0 15px;<br>
            ${this.t}${this.t}${this.t}text-align: center;<br>
            ${this.t}${this.t}${this.t}text-shadow: 0px 2px 2px rgba(255, 255, 255, 0.4);<br>
            ${this.t}${this.t}${this.t}transition: all 0.3s ease;<br>
            ${this.t}${this.t}}\`,<br>
            ${this.t}${this.t}\`:hover{<br>
            ${this.t}${this.t}${this.t}text-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3);<br>
            ${this.t}${this.t}}\`<br>
            ${this.t}], 'h1')`,
      `=> ProxifyJS is based on ECMAScript Harmony Proxy. Please, read about 
            <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy" target="_blank">Proxy</a> 
            for base knowledge regarding the mechanics behind ProxifyJS.`
    ]
  }
  html (el, ...args) {
    const [title, code, note] = args
    return el.$appendChildren([
      __('h1')
        .$setInnerHTML(`<a href="https://github.com/Weedshaker/ProxifyJS" target="_blank">${title}</a>`)
        .$css([
          `{
                        /* Permalink - use to edit and share this gradient: http://colorzilla.com/gradient-editor/#000125+0,00f7ff+100&0.65+0,0+100 */
                        background: -moz-linear-gradient(top, rgba(0,1,37,0.65) 0%, rgba(0,247,255,0) 100%); /* FF3.6-15 */
                        background: -webkit-linear-gradient(top, rgba(0,1,37,0.65) 0%,rgba(0,247,255,0) 100%); /* Chrome10-25,Safari5.1-6 */
                        background: linear-gradient(to bottom, rgba(0,1,37,0.65) 0%,rgba(0,247,255,0) 100%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
                        filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#a6000125', endColorstr='#0000f7ff',GradientType=0 ); /* IE6-9 */
                        -webkit-text-fill-color: transparent;
                        -webkit-background-clip: text;
                        font-size: 77px;
                        font-style: italic;
                        margin: 15px 0 15px;
                        text-align: center;
                        text-shadow: 0px 2px 2px rgba(255, 255, 255, 0.4);
                        transition: all 0.3s ease;
                    }`,
          `:hover{
                        text-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3);
                    }`,
          ` a{
                        text-decoration: none;
                    }`
        ], 'h1'),
      __('div')
        .$setInnerHTML(code)
        .$css([
          `{
                        background-color: DarkSlateGray;
                        border: solid 5px white;
                        color: white;
                        font-family: Arial;
                        font-size: 14px;
                        margin: 15px 30px;
                        overflow: auto;
                        padding: 20px;
                        transition: opacity 0.5s ease;
                        white-space: nowrap;
                    }`,
          ` span{
                        color: lightgreen;
                    }`
        ], 'code'),
      __('p')
        .$setInnerHTML(note)
        .$css(
          `{
                        color: darkgrey;
                        font-size: 15px;
                        margin: 5px 20px;
                        text-shadow: 0px 2px 2px rgba(170, 222, 237, 0.5);
                    }`, 'p'
        )
        .$setStyle('font-size: 12px; text-align: center;')
        .$getChildren((destination, prop, value) => {
          const aTag = value[0]
          aTag.$css(
            `{
                            color: darkblue;
                            text-decoration: none;
                        }`, 'a'
          )
        }),
      __('hr')
        .$css(
          `{
                        background-image: linear-gradient(to right, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0));
                        border: 0;
                        height: 1px;
                        margin: 10px 0;
                    }`, 'hr'
        )
    ])
  }
}
