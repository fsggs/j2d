/**
 * J2D (jQuery Canvas Graphic Engine plugin)
 *
 * @authors DeVinterX, Skaner(j2Ds)
 * @license BSD
 * @version 0.2.0-dev
 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('core/LayersManager', ['utils/ArrayMap', 'nodes/BaseNode', 'nodes/CollectionNode'], factory);
    } else if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = factory(require('utils/ArrayMap', require('nodes/BaseNode'), require('nodes/CollectionNode')));
    } else {
        factory(root.ArrayMap, root.BaseNode, root.CollectionNode);
    }
}(typeof window !== 'undefined' ? window : global, function (ArrayMap, BaseNode, CollectionNode) {
    "use strict";

    var LayersManager = function () {
        this.globalCollection = new ArrayMap();

        this.layers = [];
        this.index = 1000;
    };

    /**
     * @param {string} name
     * @param {number} zIndex
     * @param {CollectionNode|undefined} node
     * @returns {LayersManager}
     */
    LayersManager.prototype.addLayer = function (name, zIndex, node) {
        name = name || 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });

        if (node === undefined || node instanceof CollectionNode) {
            if (zIndex === undefined) {
                zIndex = this.index;
                this.index++;
            } else {
                zIndex += 1000;
            }

            node = node || new CollectionNode({id: name, zIndex: zIndex});

            this.globalCollection.add(name, node);
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
        delete this.layers[this.globalCollection[name].zIndex];
        this.globalCollection.remove(name);
        return this;
    };

    /**
     * @param {string} name
     * @returns {CollectionNode|null}
     */
    LayersManager.prototype.getLayer = function (name) {
        if (this.globalCollection[name] !== undefined) {
            return this.globalCollection[name];
        }
        return null;
    };

    /**
     * @param {string} name
     * @param {number} zIndex
     * @returns {LayersManager}
     */
    LayersManager.prototype.setZIndex = function (name, zIndex) {
        if (this.globalCollection[name] !== undefined) {
            delete this.layers[this.globalCollection[name].zIndex];
            this.globalCollection[name].zIndex = zIndex;
            this.layers[this.globalCollection[name].zIndex] = zIndex;
        }
        return this;
    };

    if (global.J2D !== undefined) global.LayersManager = LayersManager;
    return LayersManager;
}));
