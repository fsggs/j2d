/**
 * J2D (jQuery Canvas Graphic Engine plugin)
 *
 * @authors DeVinterX, Skaner(j2Ds)
 * @license BSD
 * @version 0.2.0-dev
 */

/*
 * TODO:: GameStateManager to Scene
 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('core/SceneManager', [
            'jquery',
            'core/WebGL2D',
            'core/FrameManager',
            'core/LayersManager'
        ], factory);
    } else if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = factory(
            require('jquery'),
            require('core/WebGL2D'),
            require('core/FrameManager'),
            require('core/LayersManager')
        );
    } else {
        factory(
            root.jQuery,
            root.WebGL2D,
            root.FrameManager,
            root.LayersManager
        );
    }
}(typeof window !== 'undefined' ? window : global, function ($, WebGL2D, FrameManager, LayersManager) {
    "use strict";

    var SceneManager = function (j2d) {
        var sceneManager = this;
        this.j2d = j2d;

        this.canvas = null;
        this.context = null;

        /** @type {FrameManager} */
        this.frameManager = FrameManager.Init();
        this.layersManager = new LayersManager();

        this.initLayers();

        Object.defineProperty(this, 'backgroundColor', {
            get: function () {
                return sceneManager.data.backgroundColor;
            },
            set: function (value) {
                sceneManager.data.backgroundColor = value;
                sceneManager.context.fillStyle = value;
                sceneManager.context.fillRect(0, 0, sceneManager.data.width, sceneManager.data.height);
            }
        });

        Object.defineProperty(this, 'opacity', {
            get: function () {
                return sceneManager.data.opacity;
            },
            set: function (value) {
                sceneManager.data.opacity = value;
                sceneManager.canvas.style.opacity = value;
            }
        });

        Object.defineProperty(this, 'visible', {
            get: function () {
                return sceneManager.data.visible;
            },
            set: function (value) {
                sceneManager.data.visible = !!value;
                sceneManager.canvas.style.display = (!!value) ? 'block' : 'none';
            }
        });

        Object.defineProperty(this, 'zIndex', {
            get: function () {
                return 1000 - sceneManager.data.zIndex;
            },
            set: function (value) {
                sceneManager.data.zIndex = 1000 + value;
                sceneManager.canvas.style.zIndex = 1000 + value;
            }
        });

        Object.defineProperty(this, 'viewport', {
            get: function () {
                return sceneManager.data.viewport;
            },
            set: function () {
            }
        });
    };

    SceneManager.defaults = {
        width: 0,
        height: 0,

        originalWidth: 0,
        originalHeight: 0,
        originalMargin: 0,

        visible: true,
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 1000,
        opacity: 1.0,
        backgroundColor: false,

        frameLimit: 60,

        enableFullScreen: false,

        viewport: {x: 0, y: 0},

        gameState: function () {
            this.id = 'DefaultGameState';
        }
    };

    SceneManager.prototype.fixGameStateRender = function () {
        var sceneManager = this;
        if (typeof this.data.gameState === 'function' && this.data.gameState.prototype.render === undefined) {
            this.data.gameState.prototype.render = function (timestamp, data) {
                sceneManager.clear().fillBackground().render(data);
            };
        }
        return this;
    };

    SceneManager.prototype.init = function (options) {
        this.data = $.extend(true, {}, SceneManager.defaults, options);

        this.j2d.trigger('beforeInit');

        this.data.originalWidth = this.data.width;
        this.data.originalHeight = this.data.height;
        this.data.originalMargin = this.j2d.element.css('margin');

        this.j2d.element.width(this.data.width).height(this.data.height);

        this.initCanvas();

        this.j2d.trigger('afterInit');

        return this;
    };

    SceneManager.prototype.initLayers = function () {
        if (!this.layersManager.getLayer('scene')) {
            this.layersManager.addLayer('scene', 0);
        }
        return this;
    };

    SceneManager.prototype.initCanvas = function () {
        if ($(this.j2d.element.selector + ' canvas').length === 0) {
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
            if (this.data.visible) this.visible = this.data.visible;
            if (this.data.zIndex) this.zIndex = 1000 - this.data.zIndex;

            this.j2d.element.append(this.canvas);
        }
        return this;
    };

    SceneManager.prototype.clear = function (pos, size) {
        if (pos !== undefined && size !== undefined) {
            this.context.clearRect(pos.x - this.viewport.x, pos.y - this.viewport.y, size.x, size.y);
        } else {
            this.context.clearRect(0, 0, this.data.width, this.data.height);
        }
        return this;
    };

    SceneManager.prototype.resize = function (width, height) {
        this.canvas.width = this.data.width = width;
        this.canvas.height = this.data.height = height;

        if (this.data.backgroundColor) {
            this.context.save();

            this.clear();
            this.backgroundColor = this.data.backgroundColor;

            this.context.restore();
        }
        if (!this.j2d.data.smoothing) {
            this.j2d.util.disableSmoothing(this.context);
        }
        return this;
    };

    SceneManager.prototype.setGameState = function (gameState) {
        this.data.gameState = gameState || function () {
                console.warn('Error in game state function!');
            };
        this.frameManager.stop(this.j2d.data.id);

        this.fixGameStateRender();
        this.frameManager.start(this.j2d.data.id, new this.data.gameState(), {
            j2d: this.j2d,
            frameLimit: this.data.frameLimit
        });

        this.j2d.trigger('changedGameState');
        return this;
    };

    SceneManager.prototype.async = function (callback, data) {
        setTimeout(callback.call(callback, data), 0);
        return this;
    };

    SceneManager.prototype.start = function () {
        if (this.j2d.data.io) {
            this.j2d.data.io.init();
        }
        this.j2d.trigger('beforeStart');

        this.frameManager.stop(this.j2d.data.id);

        this.fixGameStateRender();
        this.frameManager.start(this.j2d.data.id, new this.data.gameState(), {
            j2d: this.j2d,
            frameLimit: this.data.frameLimit
        });

        this.j2d.trigger('afterStart');
        return this;
    };

    SceneManager.prototype.stop = function () {
        this.frameManager.stop(this.j2d.data.id);
        return this;
    };

    SceneManager.prototype.fullScreen = function (fullscreen) {
        var element = document.getElementById(this.j2d.element.attr('id'));

        if (undefined === element.requestFullscreen) {
            //noinspection JSUnresolvedVariable
            element.requestFullscreen = element.webkitRequestFullscreen
                || element.webkitRequestFullScreen
                || element.mozRequestFullScreen
                || element.msRequestFullscreen;
        }

        if (undefined === document.exitFullscreen) {
            //noinspection JSUnresolvedVariable
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
        return this;
    };

    SceneManager.prototype.resizeToFullPage = function (fullscreen) {
        $('div.canvas[guid]:not(.active)').toggle(fullscreen);

        var j2d = this.j2d;
        var sceneManager = this;

        if (fullscreen) {
            sceneManager.data.originalWidth = sceneManager.data.width;
            sceneManager.data.originalHeight = sceneManager.data.height;

            sceneManager.resize(j2d.device.width, j2d.device.height);
            sceneManager.data.enableFullscreen = true;

            j2d.element
                .width(j2d.device.width)
                .height(j2d.device.height)
                .css('margin', 0);
        } else {
            sceneManager.resize(sceneManager.data.originalWidth, sceneManager.data.originalHeight);
            sceneManager.data.enableFullscreen = false;

            j2d.element
                .width(sceneManager.data.originalWidth)
                .height(sceneManager.data.originalHeight)
                .css('margin', sceneManager.data.originalMargin);
        }
        return this;
    };

    SceneManager.prototype.toggleFullScreen = function (j2d, data) {
        if (data === undefined) {
            data = {fullscreen: null};
        }
        if (!j2d.scene.enableFullscreen || data.fullscreen) {
            j2d.scene.fullScreen(true);
        } else {
            j2d.scene.fullScreen(false);
        }
        return this;
    };

    SceneManager.prototype.getSceneLayer = function () {
        return this.layersManager.getLayer('scene');
    };

    SceneManager.prototype.fillBackground = function () {
        if (this.data.backgroundColor) {
            this.backgroundColor = this.data.backgroundColor;
        }
        return this;
    };

    SceneManager.prototype.render = function (data) {
        var sceneManager = this;
        sceneManager.layersManager.layers.forEach(function (value, index) {
            sceneManager.layersManager.layers[index].render(
                sceneManager.context,
                sceneManager.data.viewport,
                sceneManager.layersManager.globalCollection,
                data || {}
            );
        });
        return this;
    };

    SceneManager.prototype.add = function (node, key) {
        if (this.layersManager.globalCollection['scene'] !== undefined) {
            this.layersManager.globalCollection['scene'].add(node, key);
        }
        return this;
    };

    SceneManager.prototype.remove = function (node, key) {
        if (this.layersManager.globalCollection['scene'] !== undefined) {
            this.layersManager.globalCollection['scene'].remove(node, key);
        }
        return this;
    };

    if (global.J2D !== undefined) global.SceneManager = SceneManager;
    return SceneManager;
}));
