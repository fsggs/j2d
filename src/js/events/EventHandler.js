/**
 * j2D (JavaScript 2D Engine)
 *
 * @authors DeVinterX, Skaner(j2Ds)
 * @license BSD
 * @version 1.0.0-dev
 */

if (global === undefined) var global = window || this;
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('events/EventHandler', ['api/Handler'], factory);
    } else if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = factory(require('api/Handler'));
    } else {
        factory(root.j2d.api.Handler);
    }
}(typeof window !== 'undefined' ? window : global, function (Handler) {
    "use strict";

    /**
     * EventHandler
     * @constructor
     */
    var EventHandler = function () {
        var events;
        var once;

        /**
         * @param {string} eventName
         * @param {function} callback
         */
        this.on = function (eventName, callback) {
            if (events[eventName] !== undefined) {
                var stack = events[eventName];
                if (stack.indexOf(callback) === -1) {
                    stack.push(callback);
                }
            } else {
                events[eventName] = [];
                events[eventName].push(callback)
            }
            return this;
        };

        /**
         * @param {string} eventName
         * @param {function} callback
         */
        this.once = function (eventName, callback) {
            if (once[eventName] !== undefined) {
                var stack = once[eventName];
                if (stack.indexOf(callback) === -1) {
                    stack.push(callback);
                }
            } else {
                once[eventName] = [];
                once[eventName].push(callback)
            }
            return this;
        };

        /**
         * @param {string} eventName
         * @param {function} callback
         */
        this.off = function (eventName, callback) {
            if (once[eventName] !== undefined) {
                var stack = events[eventName];
                if (stack.indexOf(callback) !== -1) {
                    stack.splice(stack.indexOf(callback));
                }
            }
            return this;
        };

        /**
         * @param {string} eventName
         * @param {Object} [data]
         */
        this.trigger = function (eventName, data) {
            var stack, i, result;

            if (once[eventName] !== undefined) {
                stack = once[eventName];
                for (i = 0; i < stack.length; i++) {
                    result = stack[i].call(stack[i], data);
                    if (typeof result === 'boolean' && !result) return this;
                }
                this.flush(eventName);
            }

            if (events[eventName] !== undefined) {
                stack = events[eventName];
                for (i = 0; i < stack.length; i++) {
                    result = stack[i].call(stack[i], data);
                    if (typeof result === 'boolean' && !result) return this;
                }
            }
            return this;
        };

        /**
         * @param {string} [eventName]
         */
        this.flush = function (eventName) {
            if (eventName !== undefined) {
                if (events[eventName] !== undefined) {
                    events[eventName] = [];
                }
                if (once[eventName] !== undefined) {
                    once[eventName] = [];
                }
            } else {
                once = [];
                events = [];
            }
            return this;
        };

        this.flush();
        Handler.call(this);
    };
    EventHandler.prototype = Object.create(Handler.prototype);
    EventHandler.prototype.constructor = EventHandler;

    EventHandler.prototype.init = function (eventHandler) {
        Handler.prototype.init.call(this, eventHandler);
        return this;
    };
    EventHandler.prototype.enable = function () {
        Handler.prototype.enable.call(this);
        return this;
    };
    EventHandler.prototype.disable = function () {
        Handler.prototype.disable.call(this);
        return this;
    };
    EventHandler.prototype.toggle = function (status) {
        Handler.prototype.toggle.call(this, status);
        return this;
    };

    if (typeof module === 'object' && typeof module.exports === 'object') module.exports.EventHandler = EventHandler;
    if (global.j2d !== undefined) global.j2d.events.EventHandler = EventHandler;
    return EventHandler;
}));
