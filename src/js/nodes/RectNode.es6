import ObjectUtil from "utils/ObjectUtil";
import AnimatedNode from "nodes/AnimatedNode";
import MathUtil from "utils/MathUtil";

/**
 * @class RectNode
 * @exports module:nodes/RectNode
 *
 * @constructor
 * @extends nodes/AnimatedNode
 * @param {BaseNode.defaults|AnimatedNode.defaults|RectNode.defaults|Object} [data]
 * @property {BaseNode.defaults|AnimatedNode.defaults|RectNode.defaults} data
 */
export default class RectNode extends AnimatedNode {
    static defaults = {
        type: 'RectNode',
        color: '#000000'
    };

    constructor(data) {
        super(ObjectUtil.extend(true, {}, RectNode.defaults, data));
    }

    /**
     * @returns {string}
     */
    getColor() {
        return this.data.color;
    }

    /**
     * @param {string} color
     * @returns {RectNode}
     */
    setColor(color) {
        this.data.color = color;
        return this;
    }

    /* ------------------------------ Draw ------------------------------ */

    /**
     * @param {CanvasRenderingContext2D} context
     * @param {{offset: {x: number, y: number}, size: {x: number, y: number}, scale: number, angle: number}} viewport
     * @param {CollectionNode} collection
     * @param {object} data
     * @returns {null}
     */
    draw(context, viewport, collection, data) {
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
    }

    /* ------------------------------ Render ------------------------------ */

    /**
     * @override
     *
     * @param {CanvasRenderingContext2D} context
     * @param {{offset: {x: number, y: number}, size: {x: number, y: number}, scale: number, angle: number}} viewport
     * @param {CollectionNode} collection
     * @param {object} data
     * @returns {BaseNode|AnimatedNode|RectNode}
     */
    render(context, viewport, collection, data) {
        this.draw(context, viewport, collection, data);
        return this;
    }
}
