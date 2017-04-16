import ObjectUtil from "../../utils/ObjectUtil";
import UUID from "../../utils/UUID";
import Vector2d from "../../utils/Vector2d";

/**
 * @class BaseNode
 * @exports module:nodes/BaseNode
 *
 * @abstract
 * @constructor
 * @param {BaseNode.defaults|Object} [data]
 * @property {BaseNode.defaults} data
 */

export default class _deprecated_BaseNode {
    static defaults = {
        /** @type {string|null} */
        id: null,
        type: 'BaseNode',

        position: {
            x: 0.0,
            y: 0.0
        },
        size: {
            x: 0.0,
            y: 0.0
        },
        offset: {
            x: 0.0,
            y: 0.0
        },

        visible: true,
        angle: 0.0,
        scale: 1.0,
        opacity: 1.0,

        cache: null,
        enabledCache: false // TODO:: Collections & AnimatedPrimitiveNode
    };

    constructor(data) {
        this.data = ObjectUtil.extend(true, {}, BaseNode.defaults, data);

        if (this.data.id === null) {
            this.data.id = UUID.generate();
        }
    }

    get opacity() {
        return this.data.opacity;
    }

    set opacity(value) {
        this.data.opacity = value;
    }

    get visible() {
        return this.data.visible;
    }

    set visible(value) {
        this.data.visible = !!value;
    }

    get angle() {
        return this.data.angle;
    }

    set angle(value) {
        this.data.angle = value % 360;
    }

    get scale() {
        return this.data.scale;
    }

    set scale(value) {
        this.data.scale = value;
    }

    get cache() {
        return this.data.enabledCache;
    }

    set cache(value) {
        this.data.enabledCache = !!value;
    }

    /**
     * @param {BaseNode.defaults|Object} data
     */
    load(data) {
        this.data = ObjectUtil.extend(true, {}, this.data, data);
    }

    /**
     * @returns {BaseNode.defaults}
     */
    save() {
        return this.data;
    }

    /**
     * @returns {Vector2d}
     */
    getPosition() {
        return new Vector2d(this.data.position.x, this.data.position.y);
    }

    /**
     * @param {Vector2d|BaseNode} position
     * @returns {BaseNode}
     */
    setPosition(position) {
        if (position !== undefined) {
            if (position instanceof Vector2d) {
                this.data.position = position.getVector();
            } else if (position instanceof BaseNode) {
                this.data.position = position.getPosition().getVector();
            }
        }
        return this;
    }

    /**
     * @returns {Vector2d}
     */
    getSize() {
        return new Vector2d(this.data.size.x, this.data.size.y);
    }

    /**
     * @param {Vector2d|BaseNode} size
     * @returns {BaseNode}
     */
    setSize(size) {
        if (size !== undefined) {
            if (size instanceof Vector2d) {
                this.data.size = size.getVector();
            } else if (size instanceof BaseNode) {
                this.data.size = size.getSize().getVector();
            }
        }
        return this;
    }

    /**
     * @returns {Vector2d}
     */
    getOffset() {
        return new Vector2d(this.data.offset.x, this.data.offset.y);
    }

    /**
     * @param {Vector2d|BaseNode} offset
     * @returns {BaseNode}
     */
    setOffset(offset) {
        if (offset !== undefined) {
            if (offset instanceof Vector2d) {
                this.data.offset = offset.getVector();
            } else if (offset instanceof BaseNode) {
                this.data.offset = offset.getOffset().getVector();
            }
        }
        return this;
    }

    /* ------------------------------ Render ------------------------------ */

    /**
     * Must be override this in child!
     *
     * @deprecated
     * @overridable
     *
     * @param {CanvasRenderingContext2D} context
     * @param {{offset: {x: number, y: number}, size: {x: number, y: number}, scale: number, angle: number}} viewport
     * @param {CollectionNode} collection
     * @param {object} data
     * @returns {BaseNode}
     */
    render(context, viewport, collection, data) {
        // throw new Exception('Trying to render base node.'); // TODO:: exceptions
        return this;
    }

    //TODO:: Fix on fullscreen
    /**
     * @param {{offset: {x: number, y: number}, size: {x: number, y: number}, scale: number, angle: number}} viewport
     * @returns {boolean}
     */
    inViewport(viewport) {
        return !((this.data.position.x > viewport.offset.x + viewport.size.x
        || this.data.position.x + viewport.size.x < viewport.offset.x)
        || (this.data.position.y > viewport.offset.y + viewport.size.y
        || this.data.position.y + viewport.size.y < viewport.offset.y));
    }
}




