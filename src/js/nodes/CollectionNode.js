/**
 * J2D (jQuery Canvas Graphic Engine plugin)
 *
 * @authors DeVinterX, Skaner(j2Ds)
 * @license BSD
 * @version 0.2.0-dev
 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('nodes/CollectionNode', ['jquery', 'nodes/BaseNode', 'utils/ArrayMap'], factory);
    } else if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = factory(require('jquery'), require('nodes/BaseNode'), require('utils/ArrayMap'));
    } else {
        factory(root.jQuery, root.BaseNode, root.ArrayMap);
    }
}(typeof window !== 'undefined' ? window : global, function ($, BaseNode, ArrayMap) {
    "use strict";

    /**
     * @param {BaseNode.defaults|CollectionNode.defaults|Object} [data]
     * @constructor
     * @property {BaseNode.defaults|CollectionNode.defaults} data
     */
    var CollectionNode = function (data) {
        var collectionNode = this;
        BaseNode.call(this, $.extend(true, {}, CollectionNode.defaults, data));

        if (this.data.collection === null) {
            this.data.collection = new ArrayMap();
        }

        Object.defineProperty(this, 'zIndex', {
            get: function () {
                return 1000 - collectionNode.data.zIndex;
            },
            set: function (value) {
                collectionNode.data.zIndex = 1000 + value;
            }
        });
    };

    CollectionNode.prototype = Object.create(BaseNode.prototype);
    CollectionNode.prototype.constructor = CollectionNode;

    CollectionNode.defaults = {
        type: 'CollectionNode',
        /** @type {ArrayMap|null} */
        collection: null,
        zIndex: 1000
    };

    /**
     * @param {BaseNode|CollectionNode} node
     * @param {string} key
     * @returns {CollectionNode}
     */
    CollectionNode.prototype.add = function (node, key) {
        if (node instanceof BaseNode) {
            key = key || node.data.id;
            this.data.collection.add(key, node);
        }
        return this;
    };

    /**
     * @param {BaseNode|CollectionNode|null} node
     * @param {string} key
     * @returns {CollectionNode}
     */
    CollectionNode.prototype.remove = function (node, key) {
        if (node instanceof BaseNode) {
            this.data.collection.remove(this.data.collection[node.data.id]);
        }
        if (typeof key === 'string' && node === null) {
            this.data.collection.remove(key);
        }

        return this;
    };

    /**
     * @param {string} key
     * @returns {boolean}
     */
    CollectionNode.prototype.has = function (key) {
        return this.data.collection[key] !== undefined;
    };

    /**
     * @param {string} key
     * @returns {BaseNode|CollectionNode|boolean}
     */
    CollectionNode.prototype.get = function (key) {
        if (this.data.collection[key] !== undefined) {
            return this.data.collection[key];
        }
        return false;
    };

    /**
     * @returns {CollectionNode}
     */
    CollectionNode.prototype.flush = function () {
        this.data.collection.length = 0;
        return this;
    };

    /* ------------------------------ Render ------------------------------ */

    /**
     * @override
     *
     * @param {CanvasRenderingContext2D} context
     * @param {{offset: {x: number, y: number}, size: {x: number, y: number}, scale: number, angle: number}} viewport
     * @param {CollectionNode} collection
     * @param {object} data
     * @returns {CollectionNode}
     */
    CollectionNode.prototype.render = function (context, viewport, collection, data) {
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
    };

    if (typeof module === 'object' && typeof module.exports === 'object') module.exports.CollectionNode = CollectionNode;
    if (global.J2D !== undefined) global.CollectionNode = CollectionNode;
    return CollectionNode;
}));
