import { Proxify } from '../../Handler/Proxify.js';
import { Join as JoinHelper } from '../../Helper/Data/Join.js';

// !!!requires Classes->Helper.Proxify.js->convertTo!!!
export const Join = (Root = Proxify()) => class Join extends Root {
    // !!!Don't overwrite this two. Required at Proxify.js
    constructor(proxyRef, targetRef) {
        super(proxyRef, targetRef);

        // !!!Adds to the namespace!!!***********************************
        this.JoinHelper = new JoinHelper();
        
        // Traps for get*************************************************
        const getTrapJoin = (target, prop, receiver) => {
            if (prop !== '$join') return false;
            return (destination, key, localKey = 'all', func = null) => {
                if (!this.JoinHelper.joinMap) this.JoinHelper.joinMap = new Map();
                this.JoinHelper.joinMap.get(localKey) ? this.JoinHelper.joinMap.get(localKey).push([destination, key, func]) : this.JoinHelper.joinMap.set(localKey, [[destination, key, func]]);
                const result = func ? func(receiver[localKey] || receiver) : this.convertTo(this.targetRef, receiver[localKey]) || receiver;
                if (key in destination) destination[key] = result;
                return receiver;
            };
        }
        const getTrapDisjoin = (target, prop, receiver) => {
            if (prop !== '$disjoin') return false;
            return (destination, key, localKey = 'all') => {
                let joinArr = this.JoinHelper.joinMap.get(localKey);
                if (joinArr) {
                    this.JoinHelper.joinMap.set(localKey, (joinArr = joinArr.filter(e => e[1] !== key || this.convertTo(this.targetRef, e[0]) !== this.convertTo(this.targetRef, destination))));
                    if (joinArr.length === 0) this.JoinHelper.joinMap.delete(localKey);
                    if (!Array.from(this.JoinHelper.joinMap.entries()).length) this.JoinHelper.joinMap = null;
                }
                return receiver;
            };
        }

        this.trap_get_none = this.trap_get_none.concat([getTrapJoin, getTrapDisjoin]);
    }
    // Handler Class ext*********************************************
    set(target, prop, value, receiver) {
        if (this.JoinHelper.joinMap) {
            const joinArr = this.JoinHelper.joinMap.get(prop) || this.JoinHelper.joinMap.get('all');
            if (joinArr) joinArr.forEach(e => {
                const result = e[2] ? e[2](value) : this.convertTo(this.targetRef, value);
                if (e[1] in e[0]) e[0][e[1]] = result;
            });
        }
        return super.set(...arguments);
    }
    ownKeys(target) {
        // get possible keys
        return super.ownKeys(...arguments).concat(['$join', '$disjoin']);
    }
}