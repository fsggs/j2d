import ObjectUtil from "utils/ObjectUtil";
import BaseNode from "nodes/BaseNode";
import Vector2d from "utils/Vector2d";
import Tween from "transitions/Tween";

// TODO:: move(+v.x, +v.y)

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
export default class AnimatedNode extends BaseNode {
    static defaults = {
        type: 'AnimatedNode'
    };

    constructor(data) {
        super(ObjectUtil.extend(true, {}, AnimatedNode.defaults, data));
    }

    /**
     * @param {Vector2d|BaseNode} position
     * @param {number} [duration]
     * @param {boolean} [durationAsSpeed]
     */
    moveTo(position, duration, durationAsSpeed) {
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
    }

    /**
     * @param {Vector2d|BaseNode} size
     * @param {number} [duration]
     * @param {boolean} [durationAsSpeed]
     */
    resizeTo(size, duration, durationAsSpeed) {
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
    }

    /**
     * @param {number|BaseNode} angle
     * @param {number} [duration]
     */
    rotateTo(angle, duration) {
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
    }

    /**
     * @param {number} [velocity]
     */
    turn(velocity) {
        if (velocity === undefined || typeof velocity !== 'number') velocity = 1.0;
        this.angle += velocity;
    }
}
