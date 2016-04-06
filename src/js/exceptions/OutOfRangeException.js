/**
 * J2D (jQuery Canvas Graphic Engine plugin)
 *
 * @authors DeVinterX, Skaner(j2Ds)
 * @license BSD
 * @version 0.2.0-dev
 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('exceptions/OutOfRangeException', ['exceptions/Exception'], factory);
    } else if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = factory(require('exceptions/Exception'));
    } else {
        factory(root.Exception);
    }
}(typeof window !== 'undefined' ? window : global, function (Exception) {
    "use strict";

    /**
     * OutOfRangeException
     * Create custom exception with message
     *
     * @param {string} message
     * @property {string} message
     */
    var OutOfRangeException = function (message) {
        Exception.call(this, message);

        /**
         * Convert exception to String
         * @returns {string}
         */
        this.toString = function () {
            return this.message;
        }
    };

    OutOfRangeException.prototype = Object.create(Exception.prototype);
    OutOfRangeException.prototype.constructor = OutOfRangeException;

    if (typeof module === 'object' && typeof module.exports === 'object') module.exports.OutOfRangeException = OutOfRangeException;
    if (typeof define !== 'function' || !define.amd) global.OutOfRangeException = OutOfRangeException;
    return OutOfRangeException;
}));
