/**
 * J2D (jQuery Canvas Graphic Engine plugin)
 *
 * @authors DeVinterX, Skaner(j2Ds)
 * @license BSD
 * @version 0.2.0-dev
 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('exceptions/RangeException', ['exceptions/Exception'], factory);
    } else if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = factory(require('exceptions/Exception'));
    } else {
        factory(root.j2d.exceptions.Exception);
    }
}(typeof window !== 'undefined' ? window : global, function (Exception) {
    "use strict";

    /**
     * RangeException
     * Create custom exception with message
     *
     * @param {string} message
     * @property {string} message
     */
    var RangeException = function (message) {
        Exception.call(this, message);

        /**
         * Convert exception to String
         * @returns {string}
         */
        this.toString = function () {
            return this.message;
        }
    };

    RangeException.prototype = Object.create(Exception.prototype);
    RangeException.prototype.constructor = RangeException;

    if (typeof module === 'object' && typeof module.exports === 'object') module.exports.RangeException = RangeException;
    if (global.j2d === undefined) global.j2d.exceptions.RangeException = RangeException;
    return RangeException;
}));
