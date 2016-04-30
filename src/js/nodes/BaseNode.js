/**
 * J2D (jQuery Canvas Graphic Engine plugin)
 *
 * @authors DeVinterX, Skaner(j2Ds)
 * @license BSD
 * @version 0.2.0-dev
 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('nodes/BaseNode', ['jquery', 'utils/Vector2d', 'utils/UUID'], factory);
    } else if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = factory(require('jquery'), require('utils/Vector2d'), require('utils/UUID'));
    } else {
        factory(root.jQuery, root.j2d.utils.Vector2d, root.j2d.utils.UUID);
    }
}(typeof window !== 'undefined' ? window : global, function ($, Vector2d, UUID) {
    "use strict";

    /**
     * @class BaseNode
     * @exports module:nodes/BaseNode
     * 
     * @abstract
     * @constructor
     * @param {BaseNode.defaults|Object} [data]
     * @property {BaseNode.defaults} data
     */
    var BaseNode = function (data) {
        var baseNode = this;
        this.data = $.extend(true, {}, BaseNode.defaults, data);

        if (this.data.id === null) {
            this.data.id = UUID.generate();
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

        Object.defineProperty(this, 'scale', {
            get: function () {
                return baseNode.data.scale;
            },
            set: function (value) {
                baseNode.data.scale = value;
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
        angle: 0.0,
        scale: 1.0,
        opacity: 1.0,

        cache: null,
        enabledCache: false // TODO:: Collections & AnimatedPrimitiveNode
    };

    /**
     * @param {BaseNode.defaults|Object} data
     */
    BaseNode.prototype.import = function (data) {
        this.data = $.extend(true, {}, this.data, data);
    };

    /**
     * @returns {BaseNode.defaults}
     */
    BaseNode.prototype.export = function () {
        return this.data;
    };

    /**
     * @returns {Vector2d}
     */
    BaseNode.prototype.getPosition = function () {
        return new Vector2d(this.data.position.x, this.data.position.y);
    };

    /**
     * @param {Vector2d|BaseNode} position
     * @returns {BaseNode}
     */
    BaseNode.prototype.setPosition = function (position) {
        if (position !== undefined) {
            if (position instanceof Vector2d) {
                this.data.position = position.getVector();
            } else if (position instanceof BaseNode) {
                this.data.position = position.getPosition().getVector();
            }
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
     * @param {Vector2d|BaseNode} size
     * @returns {BaseNode}
     */
    BaseNode.prototype.setSize = function (size) {
        if (size !== undefined) {
            if (size instanceof Vector2d) {
                this.data.size = size.getVector();
            } else if (size instanceof BaseNode) {
                this.data.size = size.getSize().getVector();
            }
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
     * @param {Vector2d|BaseNode} offset
     * @returns {BaseNode}
     */
    BaseNode.prototype.setOffset = function (offset) {
        if (offset !== undefined) {
            if (offset instanceof Vector2d) {
                this.data.offset = offset.getVector();
            } else if (offset instanceof BaseNode) {
                this.data.offset = offset.getOffset().getVector();
            }
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

    //TODO:: Fix on fullscreen
    /**
     * @param {{offset: {x: number, y: number}, size: {x: number, y: number}, scale: number, angle: number}} viewport
     * @returns {boolean}
     */
    BaseNode.prototype.inViewport = function (viewport) {
        return !((this.data.position.x > viewport.offset.x + viewport.size.x
        || this.data.position.x + viewport.size.x < viewport.offset.x)
        || (this.data.position.y > viewport.offset.y + viewport.size.y
        || this.data.position.y + viewport.size.y < viewport.offset.y));
    };

    if (typeof module === 'object' && typeof module.exports === 'object') module.exports.BaseNode = BaseNode;
    if (global.j2d === undefined) global.j2d.nodes.BaseNode = BaseNode;
    return BaseNode;
}));
