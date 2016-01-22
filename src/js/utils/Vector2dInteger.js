/**
 * J2D (jQuery Canvas Graphic Engine plugin)
 *
 * @authors DeVinterX, Skaner(j2Ds)
 * @license BSD
 * @version 0.2.0-dev
 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('utils/Vector2dInteger', ['utils/Vector2d'], factory);
    } else if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = factory(require('utils/Vector2d'));
    } else {
        factory(root.Vector2d);
    }
}(typeof window !== 'undefined' ? window : global, function (Vector2d) {
    "use strict";

    /**
     * @param {number} x
     * @param {number} y
     */
    var Vector2dInteger = function (x, y) {
        Vector2d.call(this, x >> 0, y >> 0);
    };

    Vector2dInteger.prototype = Object.create(Vector2d.prototype);
    Vector2dInteger.prototype.constructor = Vector2dInteger;

    /**
     * @param {Array<number>} array
     * @returns {Vector2d|Vector2dInteger}
     */
    Vector2dInteger.prototype.fromArray = function (array) {
        this.x = array[0] >> 0;
        this.y = array[1] >> 0;

        return this;
    };

    if (global.J2D === undefined) global.Vector2dInteger = Vector2dInteger;

    return Vector2dInteger;
}));
