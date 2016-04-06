/**
 * J2D (jQuery Canvas Graphic Engine plugin)
 *
 * @authors DeVinterX, Skaner(j2Ds)
 * @license BSD
 * @version 0.2.0-dev
 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('utils/Events', [], factory);
    } else if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = factory();
    } else {
        factory();
    }
}(typeof window !== 'undefined' ? window : global, function () {
    "use strict";

    /**
     * @constructor
     */
    var Events = function () {
        var events;
        var once;

        /**
         * @param {string} [eventName]
         */
        this.flush = function (eventName) {
            if (eventName !== undefined) {
                if (events[eventName] !== undefined) {
                    events[eventName] = new Array();
                }
                if (once[eventName] !== undefined) {
                    once[eventName] = new Array();
                }
            } else {
                once = new Array();
                events = new Array();
            }
        };

        this.flush();

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
                events[eventName] = new Array();
                events[eventName].push(callback)
            }
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
                once[eventName] = new Array();
                once[eventName].push(callback)
            }
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
        };

        /**
         * @param {string} eventName
         * @param {Object} [data]
         */
        this.trigger = function (eventName, data) {
            var stack, i;

            if (events[eventName] !== undefined) {
                stack = events[eventName];
                for (i = 0; i < stack.length; i++) {
                    stack[i].call(stack[i], data);
                }
            }

            if (once[eventName] !== undefined) {
                stack = once[eventName];
                for (i = 0; i < stack.length; i++) {
                    stack[i].call(stack[i], data);
                }
                this.flush(eventName);
            }
        };
    };

    if (typeof module === 'object' && typeof module.exports === 'object') module.exports.Events = Events;
    if (global.J2D === undefined) global.Events = Events;
    return Events;
}));
