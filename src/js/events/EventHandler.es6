import EngineComponent from "../api/EngineComponent";

/**
 * EventHandler
 * @constructor
 */
export default class EventHandler extends EngineComponent {
    _events = [];
    _onces = [];

    /**
     * @param {string} eventName
     * @param {function} callback
     */
    on(eventName, callback) {
        if (this._events[eventName] !== undefined) {
            let stack = this._events[eventName];
            if (stack.indexOf(callback) === -1) {
                stack.push(callback);
            }
        } else {
            this._events[eventName] = [];
            this._events[eventName].push(callback)
        }
        return this;
    }

    /**
     * @param {string} eventName
     * @param {function} callback
     */
    once(eventName, callback) {
        if (this._onces[eventName] !== undefined) {
            let stack = this._onces[eventName];
            if (stack.indexOf(callback) === -1) {
                stack.push(callback);
            }
        } else {
            this._onces[eventName] = [];
            this._onces[eventName].push(callback)
        }
        return this;
    }

    /**
     * @param {string} eventName
     * @param {function} callback
     */
    off(eventName, callback) {
        if (this._events[eventName] !== undefined) {
            let stack = this._events[eventName];
            if (stack.indexOf(callback) !== -1) {
                stack.splice(stack.indexOf(callback));
            }
        }
        if (this._onces[eventName] !== undefined) {
            let stack = this._onces[eventName];
            if (stack.indexOf(callback) !== -1) {
                stack.splice(stack.indexOf(callback));
            }
        }
        return this;
    }

    /**
     * @param {string} eventName
     * @param {Object} [data]
     */
    trigger(eventName, data) {
        let stack, i, result;

        if (this._onces[eventName] !== undefined) {
            stack = this._onces[eventName];
            for (i = 0; i < stack.length; i++) {
                result = stack[i].call(stack[i], data);
                if (typeof result === 'boolean' && !result) break;
            }
            this._onces[eventName] = [];
            if (typeof result === 'boolean' && !result) return this;
        }

        if (this._events[eventName] !== undefined) {
            stack = this._events[eventName];
            for (i = 0; i < stack.length; i++) {
                result = stack[i].call(stack[i], data);
                if (typeof result === 'boolean' && !result) break;
            }
        }
        return this;
    }

    /**
     * @param {string} [eventName]
     */
    flush(eventName) {
        if (eventName !== undefined) {
            if (this._events[eventName] !== undefined) {
                this._events[eventName] = [];
            }
            if (this._onces[eventName] !== undefined) {
                this._onces[eventName] = [];
            }
        } else {
            this._onces = [];
            this._events = [];
        }
        return this;
    }
}
