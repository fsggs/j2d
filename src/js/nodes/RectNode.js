/**
 * j2D (JavaScript 2D Engine)
 *
 * @authors DeVinterX, Skaner(j2Ds)
 * @license BSD
 * @version 0.2.0-dev
 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('nodes/RectNode', ['utils/ObjectUtil', 'nodes/BaseNode', 'nodes/AnimatedNode', 'utils/MathUtil'], factory);
    } else if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = factory(
            require('utils/ObjectUtil'),
            require('nodes/BaseNode'),
            require('nodes/AnimatedNode'),
            require('utils/MathUtil'));
    } else {
        factory(root.j2d.utils.ObjectUtil, root.j2d.nodes.BaseNode, root.j2d.nodes.AnimatedNode, root.j2d.utils.MathUtil);
    }
}(typeof window !== 'undefined' ? window : global, function (ObjectUtil, BaseNode, AnimatedNode, MathUtil) {
    "use strict";

    /**
     * @class RectNode
     * @exports module:nodes/RectNode
     *
     * @constructor
     * @extends nodes/AnimatedNode
     * @param {BaseNode.defaults|AnimatedNode.defaults|RectNode.defaults|Object} [data]
     * @property {BaseNode.defaults|AnimatedNode.defaults|RectNode.defaults} data
     */
    var RectNode = function (data) {
        AnimatedNode.call(this, ObjectUtil.extend(true, {}, RectNode.defaults, data));
    };

    RectNode.prototype = Object.create(AnimatedNode.prototype);
    RectNode.prototype.constructor = RectNode;

    RectNode.defaults = {
        type: 'RectNode',
        color: '#000000'
    };

    /**
     * @returns {string}
     */
    RectNode.prototype.getColor = function () {
        return this.data.color;
    };

    /**
     * @param {string} color
     * @returns {RectNode}
     */
    RectNode.prototype.setColor = function (color) {
        this.data.color = color;
        return this;
    };


    /* ------------------------------ Draw ------------------------------ */

    /**
     * @param {CanvasRenderingContext2D} context
     * @param {{offset: {x: number, y: number}, size: {x: number, y: number}, scale: number, angle: number}} viewport
     * @param {CollectionNode} collection
     * @param {object} data
     * @returns {null}
     */
    RectNode.prototype.draw = function (context, viewport, collection, data) {
        if (this.data.visible && this.inViewport(viewport)) {
            //console.log(this.inViewport(viewport));
            if (this.data.opacity !== 1.0) {
                var tempOpacity = context.globalAlpha;
                context.globalAlpha = this.data.opacity;
            }

            if (this.data.angle || viewport.angle !== 0.0) {
                context.save();

                context.translate(
                    this.getPosition().x - viewport.offset.x,
                    this.getPosition().y - viewport.offset.y);
                context.rotate(MathUtil.degree2Radian(this.data.angle + viewport.angle));
                context.translate(
                    -(this.getPosition().x - viewport.offset.x),
                    -(this.getPosition().y - viewport.offset.y));
            }

            context.fillStyle = this.data.color;
            context.lineWidth = 0;

            context.fillRect(
                this.data.position.x - viewport.offset.x,
                this.data.position.y - viewport.offset.y,
                this.data.size.x * this.data.scale * viewport.scale,
                this.data.size.y * this.data.scale * viewport.scale
            );

            if (this.data.angle || viewport.angle !== 0.0) {
                context.restore();
            }

            if (this.data.opacity !== 1.0) {
                context.globalAlpha = tempOpacity;
            }
        }
        return null;
    };

    /* ------------------------------ Render ------------------------------ */

    /**
     * @override
     *
     * @param {CanvasRenderingContext2D} context
     * @param {{offset: {x: number, y: number}, size: {x: number, y: number}, scale: number, angle: number}} viewport
     * @param {CollectionNode} collection
     * @param {object} data
     * @returns {RectNode}
     */
    RectNode.prototype.render = function (context, viewport, collection, data) {
        this.draw(context, viewport, collection, data);
        return this;
    };

    if (typeof module === 'object' && typeof module.exports === 'object') module.exports.RectNode = RectNode;
    if (global.j2d !== undefined) global.j2d.nodes.RectNode = RectNode;
    return RectNode;
}));
