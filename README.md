<meta http-equiv='Content-Type' content='text/html; charset=utf-8' />
<p align="center">
  <img src="https://farm4.staticflickr.com/3917/14978448715_d060fe9949_k.jpg" width="400" height="200" alt="proxify">
  <h1 align="center">ProxifyJS</h1>
</p>
A pure ES6 api:any - handler library backed by ECMAScript Harmony Proxy. Proxifies any object and goes far beyond...

...Everything is getting more and more complex around web application development but don't worry, not this one. No bundler nor any dependencies, except of ES6 native <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy" target="_blank">Proxy</a>!

## Installation

```js
npm install Weedshaker/ProxifyJS
```

## Usage

```js
import { ProxifyHook } from './JavaScript/Classes/Helper/ProxifyHook.js'
import { InitBasic } from './JavaScript/Classes/Controller/InitBasic.js'

const __ = new ProxifyHook(InitBasic).get()

__(document.getElementsByTagName('body')[0]).$appendChildren(
    [
        __('h2')
            .$setInnerHTML('ProxifyJS')
            .$css(
            `{
                color: darkgrey;
                font-size: 44px;
                font-style: italic;
                margin: 25px 0 25px;
                text-align: center;
            }`, 'h2'),
        __('p')
            .$setInnerHTML('NOW!')
            .$css(
            `{
                color: darkgrey;
                font-size: 15px;
                margin: 5px 20px;
                text-shadow: 0px 2px 2px rgba(170, 222, 237, 0.5);
            }`, 'p'),
        __('hr')
            .$css(
            `{
                background-image: linear-gradient(to right, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0));
                border: 0;
                height: 1px;
                margin: 10px 0;
            }`, 'hr')
    ]
)
```

The short snippet above merely gives a glimpse on what ProxifyJS can do.

Easily, deal not only with Web APIs but any API. Here a few tags: Events, Html, Css, Subscribe, LocalStorage, WebWorkers, Method Chaining, Error Handling, Types, Debugging, ∞. All modular, lightweight and simple thanks to the power of Proxies.

- [Documentation, Examples & More Information](https://weedshaker.github.io/ProxifyJS/)
