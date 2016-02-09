/**
 * J2D (jQuery Canvas Graphic Engine plugin)
 *
 * @authors DeVinterX, Skaner(j2Ds)
 * @license BSD
 * @version 0.2.0-dev
 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('utils/Vector2d', [], factory);
    } else if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = factory();
    } else {
        factory();
    }
}(typeof window !== 'undefined' ? window : global, function () {
    "use strict";

    /**
     * @param {number} x
     * @param {number} y
     */
    var Vector2d = function (x, y) {
        this.x = x;
        this.y = y;
    };

    /**
     * @returns {number}
     */
    Vector2d.prototype.getX = function () {
        return this.x;
    };

    /**
     * @returns {number}
     */
    Vector2d.prototype.getY = function () {
        return this.y;
    };

    /**
     * @returns {Vector2d}
     */
    Vector2d.prototype.getVector = function () {
        return this;
    };

    /**
     * @returns {Array<number>}
     */
    Vector2d.prototype.toArray = function () {
        return [this.x, this.y];
    };

    /**
     * @param {Array<number>} array
     * @returns {Vector2d}
     */
    Vector2d.prototype.fromArray = function (array) {
        this.x = array[0];
        this.y = array[1];

        return this;
    };

    /**
     * @returns {string}
     */
    Vector2d.prototype.toString = function () {
        return "(" + this.x + "," + this.y + ")";
    };

    if (global.J2D === undefined) global.Vector2d = Vector2d;

    return Vector2d
}));
