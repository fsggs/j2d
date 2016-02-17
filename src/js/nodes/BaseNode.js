/**
 * J2D (jQuery Canvas Graphic Engine plugin)
 *
 * @authors DeVinterX, Skaner(j2Ds)
 * @license BSD
 * @version 0.2.0-dev
 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('nodes/BaseNode', ['jquery', 'utils/Vector2d'], factory);
    } else if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = factory(require('jquery'), require('utils/Vector2d'));
    } else {
        factory(root.jQuery, root.Vector2d);
    }
}(typeof window !== 'undefined' ? window : global, function ($, Vector2d) {
    "use strict";

    /**
     * @param {BaseNode.defaults|Object} [data]
     * @constructor
     * @property {BaseNode.defaults} data
     */
    var BaseNode = function (data) {
        var baseNode = this;
        this.data = $.extend(true, {}, BaseNode.defaults, data);

        if (this.data.id === null) {
            this.data.id = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        }

        Object.defineProperty(this, 'opacity', {
            get: function () {
                return baseNode.data.opacity;
            },
            set: function (value) {
                baseNode.data.opacity = value;
            }
        });

        Object.defineProperty(this, 'visible', {
            get: function () {
                return baseNode.data.visible;
            },
            set: function (value) {
                baseNode.data.visible = !!value;
            }
        });

        Object.defineProperty(this, 'angle', {
            get: function () {
                return baseNode.data.angle;
            },
            set: function (value) {
                baseNode.data.angle = value % 360;
            }
        });

        Object.defineProperty(this, 'cache', {
            get: function () {
                return baseNode.data.enabledCache;
            },
            set: function (value) {
                baseNode.data.enabledCache = !!value;
            }
        });
    };

    BaseNode.defaults = {
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
        angle: 0,
        opacity: 1,

        cache: null,
        enabledCache: false // TODO:: Collections & AnimatedPrimitiveNode
    };

    /**
     * @returns {Vector2d}
     */
    BaseNode.prototype.getPosition = function () {
        return new Vector2d(this.data.position.x, this.data.position.y);
    };

    /**
     * @param {Vector2d} position
     * @returns {BaseNode}
     */
    BaseNode.prototype.setPosition = function (position) {
        if (position !== undefined && position instanceof Vector2d) {
            this.data.position = position.getVector();
        }
        return this;
    };

    /**
     * @returns {Vector2d}
     */
    BaseNode.prototype.getSize = function () {
        return new Vector2d(this.data.size.x, this.data.size.y);
    };

    /**
     * @param {Vector2d} size
     * @returns {BaseNode}
     */
    BaseNode.prototype.setSize = function (size) {
        if (size !== undefined && size instanceof Vector2d) {
            this.data.size = size.getVector();
        }
        return this;
    };

    /**
     * @returns {Vector2d}
     */
    BaseNode.prototype.getOffset = function () {
        return new Vector2d(this.data.offset.x, this.data.offset.y);
    };

    /**
     * @param {Vector2d} offset
     * @returns {BaseNode}
     */
    BaseNode.prototype.setOffset = function (offset) {
        if (offset !== undefined && offset instanceof Vector2d) {
            this.data.offset = offset.getVector();
        }
        return this;
    };

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
    BaseNode.prototype.render = function (context, viewport, collection, data) {
        // throw new Exception('Trying to render base node.'); // TODO:: exceptions
        return this;
    };

    if (global.J2D !== undefined) global.BaseNode = BaseNode;
    return BaseNode;
}));
