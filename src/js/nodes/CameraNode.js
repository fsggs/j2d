/**
 * J2D (jQuery Canvas Graphic Engine plugin)
 *
 * @authors DeVinterX, Skaner(j2Ds)
 * @license BSD
 * @version 0.2.0-dev
 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('nodes/CameraNode', ['nodes/BaseNode'], factory);
    } else if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = factory(require('nodes/BaseNode'));
    } else {
        factory(root.BaseNode);
    }
}(typeof window !== 'undefined' ? window : global, function (BaseNode) {
    "use strict";

    /**
     * @constructor
     */
    var CameraNode = function () {
    };

    CameraNode.prototype = Object.create(BaseNode.prototype);
    CameraNode.prototype.constructor = CameraNode;

    /**
     * @param {{x: number, y: number}} screen
     * @param {Function|callback} calculate
     * @returns {{offset: {x: number, y: number}, size: {x: number, y: number}, scale: number}|null}
     */
    CameraNode.prototype.getCameraViewport = function (screen, calculate) {
        return null;
    };

    if (global.J2D !== undefined) global.CameraNode = CameraNode;
    return CameraNode;
}));
