/**
 * J2D (jQuery Canvas Graphic Engine plugin)
 *
 * @authors DeVinterX, Skaner(j2Ds)
 * @license BSD
 * @version 0.2.0-dev
 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('utils/UUID', [], factory);
    } else if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = factory();
    } else {
        factory();
    }
}(typeof window !== 'undefined' ? window : global, function () {
    "use strict";

    /**
     * Class for generate uuid
     * 
     * @class UUID
     * @exports module:utils/UUID
     * 
     * @constructor
     */
    var UUID = function () {

    };

    UUID.generate = function () {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    };

    if (typeof module === 'object' && typeof module.exports === 'object') module.exports.UUID = UUID;
    if (global.j2d === undefined) global.j2d.utils.UUID = UUID;
    return UUID;
}));
