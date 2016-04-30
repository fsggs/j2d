/**
 * J2D (jQuery Canvas Graphic Engine plugin)
 *
 * @authors DeVinterX, Skaner(j2Ds)
 * @license BSD
 * @version 0.2.0-dev
 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('nodes/CameraNode', ['jquery', 'nodes/BaseNode', 'nodes/AnimatedNode'], factory);
    } else if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = factory(require('jquery'), require('nodes/BaseNode'), require('nodes/AnimatedNode'));
    } else {
        factory(root.jQuery, root.j2d.nodes.BaseNode, root.j2d.nodes.AnimatedNode);
    }
}(typeof window !== 'undefined' ? window : global, function ($, BaseNode, AnimatedNode) {
    "use strict";

    /**
     * @class CameraNode
     * @exports module:nodes/CameraNode
     *
     * @constructor
     * @extends nodes/AnimatedNode
     * @param {BaseNode.defaults|AnimatedNode.defaults|CameraNode.defaults|Object} [data]
     * @property {BaseNode.defaults|AnimatedNode.defaults|CameraNode.defaults} data
     */
    var CameraNode = function (data) {
        AnimatedNode.call(this, $.extend(true, {}, CameraNode.defaults, data));
    };

    CameraNode.prototype = Object.create(AnimatedNode.prototype);
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

    if (typeof module === 'object' && typeof module.exports === 'object') module.exports.CameraNode = CameraNode;
    if (global.j2d === undefined) global.j2d.nodes.CameraNode = CameraNode;
    return CameraNode;
}));
