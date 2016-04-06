/**
 * J2D (jQuery Canvas Graphic Engine plugin)
 *
 * @authors DeVinterX, Skaner(j2Ds)
 * @license BSD
 * @version 0.2.0-dev
 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('nodes/RectNode', ['jquery', 'nodes/BaseNode', 'utils/MathUtil'], factory);
    } else if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = factory(require('jquery'), require('nodes/BaseNode'), require('utils/MathUtil'));
    } else {
        factory(root.jQuery, root.BaseNode, root.MathUtil);
    }
}(typeof window !== 'undefined' ? window : global, function ($, BaseNode, MathUtil) {
    "use strict";

    /**
     * @param {BaseNode.defaults|RectNode.defaults|Object} [data]
     * @constructor
     * @property {BaseNode.defaults|RectNode.defaults} data
     */
    var RectNode = function (data) {
        BaseNode.call(this, $.extend(true, {}, RectNode.defaults, data));
    };

    RectNode.prototype = Object.create(BaseNode.prototype);
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
        //if (this.data.visible && this.isLookScene()) {
        if (this.data.visible && this.inViewport(viewport)) {
            console.log(this.inViewport(viewport));
            if (this.data.opacity !== 1.0) {
                var tempOpacity = context.globalAlpha;
                context.globalAlpha = this.options.opacity;
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
    if (global.J2D !== undefined) global.RectNode = RectNode;
    return RectNode;
}));
