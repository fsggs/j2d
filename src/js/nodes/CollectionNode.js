/**
 * J2D (jQuery Canvas Graphic Engine plugin)
 *
 * @authors DeVinterX, Skaner(j2Ds)
 * @license BSD
 * @version 0.2.0-dev
 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('nodes/CollectionNode', ['nodes/BaseNode'], factory);
    } else if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = factory(require('nodes/BaseNode'));
    } else {
        factory(root.BaseNode);
    }
}(typeof window !== 'undefined' ? window : global, function (BaseNode) {
    "use strict";

    /**
     * @constructor
     */
    var CollectionNode = function () {
    };

    CollectionNode.prototype = Object.create(BaseNode.prototype);
    CollectionNode.prototype.constructor = CollectionNode;

    if (global.J2D !== undefined) global.CollectionNode = CollectionNode;
    return CollectionNode;
}));
