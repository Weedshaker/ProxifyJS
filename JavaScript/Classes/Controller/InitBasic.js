import { Proxify } from '../Handler/Proxify.js'
// Traps
import { Chain } from '../Traps/Misc/Chain.js'
import { WebWorkers } from '../Traps/Misc/WebWorkers.js'
import { LocalStorage } from '../Traps/Data/LocalStorage.js'
import { Subscribe } from '../Traps/Data/Subscribe.js'
import { Css } from '../Traps/Dom/Css.js'
import { Html } from '../Traps/Dom/Html.js'
import { Events } from '../Traps/Dom/Events.js'

// Exports for Helper.js*************************************************
// Handlers: Master and Proxify are required by most Traps, if possible keep them as is Proxify() at the root
export class InitBasic extends Events(Html(Css(Subscribe(LocalStorage(WebWorkers(Chain(Proxify()))))))) { }
