/**
 * J2D (jQuery Canvas Graphic Engine plugin)
 *
 * @authors DeVinterX, Skaner(j2Ds)
 * @license BSD
 * @version 0.2.0-dev
 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('core/ViewportManager', ['utils/ArrayMap', 'nodes/CameraNode', 'utils/Vector2d'], factory);
    } else if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = factory(require('utils/ArrayMap'), require('nodes/CameraNode'), require('utils/Vector2d'));
    } else {
        factory(root.j2d.utils.ArrayMap, root.j2d.nodes.CameraNode, root.j2d.utils.Vector2d);
    }
}(typeof window !== 'undefined' ? window : global, function (ArrayMap, CameraNode, Vector2d) {
    "use strict";

    /**
     * @param {{x: number, y: number, offsetX: number, offsetY: number}} screen
     * @param {{offset: {x: number, y: number}, size: {x: number, y: number}, scale: number, angle: number}} viewport
     * @returns {{offset: {x: number, y: number}, size: {x: number, y: number}, scale: number, angle: number}}
     */
    var calculateScale = function (screen, viewport) {
        var data = {
            offset: {x: 0, y: 0},
            size: {x: 0, y: 0},
            scale: 1.0,
            angle: viewport.angle
        };

        data.offset.x = screen.offsetX + viewport.offset.x;
        data.offset.y = screen.offsetY + viewport.offset.y;

        data.size.x = (screen.x < viewport.size.x) ? screen.x : viewport.size.x;
        data.size.y = (screen.y < viewport.size.y) ? screen.y : viewport.size.y;

        data.scale = viewport.scale * (((screen.x / viewport.size.x) + (screen.y / viewport.size.y)) / 2);
        return data;
    };

    /**
     * @constructor
     *
     * @property {ArrayMap.<CameraNode>|CameraNode[]} cameras
     * @property {string} camera
     * @property {{x: number, y: number, offsetX: number, offsetY: number}} screen
     * @property {boolean} init
     * @property {{offset: {x: number, y: number}, size: {x: number, y: number}, scale: number, angle: number}} data
     */
    var ViewportManager = function () {
        /** @type ArrayMap.<CameraNode>|CameraNode[] */
        this.cameras = new ArrayMap();

        /** @type string */
        this.camera = 'No active cameras';

        /** @type {{x: number, y: number, offsetX: number, offsetY: number}} */
        this.screen = {
            x: 0,
            y: 0,
            offsetX: 0,
            offsetY: 0
        };

        this.init = false;

        this.data = {
            offset: {x: 0.0, y: 0.0},
            size: {x: 0.0, y: 0.0},
            scale: 1.0,
            angle: 0.0
        };
    };

    /**
     * @param {{x: number|undefined, y: number|undefined}|Array<number>} data
     * @returns {ViewportManager}
     */
    ViewportManager.prototype.setScreen = function (data) {
        if (typeof data == 'object') {
            if (data instanceof Array && data.length == 2) {
                this.screen = {
                    x: data[0],
                    y: data[1],
                    offsetX: this.screen.offsetX,
                    offsetY: this.screen.offsetY
                };
                return this;
            }
            if (data.x !== undefined && data.y !== undefined) {
                this.screen = {
                    x: data.x,
                    y: data.y,
                    offsetX: this.screen.offsetX,
                    offsetY: this.screen.offsetY
                };
            }
        }
        return this;
    };

    /**
     * @param {{x: number|undefined, y: number|undefined}|Array<number>} data
     * @returns {ViewportManager}
     */
    ViewportManager.prototype.setOffset = function (data) {
        if (typeof data == 'object') {
            if (data instanceof Array && data.length == 2) {
                this.screen = {
                    x: this.screen.x,
                    y: this.screen.y,
                    offsetX: data[0],
                    offsetY: data[1]
                };
                return this;
            }
            if (data.x !== undefined && data.y !== undefined) {
                this.screen = {
                    x: this.screen.x,
                    y: this.screen.y,
                    offsetX: data.x,
                    offsetY: data.y
                };
            }
        }
        return this;
    };

    /**
     * @param {string} key
     * @param {CameraNode} node
     * @returns {ViewportManager}
     */
    ViewportManager.prototype.addCamera = function (key, node) {
        if (node instanceof CameraNode) {
            this.cameras.add(key, node);
            return this;
        }
        // throw new InvalidArgumentException('Unknown camera node type');
    };

    /**
     * @param {string} key
     * @returns {ViewportManager}
     */
    ViewportManager.prototype.removeCamera = function (key) {
        this.cameras.remove(key);
        if (this.camera == key) {
            this.camera = 'No active cameras';
            this.data = {
                offset: {x: 0.0, y: 0.0},
                size: {x: 0.0, y: 0.0},
                scale: 1.0,
                angle: 0.0
            }
        }
        return this;
    };

    /**
     * @param {string} key
     * @returns {ViewportManager}
     */
    ViewportManager.prototype.updateViewport = function (key) {
        if (this.cameras[key] !== undefined && this.cameras[key] instanceof CameraNode) {
            this.data = this.cameras[key].getCameraViewport(this.screen, calculateScale);
        }
        return this;
    };

    /**
     * @deprecated Please use CameraNode
     *
     * @param {Vector2d|null} [offset]
     * @param {Vector2d|null} [size]
     * @returns {ViewportManager}
     */
    ViewportManager.prototype.setViewport = function (offset, size) {
        if (offset !== undefined && typeof offset == 'object') {
            if (offset instanceof Vector2d) {
                this.data.offset = offset.getVector();
            }
        }

        if (size !== undefined && typeof size == 'object') {
            if (size instanceof Vector2d) {
                this.data.size = size.getVector();
            }
        }

        this.data = calculateScale(this.screen, this.data);
        return this;
    };

    /**
     * @param {{offset: {x: number, y: number}, size: {x: number, y: number}, scale: number, angle: number}} viewport
     * @returns {ViewportManager}
     */
    ViewportManager.prototype.setDefaultViewport = function (viewport) {
        if (!this.init) {
            this.data = viewport;
            this.init = true;
        }
        return this;
    };

    /**
     * @returns {{offset: {x: number, y: number}, size: {x: number, y: number}, scale: number, angle: number}}
     */
    ViewportManager.prototype.getViewport = function () {
        return this.data;
    };

    if (typeof module === 'object' && typeof module.exports === 'object') module.exports.ViewportManager = ViewportManager;
    if (global.j2d === undefined) global.j2d.core.ViewportManager = ViewportManager;
    return ViewportManager;
}));
