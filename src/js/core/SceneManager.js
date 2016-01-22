/**
 * J2D (jQuery Canvas Graphic Engine plugin)
 *
 * @authors DeVinterX, Skaner(j2Ds)
 * @license BSD
 * @version 0.2.0-dev
 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('core/SceneManager', [], factory);
    } else if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = factory();
    } else {
        factory();
    }
}(typeof window !== 'undefined' ? window : global, function () {
    "use strict";

    var SceneManager = function (j2d) {
        this.parent = j2d;
        this.enableFullscreen = false;
        this.layerName = 'sceneNode';
        this.layers = (parent.layers) ? parent.layers : {};
    };

    SceneManager.prototype.resize = function (width, height) {
        var j2d = this.parent;

        this.width = width;
        this.height = height;

        for (var i in j2d.layers.list) {
            if (j2d.layers.list.hasOwnProperty(i)) {
                j2d.layers.list[i].resize(width, height);
            }
        }
    };

    SceneManager.prototype.async = function (callback, data) {
        setTimeout(callback.call(callback, data), 0);
    };

    SceneManager.prototype.setGameState = function (engine) {
        this.parent.setActiveEngine(engine);
        this.parent.element.trigger('changedGameState');
    };

    SceneManager.prototype.start = function (engine, frameLimit) {
        if (this.parent.options.io) {
            this.parent.options.io.init();
        }
        this.parent.element.trigger('beforeStart');
        this.parent.start(engine, frameLimit);
        this.parent.element.trigger('afterStart');
    };

    SceneManager.prototype.fullScreen = function (fullscreen) {
        var element = document.getElementById(this.parent.element.attr('id'));

        if (undefined === element.requestFullscreen) {
            element.requestFullscreen = element.webkitRequestFullscreen
                || element.webkitRequestFullScreen
                || element.mozRequestFullScreen
                || element.msRequestFullscreen;
        }

        if (undefined === document.exitFullscreen) {
            document.exitFullscreen = document.webkitExitFullscreen
                || document.webkitCancelFullScreen
                || document.mozCancelFullScreen
                || document.msExitFullscreen;
        }
        if (fullscreen) {
            element.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    };

    SceneManager.prototype.resizeToFullPage = function (fullscreen) {
        $('div.canvas[guid]:not(.active)').toggle(fullscreen);

        var j2d = this.parent;
        var scene = this;

        if (fullscreen) {
            scene.originalWidth = scene.width;
            scene.originalHeight = scene.height;

            scene.resize(j2d.device.width, j2d.device.height);
            scene.enableFullscreen = true;

            this.parent.element.width(j2d.device.width).height(j2d.device.height).css('margin', 0);
        } else {
            scene.resize(scene.originalWidth, scene.originalHeight);
            scene.enableFullscreen = false;

            this.parent.element.width(scene.originalWidth).height(scene.originalHeight).css('margin', scene.originalMargin);
        }
    };

    SceneManager.prototype.scaleToFullScreen = function (fullscreen) {
        $('div.canvas[guid]:not(.active)').toggle(fullscreen);

        var layer, i;
        if (fullscreen) {
            for (i in this.parent.layers.list) {
                if (this.parent.layers.list.hasOwnProperty(i)) {
                    layer = this.parent.layers.list[i].canvas;
                    layer.style.width = this.parent.device.width + 'px';
                    layer.style.height = this.parent.device.height + 'px';
                }
            }
            this.enableFullscreen = true;
            this.parent.element.width(this.parent.device.width).height(this.parent.device.height).css('margin', 0);
        } else {
            for (i in this.parent.layers.list) {
                if (this.parent.layers.list.hasOwnProperty(i)) {
                    layer = this.parent.layers.list[i].canvas;
                    layer.style.width = this.width + 'px';
                    layer.style.height = this.height + 'px';
                }
            }
            this.enableFullscreen = false;
            this.parent.element.width(this.width).height(this.height).css('margin', this.originalMargin);
        }
    };

    SceneManager.prototype.toggleFullScreen = function (j2d, data) {
        if (data === undefined) {
            data = {fullscreen: undefined};
        }
        if (!j2d.scene.enableFullscreen || data.fullscreen) {
            j2d.scene.fullScreen(true);
        } else {
            j2d.scene.fullScreen(false);
        }
    };

    // Устанавливает позицию для камеры
    SceneManager.prototype.setViewPosition = function (position) {
        this.parent.scene.viewport.x = position.x - Math.ceil(this.parent.scene.width / 2);
        this.parent.scene.viewport.y = position.y - Math.ceil(this.parent.scene.height / 2);
    };

    //! Движение "камеры" вслед за объектом
    SceneManager.prototype.setViewFocus = function (id, offset) {
        this.parent.scene.viewport.x = id.getPosition().x - Math.ceil(this.parent.scene.width / 2) + (offset ? offset.x : 0);
        this.parent.scene.viewport.y = id.getPosition().y - Math.ceil(this.parent.scene.height / 2) + (offset ? offset.y : 0);
    };

    //! Движение "камеры"
    SceneManager.prototype.viewMove = function (position) {
        this.parent.scene.viewport.x += position.x;
        this.parent.scene.viewport.y += position.y;
    };

    //! Очистка отрисованного предыдущего кадра сцены
    SceneManager.prototype.clear = function () {
        this.getLayer().clear();
    };

    SceneManager.prototype.getLayer = function () {
        return this.parent.layers.getLayer('sceneNode');
    };

    // инициализация сцены
    SceneManager.prototype.init = function (width, heigth) {
        var j2d = this.parent;
        j2d.element.trigger('beforeInit');

        this.width = this.originalWidth = width;
        this.height = this.originalHeight = heigth;
        this.originalMargin = j2d.element.css('margin');

        this.parent.element.width(width).height(heigth);

        j2d.layers.add('sceneNode', 0);

        this.context = j2d.layers.getLayer('sceneNode').context;
        this.canvas = j2d.layers.getLayer('sceneNode').canvas;
        this.visible = true;

        this.cancelClear = false;

        /* Вид "камеры" */
        this.viewport = j2d.vector.v2f(0, 0);

        j2d.element.trigger('afterInit');

        $(window).ready(function () {
            for (var i in j2d.layers.list) {
                if (j2d.layers.list.hasOwnProperty(i)) {
                    j2d.element.append(j2d.layers.getLayer(i).canvas);
                }
            }
            j2d.options.ready = true;
            j2d.element.trigger('ready');
        });
    };

    if (global.J2D !== undefined) global.SceneManager = SceneManager;
    return SceneManager;
}));