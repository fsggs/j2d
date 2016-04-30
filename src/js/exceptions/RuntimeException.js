/**
 * J2D (jQuery Canvas Graphic Engine plugin)
 *
 * @authors DeVinterX, Skaner(j2Ds)
 * @license BSD
 * @version 0.2.0-dev
 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('exceptions/RuntimeException', ['exceptions/Exception'], factory);
    } else if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = factory(require('exceptions/Exception'));
    } else {
        factory(root.j2d.exceptions.Exception);
    }
}(typeof window !== 'undefined' ? window : global, function (Exception) {
    "use strict";

    /**
     * RuntimeException
     * Create custom exception with message
     *
     * @class RuntimeException
     * @exports module:exceptions/RuntimeException
     *
     * @constructor
     * @extends exceptions/Exception
     * @param {string} message
     * @property {string} message
     */
    var RuntimeException = function (message) {
        Exception.call(this, message);

        /**
         * Convert exception to String
         * @returns {string}
         */
        this.toString = function () {
            return this.message;
        }
    };

    RuntimeException.prototype = Object.create(Exception.prototype);
    RuntimeException.prototype.constructor = RuntimeException;

    if (typeof module === 'object' && typeof module.exports === 'object') module.exports.RuntimeException = RuntimeException;
    if (global.j2d === undefined) global.j2d.exceptions.RuntimeException = RuntimeException;
    return RuntimeException;
}));
