import Handler from "api/Handler";
import EngineComponent from "../api/EngineComponent";

/**
 * EventHandler
 * @constructor
 */
export default class EventHandler extends EngineComponent {

    events = [];
    onces = [];

    constructor() {
        super();
        this.flush();
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
        return this;
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
        return this;
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
        return this;
    }

    /**
     * @param {string} eventName
     * @param {Object} [data]
     */
    trigger(eventName, data) {
        var stack, i, result;

        if (this.onces[eventName] !== undefined) {
            stack = this.onces[eventName];
            for (i = 0; i < stack.length; i++) {
                result = stack[i].call(stack[i], data);
                if (typeof result === 'boolean' && !result) return this;
            }
            this.flush(eventName);
        }

        if (this.events[eventName] !== undefined) {
            stack = this.events[eventName];
            for (i = 0; i < stack.length; i++) {
                result = stack[i].call(stack[i], data);
                if (typeof result === 'boolean' && !result) return this;
            }
        }
        return this;
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
        return this;
    }

    init(eventHandler) {
        super.init(eventHandler);
        return this;
    }

    enable() {
        super.enable();
        return this;
    }

    disable() {
        super.disable();
        return this;
    }

    toggle(status) {
        super.toggle(status);
        return this;
    }
}
