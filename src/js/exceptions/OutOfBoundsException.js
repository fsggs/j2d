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
        factory(root.j2d.exceptions.Exception);
    }
}(typeof window !== 'undefined' ? window : global, function (Exception) {
    "use strict";

    /**
     * OutOfBoundsException
     * Create custom exception with message
     *
     * @class OutOfBoundsException
     * @exports module:exceptions/OutOfBoundsException
     *
     * @constructor
     * @extends exceptions/Exception
     * @param {string} message
     * @property {string} message
     */
    var OutOfBoundsException = function (message) {
        Exception.call(this, message);

        /**
         * Convert exception to String
         * @returns {string}
         */
        this.toString = function () {
            return this.message;
        }
    };

    OutOfBoundsException.prototype = Object.create(Exception.prototype);
    OutOfBoundsException.prototype.constructor = OutOfBoundsException;

    if (typeof module === 'object' && typeof module.exports === 'object') module.exports.OutOfBoundsException = OutOfBoundsException;
    if (global.j2d === undefined) global.j2d.exceptions.OutOfBoundsException = OutOfBoundsException;
    return OutOfBoundsException;
}));
