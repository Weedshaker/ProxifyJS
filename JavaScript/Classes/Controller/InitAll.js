import { Proxify } from '../Handler/Proxify.js'
// Traps
import { Chain } from '../Traps/Misc/Chain.js'
import { WebWorkers } from '../Traps/Misc/WebWorkers.js'
import { LocalStorage } from '../Traps/Data/LocalStorage.js'
import { Subscribe } from '../Traps/Data/Subscribe.js'
import { Css } from '../Traps/Dom/Css.js'
import { Html } from '../Traps/Dom/Html.js'
import { Events } from '../Traps/Dom/Events.js'
// Debugging Traps
import { Types } from '../Traps/Misc/Types.js'
import { Debug } from '../Traps/Misc/Debug.js'
import { TryCatch } from '../Traps/Misc/TryCatch.js'

// Exports for Helper.js*************************************************
// Handlers: Proxify and Proxify are required by most Traps, if possible keep them as is Proxify(Proxify()) at the root
export class InitAll extends TryCatch(Debug(Types(Events(Html(Css(Subscribe(LocalStorage(WebWorkers(Chain(Proxify())))))))))) { }
