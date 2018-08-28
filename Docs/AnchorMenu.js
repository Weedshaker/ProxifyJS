/* global __ */
import MasterDocs from './MasterDocs.js'

export default class AnchorMenu extends MasterDocs {
  constructor (body) {
    super()
    this.lastScrollPos = 0
    this.ticking = false
    this.timeout = null
    return this.html(__('div'), body)
  }
  html (el, body) {
    return el.$func((receiver) => {
      window.addEventListener('scroll', (e) => {
        if (!this.ticking) {
          this.ticking = true
          clearTimeout(this.timeout)
          window.requestAnimationFrame(() => {
            this.timeout = setTimeout(() => {
              this.lastScrollPos > window.scrollY ? receiver.$setStyle('top: 0;') : receiver.$setStyle(`top: -${receiver.offsetHeight}px;`)
              this.lastScrollPos = window.scrollY
              this.ticking = false
            }, 500)
          })
        }
      })
    })
      .$css([
        `{
                background-color: rgba(248, 248, 255, 0.8);
                margin-top: -10px;
                position: -webkit-sticky;
                position: sticky;
                text-align: center;
                transition: top 0.6s ease;
            }`,
        ` ul{
                margin: 0;
                padding: 16px 0 6px;
            }`,
        ` ul li{
                display: inline-block;
                list-style: none;
            }`,
        ` ul li span{
                padding: 0 10px;
            }`,
        ` ul li a{
                color: darkblue;
                text-decoration: none;
                transition: color 0.3s ease;
                white-space: nowrap;
            }`,
        ` ul li a:hover{
                color: pink;
                text-decoration: underline;
            }`
      ], 'anchorMenu')
      .appendChild(__('ul'))
      .$appendChildren(Array.from(body.getElementsByTagName('h2')).map((el, i, arr) => {
        el.innerHTML = `<a name='${el.innerText}'></a>${el.innerHTML}`
        return __('li').$setInnerHTML(`<a href='#${el.innerText}'>${el.innerText.replace(' ', '&nbsp;')}</a>${i !== arr.length - 1 ? '<span>|</span>' : ''}`)
      }))
      .parentElement
      .appendChild(__('hr'))
      .$css(false, 'hr')
      .parentElement
  }
}
