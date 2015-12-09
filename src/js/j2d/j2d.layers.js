/**
 * J2D (jQuery plugin of the fork j2ds)
 *
 * @authors Skaner, likerRr, DeVinterX
 * @license zlib
 * @version 0.1.5a
 * @see https://github.com/SkanerSoft/J2ds/commit/d91880bd189a29b364cc6fd2a3af069f139c5f8a
 */

!function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('j2d.layers', [], factory);
    } else {
        factory();
    }
}(global, function () {
    "use strict";

    var WebGL2D;

    var LayersManager = function (j2d, WebGL_API) {
        this.parent = j2d;
        this.list = {};

        WebGL2D = WebGL_API;
    };

    LayersManager.prototype.getLayer = function (id) {
        return this.list[id];
    };
    LayersManager.prototype.add = function (id, zIndex) {
        if (this.list[id]) {
            return false;
        }

        var layer = {};
        var j2d = this.parent;

        layer.layerName = id;
        layer.canvas = document.createElement('canvas');
        layer.canvas.width = j2d.scene.width;
        layer.canvas.height = j2d.scene.height;
        layer.width = j2d.scene.width;
        layer.height = j2d.scene.height;
        if (j2d.options.webGL) {
            WebGL2D.enable(layer.canvas);
            layer.context = layer.canvas.getContext('WebGL-2d');
        } else {
            layer.context = layer.canvas.getContext('2d');
        }
        if (!j2d.options.smoothing) {
            layer.smoothing = false;
            layer.disableSmoothing = j2d.util.disableSmoothing;
            j2d.util.disableSmoothing(layer.context);
        } else layer.smoothing = true;
        layer.context.shadowColor = 'rgba(0,0,0,0)';
        layer.canvas.style.zIndex = 1000 + zIndex;
        layer.canvas.style.position = 'absolute';
        layer.canvas.style.left = '0';
        layer.canvas.style.top = '0';
        layer.canvas.id = id;
        layer.opacity = 1;
        layer.angle = 0;
        layer.visible = 1;

        layer.fillColor = false;

        layer.onContext = function (callback) {
            callback(this.context);
        };

        layer.fill = function (color) {
            this.fillColor = color;
            this.context.fillStyle = color;
            this.context.fillRect(0, 0, this.width, this.height);
        };

        layer.setOpacity = function (opacity) {
            this.canvas.style.opacity = opacity;
            this.opacity = opacity;
        };

        layer.getOpacity = function () {
            return this.opacity;
        };

        layer.setVisible = function (visible) {
            if (visible) {
                this.canvas.style.display = 'block';
                this.visible = true;
            } else {
                this.canvas.style.display = 'none';
                this.visible = false;
            }
        };

        layer.isVisible = function () {
            return this.visible;
        };

        layer.setIndex = function (zIndex) {
            this.canvas.style.zIndex = 1000 + zIndex;
        };

        layer.clear = function () {
            this.context.clearRect(0, 0, this.width, this.height);
        };

        layer.clearNode = function (node) {
            if (node.isLookScene()) {
                this.context.clearRect(node.pos.x - j2d.scene.viewport.x, node.pos.y - j2d.scene.viewport.y, node.size.x, node.size.y);
            }
        };

        layer.clearRect = function (pos, size) {
            this.context.clearRect(pos.x - j2d.scene.viewport.x, pos.y - j2d.scene.viewport.y, size.x, size.y);
        };

        layer.resize = function (width, height) {
            this.canvas.width = width;
            this.canvas.height = height;
            this.width = width;
            this.height = height;

            if (this.fillColor) {
                this.context.save();

                this.context.fillStyle = this.fillColor;
                this.context.fillRect(0, 0, this.width, this.height);

                this.context.restore();
            }
            if (!this.smoothing) this.disableSmoothing(this.context);
        };

        this.list[id] = layer;

        if (j2d.options.ready) {
            j2d.element.append(this.list[id].canvas);
        }

        return layer;
    };

    if (global.J2D !== undefined) global.LayersManager = LayersManager;
    return LayersManager;
});
