/**
 * J2D (jQuery Canvas Graphic Engine plugin)
 *
 * @authors DeVinterX, Skaner(j2Ds)
 * @license BSD
 * @version 0.2.0-dev
 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('exceptions/InvalidArgumentException', ['exceptions/Exception'], factory);
    } else if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = factory(require('exceptions/Exception'));
    } else {
        factory(root.Exception);
    }
}(typeof window !== 'undefined' ? window : global, function (Exception) {
    "use strict";

    /**
     * InvalidArgumentException
     * Create custom exception with message
     *
     * @param {string} message
     * @property {string} message
     */
    var InvalidArgumentException = function (message) {
        Exception.call(this, message);

        /**
         * Convert exception to String
         * @returns {string}
         */
        this.toString = function () {
            return this.message;
        }
    };

    InvalidArgumentException.prototype = Object.create(Exception.prototype);
    InvalidArgumentException.prototype.constructor = InvalidArgumentException;

    if (typeof module === 'object' && typeof module.exports === 'object') module.exports.InvalidArgumentException = InvalidArgumentException;
    if (typeof define !== 'function' || !define.amd) global.InvalidArgumentException = InvalidArgumentException;
    return InvalidArgumentException;
}));
