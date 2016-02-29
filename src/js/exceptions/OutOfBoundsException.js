/**
 * J2D (jQuery Canvas Graphic Engine plugin)
 *
 * @authors DeVinterX, Skaner(j2Ds)
 * @license BSD
 * @version 0.2.0-dev
 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('exceptions/OutOfBoundsException', ['exceptions/Exception'], factory);
    } else if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = factory(require('exceptions/Exception'));
    } else {
        factory(root.Exception);
    }
}(typeof window !== 'undefined' ? window : global, function (Exception) {
    "use strict";

    /**
     * OutOfBoundsException
     * Create custom exception with message
     *
     * @param {string} message
     */
    var OutOfBoundsException = function (message) {
        Error.call(this);
        this.message = message;

        /**
         * Convert exception to String
         * @returns {string|}
         */
        this.toString = function () {
            return this.message;
        }
    };

    OutOfBoundsException.prototype = Object.create(Exception.prototype);
    OutOfBoundsException.prototype.constructor = OutOfBoundsException;

    if (global.exports !== undefined)  global.exports.OutOfBoundsException = OutOfBoundsException;
    if (typeof define !== 'function' || !define.amd) global.OutOfBoundsException = OutOfBoundsException;
    return OutOfBoundsException;
}));
