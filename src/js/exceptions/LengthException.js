/**
 * J2D (jQuery Canvas Graphic Engine plugin)
 *
 * @authors DeVinterX, Skaner(j2Ds)
 * @license BSD
 * @version 0.2.0-dev
 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('exceptions/LengthException', ['exceptions/Exception'], factory);
    } else if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = factory(require('exceptions/Exception'));
    } else {
        factory(root.j2d.exceptions.Exception);
    }
}(typeof window !== 'undefined' ? window : global, function (Exception) {
    "use strict";

    /**
     * LengthException
     * Create custom exception with message
     *
     * @class LengthException
     * @exports module:exceptions/LengthException
     *
     * @constructor
     * @extends exceptions/Exception
     * @param {string} message
     * @property {string} message
     */
    var LengthException = function (message) {
        Exception.call(this, message);

        /**
         * Convert exception to String
         * @returns {string}
         */
        this.toString = function () {
            return this.message;
        }
    };

    LengthException.prototype = Object.create(Exception.prototype);
    LengthException.prototype.constructor = LengthException;

    if (typeof module === 'object' && typeof module.exports === 'object') module.exports.LengthException = LengthException;
    if (global.j2d === undefined) global.j2d.exceptions.LengthException = LengthException;
    return LengthException;
}));
