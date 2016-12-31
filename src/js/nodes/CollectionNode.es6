import ObjectUtil from "utils/ObjectUtil";
import AnimatedNode from "nodes/AnimatedNode";
import ArrayMap from "utils/ArrayMap";
import BaseNode from "nodes/BaseNode";

/**
 * @class CollectionNode
 * @exports module:nodes/CollectionNode
 *
 * @constructor
 * @extends nodes/AnimatedNode
 * @param {BaseNode.defaults|AnimatedNode.defaults|CollectionNode.defaults|Object} [data]
 * @property {BaseNode.defaults|AnimatedNode.defaults|CollectionNode.defaults} data
 */
export default class CollectionNode extends AnimatedNode {
    static defaults = {
        type: 'CollectionNode',
        /** @type {ArrayMap|null} */
        collection: null,
        zIndex: 1000
    };

    constructor(data) {
        super(ObjectUtil.extend(true, {}, CollectionNode.defaults, data));

        if (this.data.collection === null) {
            this.data.collection = new ArrayMap();
        }
    }

    get zIndex() {
        return 1000 - this.data.zIndex;
    }

    set zIndex(value) {
        this.data.zIndex = 1000 + value;
    }

    /**
     * @param {BaseNode|CollectionNode} node
     * @param {string} key
     * @returns {CollectionNode}
     */
    add(node, key) {
        if (node instanceof BaseNode) {
            key = key || node.data.id;
            this.data.collection.add(key, node);
        }
        return this;
    }

    /**
     * @param {BaseNode|CollectionNode|null} node
     * @param {string} key
     * @returns {CollectionNode}
     */
    remove(node, key) {
        if (node instanceof BaseNode) {
            this.data.collection.remove(this.data.collection[node.data.id]);
        }
        if (typeof key === 'string' && node === null) {
            this.data.collection.remove(key);
        }

        return this;
    }

    /**
     * @param {string} key
     * @returns {boolean}
     */
    has(key) {
        return this.data.collection[key] !== undefined;
    }

    /**
     * @param {string} key
     * @returns {BaseNode|CollectionNode|boolean}
     */
    get(key) {
        if (this.data.collection[key] !== undefined) {
            return this.data.collection[key];
        }
        return false;
    }

    /**
     * @returns {CollectionNode}
     */
    flush() {
        this.data.collection.length = 0;
        return this;
    }

    /* ------------------------------ Render ------------------------------ */

    /**
     * @override
     *
     * @param {CanvasRenderingContext2D} context
     * @param {{offset: {x: number, y: number}, size: {x: number, y: number}, scale: number, angle: number}} viewport
     * @param {CollectionNode} collection
     * @param {object} data
     * @returns {BaseNode|CollectionNode}
     */
    render(context, viewport, collection, data) {
        var collectionNode = this;

        if (this.data.collection.length !== 0) {
            this.data.collection.each(function (index) {
                if (collectionNode.data.collection.hasOwnProperty(index)
                    && collectionNode.data.collection[index] instanceof BaseNode) {
                    collectionNode.data.collection[index].render(context, viewport, collection, data);
                }
            });
        }
        return this;
    }
}
