/**
 * J2D (jQuery Canvas Graphic Engine plugin)
 *
 * @authors DeVinterX, Skaner(j2Ds)
 * @license BSD
 * @version 0.2.0-dev
 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('nodes/CameraNode', ['jquery', 'nodes/BaseNode'], factory);
    } else if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = factory(require('jquery'), require('nodes/BaseNode'));
    } else {
        factory(root.jQuery, root.BaseNode);
    }
}(typeof window !== 'undefined' ? window : global, function ($, BaseNode) {
    "use strict";

    /**
     * @param {BaseNode.defaults|CameraNode.defaults|Object} [data]
     * @constructor
     * @property {BaseNode.defaults|CameraNode.defaults} data
     */
    var CameraNode = function (data) {
        BaseNode.call(this, $.extend(true, {}, CameraNode.defaults, data));
    };

    CameraNode.prototype = Object.create(BaseNode.prototype);
    CameraNode.prototype.constructor = CameraNode;

    CameraNode.defaults = {
        type: 'CameraNode'
    };

    /**
     * @param {{x: number, y: number, offsetX: number, offsetY: number}} screen
     * @param {Function|callback} calculate
     * @returns {{offset: {x: number, y: number}, size: {x: number, y: number}, scale: number, angle: number}}
     */
    CameraNode.prototype.getCameraViewport = function (screen, calculate) {
        return calculate(screen, {
            offset: this.data.position,
            size: this.data.size,
            angle: this.data.angle,
            scale: this.data.scale
        });
    };

    /* ------------------------------ Render ------------------------------ */

    /**
     * @override
     *
     * @param {CanvasRenderingContext2D} context
     * @param {{offset: {x: number, y: number}, size: {x: number, y: number}, scale: number, angle: number}} viewport
     * @param {CollectionNode} collection
     * @param {object} data
     * @returns {CameraNode}
     */
    CameraNode.prototype.render = function (context, viewport, collection, data) {
        return this;
    };

    if (global.exports !== undefined) global.exports.CameraNode = CameraNode;
    if (global.J2D !== undefined) global.CameraNode = CameraNode;
    return CameraNode;
}));
