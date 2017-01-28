import ObjectUtil from "../../utils/ObjectUtil";
import AnimatedNode from "nodes/AnimatedNode";

/**
 * @class CameraNode
 * @exports module:nodes/CameraNode
 *
 * @constructor
 * @extends nodes/AnimatedNode
 * @param {BaseNode.defaults|AnimatedNode.defaults|CameraNode.defaults|Object} [data]
 * @property {BaseNode.defaults|AnimatedNode.defaults|CameraNode.defaults} data
 */
export default class CameraNode extends AnimatedNode {
    static defaults = {
        type: 'CameraNode'
    };

    constructor(data) {
        super(ObjectUtil.extend(true, {}, CameraNode.defaults, data));
    }

    /**
     * @param {{x: number, y: number, offsetX: number, offsetY: number}} screen
     * @param {Function|callback} calculate
     * @returns {{offset: {x: number, y: number}, size: {x: number, y: number}, scale: number, angle: number}}
     */
    getCameraViewport(screen, calculate) {
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
     * @returns {BaseNode|AnimatedNode|CameraNode}
     */
    render(context, viewport, collection, data) {
        return this;
    }
}
