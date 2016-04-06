/**
 * J2D (jQuery Canvas Graphic Engine plugin)
 *
 * @authors DeVinterX, Skaner(j2Ds)
 * @license BSD
 * @version 0.2.0-dev
 */

// TODO:: 

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('nodes/AnimatedNode', ['jquery', 'nodes/BaseNode', 'utils/Vector2d'], factory);
    } else if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = factory(require('jquery'), require('nodes/BaseNode'), require('utils/Vector2d'));
    } else {
        factory(root.jQuery, root.j2d.nodes.BaseNode, root.j2d.utils.Vector2d);
    }
}(typeof window !== 'undefined' ? window : global, function ($, BaseNode, Vector2d) {
    "use strict";

    /**
     * @abstract
     * @constructor
     * @param {BaseNode.defaults|AnimatedNode.defaults|Object} [data]
     * @property {BaseNode.defaults|AnimatedNode.defaults} data
     */
    var AnimatedNode = function (data) {
        BaseNode.call(this, $.extend(true, {}, AnimatedNode.defaults, data));
    };

    AnimatedNode.prototype = Object.create(BaseNode.prototype);
    AnimatedNode.prototype.constructor = AnimatedNode;

    AnimatedNode.defaults = {
        type: 'AnimatedNode'
    };

    /**
     * @param {Vector2d|BaseNode} position
     * @param {number} [speed]
     */
    AnimatedNode.prototype.moveTo = function (position, speed) {
        if (speed === undefined) speed = 1.0;
        if (typeof position == 'object') {
            if (position instanceof Vector2d) {
                this.setPosition(new Vector2d(
                    (position.getVector().x - this.getPosition().getVector().x) / speed,
                    (position.getVector().y - this.getPosition().getVector().y) / speed
                ));
            } else if (position instanceof BaseNode) {
                this.setPosition(new Vector2d(
                    (position.getPosition().getVector().x - this.getPosition().getVector().x) / speed,
                    (position.getPosition().getVector().y - this.getPosition().getVector().y) / speed
                ));
            }
        }
    };

    /**
     * @param {Vector2d|BaseNode} size
     * @param {number} [speed]
     */
    AnimatedNode.prototype.resizeTo = function (size, speed) {
        if (speed === undefined) speed = 1.0;

        if (typeof size == 'object') {
            if (size instanceof Vector2d) {
                this.setSize(new Vector2d(
                    (size.getVector().x - this.getSize().getVector().x) / speed,
                    (size.getVector().y - this.getSize().getVector().y) / speed
                ));
            } else if (size instanceof BaseNode) {
                this.setSize(new Vector2d(
                    (size.getSize().getVector().x - this.getSize().getVector().x) / speed,
                    (size.getSize().getVector().y - this.getSize().getVector().y) / speed
                ));
            }
        }
    };

    /**
     * @param {number|BaseNode} angle
     * @param {number} [speed]
     */
    AnimatedNode.prototype.rotateTo = function (angle, speed) {
        if (speed === undefined) speed = 1.0;

        if (typeof angle == 'number' && angle instanceof Vector2d) {

        } else if (typeof angle == 'object' && angle instanceof BaseNode) {

        }
    };

    /**
     * @param {number} [speed]
     */
    AnimatedNode.prototype.turn = function (speed) {
        if (speed === undefined) speed = 1.0;

    };

    if (typeof module === 'object' && typeof module.exports === 'object') module.exports.AnimatedNode = AnimatedNode;
    if (global.j2d === undefined) global.j2d.nodes.AnimatedNode = AnimatedNode;
    return AnimatedNode;
}));
