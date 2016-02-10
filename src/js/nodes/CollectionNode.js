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
     * @param {BaseNode.defaults|CollectionNode.defaults} data
     * @constructor
     * @property {BaseNode.defaults|CollectionNode.defaults} data
     */
    var CollectionNode = function (data) {
        BaseNode.call(this, $.extend(true, {}, defaults, data));

        if (this.data.collection === null) {
            this.data.collection = new ArrayMap();
        }
    };

    CollectionNode.prototype = Object.create(BaseNode.prototype);
    CollectionNode.prototype.constructor = CollectionNode;

    CollectionNode.defaults = {
        type: 'CollectionNode',
        collection: null
    };

    /**
     * @param {BaseNode|CollectionNode} node
     * @param {string} key
     * @returns {CollectionNode}
     */
    CollectionNode.prototype.add = function (node, key) {
        if (typeof key === 'string' && node instanceof BaseNode) {
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
            this.data.collection.remove(this.data.collection[node.id]);
        }
        if (typeof key === 'string' && node === null) {
            this.data.collection.remove(key);
        }

        return this;
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
     * @param {object} context
     * @param {{offset: {x: number, y: number}, size: {x: number, y: number}, scale: number, angle: number}} viewport
     * @param {CollectionNode} collection
     * @param {object} data
     * @returns {CollectionNode}
     */
    CollectionNode.prototype.render = function (context, viewport, collection, data) {
        //TODO:: make this
        return this;
    };

    if (global.J2D !== undefined) global.CollectionNode = CollectionNode;
    return CollectionNode;
}));
