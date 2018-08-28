import { Proxify } from '../Handler/Proxify.js'

// Exports for Helper.js*************************************************
// Gets injected to Proxify.js
// Proxify references, which will be exposed to Target (simple reference on object at Helper.js) && Proxy (triggered by Proxify.js->__getTrapRaw)
// !!!Don't overwrite this two, though you could use this to hide the hooks
// Terminology vs MDN: Raw = Target
// assuming that __raw__ is saying more to the audience than target (especially since __proxy__ and __target__ seem to be easily recognizable)
export const proxyRef = '__proxy__'
export const targetRef = '__raw__'
// Handlers: Proxify is required by most Traps, if possible keep it as is Proxify() at the root, else take the Master
export class Init extends Proxify() {}
