/**
 * J2D (jQuery Canvas Graphic Engine plugin)
 *
 * @authors DeVinterX, Skaner(j2Ds)
 * @license BSD
 * @version 0.2.0-dev
 */

// TODO:: move(+v.x, +v.y)

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('nodes/AnimatedNode', [
            'jquery',
            'nodes/BaseNode',
            'utils/Vector2d',
            'transitions/Tween'
        ], factory);
    } else if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = factory(
            require('jquery'),
            require('nodes/BaseNode'),
            require('utils/Vector2d'),
            require('transitions/Tween')
        );
    } else {
        factory(
            root.jQuery,
            root.j2d.nodes.BaseNode,
            root.j2d.utils.Vector2d,
            root.j2d.transitions.Tween
        );
    }
}(typeof window !== 'undefined' ? window : global, function ($, BaseNode, Vector2d, Tween) {
    "use strict";

    /**
     * @class AnimatedNode
     * @exports module:nodes/AnimatedNode
     * 
     * @abstract
     * @constructor
     * @extends nodes/BaseNode
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
     * @param {number} [duration]
     * @param {boolean} [durationAsSpeed]
     */
    AnimatedNode.prototype.moveTo = function (position, duration, durationAsSpeed) {
        if (duration === undefined || typeof duration !== 'number') duration = 1000.0;

        if (typeof position === 'object') {
            var tween = new Tween(this);

            if (position instanceof Vector2d) {
                if (durationAsSpeed) duration = Vector2d.getDistance(this.getPosition(), position) / duration;
                tween.to({
                    position: {
                        x: position.getVector().x,
                        y: position.getVector().y
                    }
                }, duration);
            } else if (position instanceof BaseNode) {
                if (durationAsSpeed) duration = Vector2d.getDistance(this.getPosition(), position.getPosition()) / duration;
                tween.to({
                    position: {
                        x: position.getPosition().getVector().x,
                        y: position.getPosition().getVector().y
                    }
                }, duration);
            }

            tween.start();
        }
    };

    /**
     * @param {Vector2d|BaseNode} size
     * @param {number} [duration]
     * @param {boolean} [durationAsSpeed]
     */
    AnimatedNode.prototype.resizeTo = function (size, duration, durationAsSpeed) {
        if (duration === undefined || typeof duration !== 'number') duration = 1000.0;
        if (typeof position === 'object') {
            var tween = new Tween(this);

            if (size instanceof Vector2d) {
                if (durationAsSpeed) duration = Vector2d.getDistance(this.getSize(), size) / duration;
                tween.to({
                    size: {
                        x: size.getVector().x,
                        y: size.getVector().y
                    }
                }, duration);
            } else if (size instanceof BaseNode) {
                if (durationAsSpeed) duration = Vector2d.getDistance(this.getSize(), size.getSize()) / duration;
                tween.to({
                    size: {
                        x: size.getSize().getVector().x,
                        y: size.getSize().getVector().y
                    }
                }, duration);
            }

            tween.start();
        }
    };

    /**
     * @param {number|BaseNode} angle
     * @param {number} [duration]
     */
    AnimatedNode.prototype.rotateTo = function (angle, duration) {
        if (duration === undefined || typeof duration !== 'number') duration = 1000.0;
        var tween = new Tween(this);

        if (typeof angle === 'number') {
            tween.to({angle: angle % 360}, duration);
        } else if (typeof angle === 'object' && angle instanceof BaseNode) {
            tween.to({
                angle: Vector2d.getAngle(angle.getPosition(), this.getPosition())
            }, duration);
        }

        tween.start();
    };

    /**
     * @param {number} [velocity]
     */
    AnimatedNode.prototype.turn = function (velocity) {
        if (velocity === undefined || typeof velocity !== 'number') velocity = 1.0;
        this.angle += velocity;
    };

    if (typeof module === 'object' && typeof module.exports === 'object') module.exports.AnimatedNode = AnimatedNode;
    if (global.j2d === undefined) global.j2d.nodes.AnimatedNode = AnimatedNode;
    return AnimatedNode;
}));
