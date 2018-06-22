import { Proxify } from '../../Handler/Proxify.js';

export const TryCatch = (Root = Proxify()) => class TryCatch extends Root {
    // !!!Don't overwrite this two. Required at Proxify.js
    constructor(proxyRef, targetRef) {
        super(proxyRef, targetRef);
    }
    // Handler Class ext*********************************************
    getFunction(target, prop, receiver) {
        return (...args) => {
            try {
                return super.getFunction(target, prop, receiver)(...args);
            }
            catch (error) {
                console.error('Error:', {error, target, prop, receiver, args});
            }
        };
    }
}