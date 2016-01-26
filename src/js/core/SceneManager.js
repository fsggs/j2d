/**
 * J2D (jQuery Canvas Graphic Engine plugin)
 *
 * @authors DeVinterX, Skaner(j2Ds)
 * @license BSD
 * @version 0.2.0-dev
 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('core/SceneManager', ['jquery'], factory);
    } else if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = factory(require('jquery'));
    } else {
        factory(root.jQuery);
    }
}(typeof window !== 'undefined' ? window : global, function ($) {
    "use strict";

    var WebGL2D;

    var defaults = {
        width: 0,
        height: 0,

        originalWidth: 0,
        originalHeight: 0,
        originalMargin: 0,

        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 1000,
        opacity: 1.0,
        backgroundColor: false,

        frameLimit: 60,

        enableFullScreen: false
    };

    var SceneManager = function (j2d, WebGL_API) {
        var sceneManager = this;
        this.j2d = j2d;

        this.canvas = null;
        this.context = null;

        WebGL2D = WebGL_API;

        Object.defineProperty(this, "backgroundColor", {
            get: function () {
                return sceneManager.data.backgroundColor;
            },
            set: function (value) {
                sceneManager.data.backgroundColor = value;
                sceneManager.context.fillStyle = value;
                sceneManager.context.fillRect(0, 0, sceneManager.data.width, sceneManager.data.height);
            }
        });

        Object.defineProperty(this, "opacity", {
            get: function () {
                return sceneManager.data.opacity;
            },
            set: function (value) {
                sceneManager.data.opacity = value;
                sceneManager.canvas.style.opacity = value;
            }
        });

        //this.enableFullscreen = false;
        //this.layerName = 'sceneNode';
        //this.layers = (parent.layers) ? parent.layers : {};
    };

    SceneManager.prototype.init = function (options) {
        this.data = $.extend(true, {}, defaults, options);

        this.j2d.trigger('beforeInit');

        this.data.originalWidth = this.data.width;
        this.data.originalHeight = this.data.height;
        this.data.originalMargin = this.j2d.element.css('margin');

        this.j2d.element.width(this.data.width).height(this.data.height);

        this.initCanvas();

        this.j2d.trigger('afterInit');

        return this;
    };

    SceneManager.prototype.initCanvas = function () {
        this.canvas = document.createElement('canvas');

        this.canvas.width = this.data.width;
        this.canvas.height = this.data.height;
        this.canvas.style.zIndex = this.data.zIndex;
        this.canvas.style.position = this.data.position;

        this.canvas.style.left = this.data.left;
        this.canvas.style.top = this.data.top;

        if (this.j2d.data.webGL) {
            WebGL2D.enable(this.canvas);
            this.context = this.canvas.getContext('WebGL-2d');
        } else {
            this.context = this.canvas.getContext('2d');
        }

        if (!this.j2d.data.smoothing) {
            this.j2d.util.disableSmoothing(this.context);
        }

        this.context.shadowColor = 'rgba(0,0,0,0)';
        if (this.data.backgroundColor) this.backgroundColor = this.data.backgroundColor;
        if (this.data.opacity) this.opacity = this.data.opacity;

        this.j2d.element.append(this.canvas);
    };

    SceneManager.prototype.start = function () {

        return this;
    };

    SceneManager.prototype.setGameState = function (gameState) {
        this.j2d.setGameState(gameState);
        return this;
    };

    //SceneManager.prototype.resize = function (width, height) {
    //    var j2d = this.parent;
    //
    //    this.width = width;
    //    this.height = height;
    //
    //    for (var i in j2d.layers.list) {
    //        if (j2d.layers.list.hasOwnProperty(i)) {
    //            j2d.layers.list[i].resize(width, height);
    //        }
    //    }
    //};
    //
    //SceneManager.prototype.async = function (callback, data) {
    //    setTimeout(callback.call(callback, data), 0);
    //};
    //
    //SceneManager.prototype.setGameState = function (engine) {
    //    this.parent.setEngine(engine);
    //    this.parent.element.trigger('changedGameState');
    //};
    //
    //SceneManager.prototype.start = function (engine, frameLimit) {
    //    if (this.parent.options.io) {
    //        this.parent.options.io.init();
    //    }
    //    this.parent.element.trigger('beforeStart');
    //    this.parent.start(engine, frameLimit);
    //    this.parent.element.trigger('afterStart');
    //};

    //SceneManager.prototype.fullScreen = function (fullscreen) {
    //    var element = document.getElementById(this.parent.element.attr('id'));
    //
    //    if (undefined === element.requestFullscreen) {
    //        element.requestFullscreen = element.webkitRequestFullscreen
    //            || element.webkitRequestFullScreen
    //            || element.mozRequestFullScreen
    //            || element.msRequestFullscreen;
    //    }
    //
    //    if (undefined === document.exitFullscreen) {
    //        document.exitFullscreen = document.webkitExitFullscreen
    //            || document.webkitCancelFullScreen
    //            || document.mozCancelFullScreen
    //            || document.msExitFullscreen;
    //    }
    //    if (fullscreen) {
    //        element.requestFullscreen();
    //    } else {
    //        document.exitFullscreen();
    //    }
    //};
    //
    //SceneManager.prototype.resizeToFullPage = function (fullscreen) {
    //    $('div.canvas[guid]:not(.active)').toggle(fullscreen);
    //
    //    var j2d = this.parent;
    //    var scene = this;
    //
    //    if (fullscreen) {
    //        scene.originalWidth = scene.width;
    //        scene.originalHeight = scene.height;
    //
    //        scene.resize(j2d.device.width, j2d.device.height);
    //        scene.enableFullscreen = true;
    //
    //        this.parent.element.width(j2d.device.width).height(j2d.device.height).css('margin', 0);
    //    } else {
    //        scene.resize(scene.originalWidth, scene.originalHeight);
    //        scene.enableFullscreen = false;
    //
    //        this.parent.element.width(scene.originalWidth).height(scene.originalHeight).css('margin', scene.originalMargin);
    //    }
    //};
    //
    //SceneManager.prototype.scaleToFullScreen = function (fullscreen) {
    //    $('div.canvas[guid]:not(.active)').toggle(fullscreen);
    //
    //    var layer, i;
    //    if (fullscreen) {
    //        for (i in this.parent.layers.list) {
    //            if (this.parent.layers.list.hasOwnProperty(i)) {
    //                layer = this.parent.layers.list[i].canvas;
    //                layer.style.width = this.parent.device.width + 'px';
    //                layer.style.height = this.parent.device.height + 'px';
    //            }
    //        }
    //        this.enableFullscreen = true;
    //        this.parent.element.width(this.parent.device.width).height(this.parent.device.height).css('margin', 0);
    //    } else {
    //        for (i in this.parent.layers.list) {
    //            if (this.parent.layers.list.hasOwnProperty(i)) {
    //                layer = this.parent.layers.list[i].canvas;
    //                layer.style.width = this.width + 'px';
    //                layer.style.height = this.height + 'px';
    //            }
    //        }
    //        this.enableFullscreen = false;
    //        this.parent.element.width(this.width).height(this.height).css('margin', this.originalMargin);
    //    }
    //};
    //
    //SceneManager.prototype.toggleFullScreen = function (j2d, data) {
    //    if (data === undefined) {
    //        data = {fullscreen: undefined};
    //    }
    //    if (!j2d.scene.enableFullscreen || data.fullscreen) {
    //        j2d.scene.fullScreen(true);
    //    } else {
    //        j2d.scene.fullScreen(false);
    //    }
    //};

    //// Устанавливает позицию для камеры
    //SceneManager.prototype.setViewPosition = function (position) {
    //    this.parent.scene.viewport.x = position.x - Math.ceil(this.parent.scene.width / 2);
    //    this.parent.scene.viewport.y = position.y - Math.ceil(this.parent.scene.height / 2);
    //};
    //
    ////! Движение "камеры" вслед за объектом
    //SceneManager.prototype.setViewFocus = function (id, offset) {
    //    this.parent.scene.viewport.x = id.getPosition().x - Math.ceil(this.parent.scene.width / 2) + (offset ? offset.x : 0);
    //    this.parent.scene.viewport.y = id.getPosition().y - Math.ceil(this.parent.scene.height / 2) + (offset ? offset.y : 0);
    //};
    //
    ////! Движение "камеры"
    //SceneManager.prototype.viewMove = function (position) {
    //    this.parent.scene.viewport.x += position.x;
    //    this.parent.scene.viewport.y += position.y;
    //};

    //! Очистка отрисованного предыдущего кадра сцены
    //SceneManager.prototype.clear = function () {
    //    this.getLayer().clear();
    //};

    //SceneManager.prototype.getLayer = function () {
    //    return this.parent.layers.getLayer('sceneNode');
    //};

    //// инициализация сцены
    //SceneManager.prototype.init = function (width, heigth) {
    //    var j2d = this.parent;
    //    j2d.element.trigger('beforeInit');
    //
    //    this.width = this.originalWidth = width;
    //    this.height = this.originalHeight = heigth;
    //    this.originalMargin = j2d.element.css('margin');
    //
    //    this.parent.element.width(width).height(heigth);
    //
    //    j2d.layers.add('sceneNode', 0);
    //
    //    this.context = j2d.layers.getLayer('sceneNode').context;
    //    this.canvas = j2d.layers.getLayer('sceneNode').canvas;
    //    this.visible = true;
    //
    //    this.cancelClear = false;
    //
    //    /* Вид "камеры" */
    //    this.viewport = j2d.vector.v2f(0, 0);
    //
    //    j2d.element.trigger('afterInit');
    //
    //    $(window).ready(function () {
    //        for (var i in j2d.layers.list) {
    //            if (j2d.layers.list.hasOwnProperty(i)) {
    //                j2d.element.append(j2d.layers.getLayer(i).canvas);
    //            }
    //        }
    //        j2d.options.ready = true;
    //        j2d.element.trigger('ready');
    //    });
    //};

    if (global.J2D !== undefined) global.SceneManager = SceneManager;
    return SceneManager;
}));