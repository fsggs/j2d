/**
 * @class Events
 * @exports module:utils/Events
 *
 * @constructor
 */
export default class Events {
    events = [];
    onces = [];

    constructor() {
        this.flush();
    }

    /**
     * @param {string} [eventName]
     */
    flush(eventName) {
        if (eventName !== undefined) {
            if (this.events[eventName] !== undefined) {
                this.events[eventName] = [];
            }
            if (this.onces[eventName] !== undefined) {
                this.onces[eventName] = [];
            }
        } else {
            this.onces = [];
            this.events = [];
        }
    }


    /**
     * @param {string} eventName
     * @param {function} callback
     */
    on(eventName, callback) {
        if (this.events[eventName] !== undefined) {
            var stack = this.events[eventName];
            if (stack.indexOf(callback) === -1) {
                stack.push(callback);
            }
        } else {
            this.events[eventName] = [];
            this.events[eventName].push(callback)
        }
    }

    /**
     * @param {string} eventName
     * @param {function} callback
     */
    once(eventName, callback) {
        if (this.onces[eventName] !== undefined) {
            var stack = this.onces[eventName];
            if (stack.indexOf(callback) === -1) {
                stack.push(callback);
            }
        } else {
            this.onces[eventName] = [];
            this.onces[eventName].push(callback)
        }
    }

    /**
     * @param {string} eventName
     * @param {function} callback
     */
    off(eventName, callback) {
        if (this.onces[eventName] !== undefined) {
            var stack = this.events[eventName];
            if (stack.indexOf(callback) !== -1) {
                stack.splice(stack.indexOf(callback));
            }
        }
    }

    /**
     * @param {string} eventName
     * @param {Object} [data]
     */
    trigger(eventName, data) {
        var stack, i;

        if (this.events[eventName] !== undefined) {
            stack = this.events[eventName];
            for (i = 0; i < stack.length; i++) {
                stack[i].call(stack[i], data);
            }
        }

        if (this.onces[eventName] !== undefined) {
            stack = this.onces[eventName];
            for (i = 0; i < stack.length; i++) {
                stack[i].call(stack[i], data);
            }
            this.flush(eventName);
        }
    };
}
