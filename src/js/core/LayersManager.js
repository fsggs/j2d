/**
 * J2D (jQuery Canvas Graphic Engine plugin)
 *
 * @authors DeVinterX, Skaner(j2Ds)
 * @license BSD
 * @version 0.2.0-dev
 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('core/LayersManager', [], factory);
    } else if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = factory();
    } else {
        factory();
    }
}(typeof window !== 'undefined' ? window : global, function () {
    "use strict";

    var LayersManager = function (j2d) {
        this.j2d = j2d;
        this.list = {};
    };

    if (global.J2D !== undefined) global.LayersManager = LayersManager;
    return LayersManager;
}));