/**
 * J2D (jQuery Canvas Graphic Engine plugin)
 *
 * @authors DeVinterX, Skaner(j2Ds)
 * @license BSD
 * @version 0.2.0-dev
 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('core/LayersManager', ['utils/ArrayMap', 'nodes/BaseNode', 'nodes/CollectionNode', 'utils/UUID'], factory);
    } else if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = factory(
            require('utils/ArrayMap'),
            require('nodes/BaseNode'),
            require('nodes/CollectionNode'),
            require('utils/UUID')
        );
    } else {
        factory(root.j2d.utils.ArrayMap, root.j2d.nodes.BaseNode, root.j2d.nodes.CollectionNode, root.j2d.utils.UUID);
    }
}(typeof window !== 'undefined' ? window : global, function (ArrayMap, BaseNode, CollectionNode, UUID) {
    "use strict";

    /**
     * @constructor
     */
    var LayersManager = function () {
        /** @type CollectionNode */
        this.globalCollection = new CollectionNode({id: 'GlobalLayer'});

        /** @type Array.<CollectionNode>|CollectionNode[] */
        this.layers = [];

        /** @type number */
        this.index = 1000;
    };

    /**
     * @param {string} name
     * @param {number} [zIndex]
     * @param {CollectionNode|undefined} [node]
     * @returns {LayersManager}
     */
    LayersManager.prototype.addLayer = function (name, zIndex, node) {
        name = name || UUID.generate();

        if (node === undefined || node instanceof CollectionNode) {
            if (zIndex === undefined) {
                zIndex = this.index;
                this.index++;
            } else {
                zIndex += 1000;
            }

            node = node || new CollectionNode({id: name, zIndex: zIndex});

            this.globalCollection.add(node, name);
            this.layers[zIndex] = node;

            return this;
        }
        // throw new InvalidArgumentException('Unknown node type to add as layers');
    };

    /**
     * @param {string} name
     * @returns {LayersManager}
     */
    LayersManager.prototype.removeLayer = function (name) {
        delete this.layers[this.globalCollection.get(name).zIndex];
        this.globalCollection.remove(null, name);
        return this;
    };

    /**
     * @param {string} name
     * @returns {CollectionNode|null}
     */
    LayersManager.prototype.getLayer = function (name) {
        if (this.globalCollection.has(name)) {
            return this.globalCollection.get(name);
        }
        return null;
    };

    /**
     * @param {string} name
     * @param {number} zIndex
     * @returns {LayersManager}
     */
    LayersManager.prototype.setZIndex = function (name, zIndex) {
        if (this.globalCollection.has(name)) {
            delete this.layers[this.globalCollection.get(name).zIndex];
            this.globalCollection.get(name).zIndex = zIndex;
            this.layers[zIndex] = this.globalCollection.get(name);
        }
        return this;
    };

    if (typeof module === 'object' && typeof module.exports === 'object') module.exports.LayersManager = LayersManager;
    if (global.j2d === undefined) global.j2d.core.LayersManager = LayersManager;
    return LayersManager;
}));
