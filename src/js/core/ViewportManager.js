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
        factory(root.ArrayMap, root.CameraNode, root.Vector2d);
    }
}(typeof window !== 'undefined' ? window : global, function (ArrayMap, CameraNode, Vector2d) {
    "use strict";

    var calculateScale = function (screen, viewport) {
        return 1.0;
    };

    /**
     * @constructor
     */
    var ViewportManager = function () {
        this.cameras = new ArrayMap();

        this.camera = 'No active cameras';

        this.screen = {x: 0, y: 0};

        this.data = {
            offset: {
                x: 0.0,
                y: 0.0
            },
            size: {
                x: 0.0,
                y: 0.0
            },
            scale: 1.0
        };
    };

    /**
     * @param data
     * @returns {ViewportManager}
     */
    ViewportManager.prototype.setScreen = function (data) {
        if (typeof data == 'object') {
            if (data instanceof Array && data.length == 2) {
                this.screen = {x: data[0], y: data[1]};
                return this;
            }
            if (data.x !== undefined && data.y !== undefined) {
                this.screen = {x: data.x, y: data.y};
            }
        }
        return this;
    };

    /**
     * @param key
     * @param node
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
     * @param key
     * @returns {ViewportManager}
     */
    ViewportManager.prototype.removeCamera = function (key) {
        this.cameras.remove(key);
        if (this.camera == key) {
            this.camera = 'No active cameras';
            this.data = {
                offset: {x: 0.0, y: 0.0},
                size: {x: 0.0, y: 0.0},
                scale: 1.0
            }
        }
        return this;
    };

    /**
     * @param key
     * @returns {ViewportManager}
     */
    ViewportManager.prototype.updateViewport = function (key) {
        if (this.cameras[key] !== undefined && this.cameras[key] instanceof CameraNode) {
            this.data = this.cameras[key].getCameraViewport(this.screen, calculateScale);
        }
        return this;
    };

    /**
     * @deprecated
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
                this.data.offset = size.getVector();
            }
        }

        this.data.scale = calculateScale(this.screen, this.data);
        return this;
    };

    /**
     * @returns {{offset: {x: number, y: number}, size: {x: number, y: number}, scale: number}}
     */
    ViewportManager.prototype.getViewport = function () {
        return this.data;
    };

    if (global.J2D !== undefined) global.ViewportManager = ViewportManager;
    return ViewportManager;
}));