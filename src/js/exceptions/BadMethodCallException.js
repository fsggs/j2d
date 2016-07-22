/**
 * j2D (JavaScript 2D Engine)
 *
 * @authors DeVinterX, Skaner(j2Ds)
 * @license BSD
 * @version 0.2.0-dev
 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('exceptions/BadMethodCallException', ['exceptions/Exception'], factory);
    } else if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = factory(require('exceptions/Exception'));
    } else {
        factory(root.j2d.exceptions.Exception);
    }
}(typeof window !== 'undefined' ? window : global, function (Exception) {
    "use strict";

    /**
     * BadMethodCallException
     * Create custom exception with message
     * 
     * @class BadMethodCallException
     * @exports module:exceptions/BadMethodCallException
     *
     * @constructor
     * @extends exceptions/Exception
     * @param {string} message
     * @property {string} message
     */
    var BadMethodCallException = function (message) {
        Exception.call(this, message);

        /**
         * Convert exception to String
         * @returns {string}
         */
        this.toString = function () {
            return this.message;
        }
    };

    BadMethodCallException.prototype = Object.create(Exception.prototype);
    BadMethodCallException.prototype.constructor = BadMethodCallException;

    if (typeof module === 'object' && typeof module.exports === 'object') module.exports.BadMethodCallException = BadMethodCallException;
    if (global.j2d !== undefined) global.j2d.exceptions.BadMethodCallException = BadMethodCallException;
    return BadMethodCallException;
}));
