/**
 * J2D (jQuery Canvas Graphic Engine plugin)
 *
 * @authors DeVinterX, Skaner(j2Ds)
 * @license BSD
 * @version 0.2.0-dev
 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('core/SceneManager', [
            'jquery',
            'core/WebGL2D',
            'core/FrameManager',
            'core/ViewportManager',
            'core/LayersManager',
            'states/StatesManager'
        ], factory);
    } else if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = factory(
            require('jquery'),
            require('core/WebGL2D'),
            require('core/FrameManager'),
            require('core/ViewportManager'),
            require('core/LayersManager'),
            require('states/StatesManager')
        );
    } else {
        factory(
            root.jQuery,
            root.WebGL2D,
            root.j2d.core.FrameManager,
            root.j2d.core.ViewportManager,
            root.j2d.core.LayersManager,
            root.j2d.states.StatesManager
        );
    }
}(typeof window !== 'undefined' ? window : global, function ($, WebGL2D, FrameManager, ViewportManager, LayersManager, StatesManager) {
    "use strict";

    /**
     * @class SceneManager
     * @exports module:core/SceneManager
     *
     * @param {J2D} j2d
     * @constructor
     *
     * @property {SceneManager.defaults} data
     *
     * @property {string} backgroundColor
     * @property {number} opacity
     * @property {boolean} visible
     * @property {number} zIndex
     * @property {{x:number, y:number}} viewport
     */
    var SceneManager = function (j2d) {
        var sceneManager = this;

        this.setGameCallback = this.setGameCallback.bind(this);

        /** @type J2D */
        this.j2d = j2d;

        /** @type {HTMLCanvasElement} */
        this.canvas = null;

        /** @type {CanvasRenderingContext2D} */
        this.context = null;

        /** @type {FrameManager} */
        this.frameManager = FrameManager.Init();

        /** @type {LayersManager} */
        this.layersManager = new LayersManager();

        /** @type {ViewportManager} */
        this.viewportManager = new ViewportManager();

        /** @type {StatesManager} */
        this.statesManager = new StatesManager({}, this.setGameCallback);

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

        viewport: {x: 0, y: 0}
    };

    /**
     * @param {Function} constructor
     * @returns {Function}
     */
    SceneManager.prototype.patchGameStateRender = function (constructor) {
        var sceneManager = this;
        if (typeof constructor === 'function' && constructor.prototype.render === undefined) {
            constructor.prototype.render = function (timestamp, data) {
                sceneManager.clear().fillBackground().render(data);
            };
        }
        return constructor;
    };

    /**
     * @param {SceneManager.defaults|Object|undefined} options
     * @returns {SceneManager}
     */
    SceneManager.prototype.init = function (options) {
        this.data = $.extend(true, {}, SceneManager.defaults, options);

        this.j2d.trigger('beforeInit');

        this.data.originalWidth = this.data.width;
        this.data.originalHeight = this.data.height;
        this.data.originalMargin = this.j2d.element.css('margin');

        this.j2d.element.width(this.data.width).height(this.data.height);

        this.initCanvas();

        this.viewportManager.setScreen({
            x: this.data.width,
            y: this.data.height
        }).setDefaultViewport({
            offset: {
                x: 0.0,
                y: 0.0
            },
            size: {
                x: this.data.width,
                y: this.data.height
            },
            scale: 1.0,
            angle: 0.0
        });

        this.j2d.trigger('afterInit');

        return this;
    };

    /**
     * @returns {SceneManager}
     */
    SceneManager.prototype.initLayers = function () {
        if (!this.layersManager.getLayer('scene')) {
            this.layersManager.addLayer('scene', 0);
        }
        return this;
    };

    /**
     * @returns {SceneManager}
     */
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

    /**
     * @param {{x:number, y:number}|Vector2d} [pos]
     * @param {{x:number, y:number}|Vector2d} [size]
     * @returns {SceneManager}
     */
    SceneManager.prototype.clear = function (pos, size) {
        if (pos !== undefined && size !== undefined) {
            this.context.clearRect(pos.x - this.viewport.x, pos.y - this.viewport.y, size.x, size.y);
        } else {
            this.context.clearRect(0, 0, this.data.width, this.data.height);
        }
        return this;
    };

    /**
     * @param {number} width
     * @param {number} height
     * @returns {SceneManager}
     */
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

    /**
     * TODO:: refactor this
     * @param {string} gameState
     * @returns {SceneManager}
     */
    SceneManager.prototype.setGameCallback = function (gameState) {
        this.data.gameState = gameState || 'initJ2D';
        this.frameManager.stop(this.j2d.data.id);

        var gameConstructor = this.patchGameStateRender(
            this.statesManager.getState(gameState).constructor
        );
        
        var newGameState = new gameConstructor();
        newGameState.init(function() {
            newGameState.load(function() {
                this.frameManager.start(this.j2d.data.id, newGameState, {
                    j2d: this.j2d,
                    frameLimit: this.data.frameLimit
                });

                this.j2d.trigger('changedGameState');

                // TODO:: async unload?
                this.statesManager.getPreviousState().unload();
            }.bind(this));
        }.bind(this));

        return this;
    };

    /**
     * @param {Function|callback} callback
     * @param {*} data
     * @returns {SceneManager}
     */
    SceneManager.prototype.async = function (callback, data) {
        setTimeout(callback.call(callback, data), 0);
        return this;
    };

    /**
     * @returns {SceneManager}
     */
    SceneManager.prototype.start = function () {
        if (this.j2d.data.io) {
            this.j2d.data.io.init();
        }
        this.j2d.trigger('beforeStart');

        this.frameManager.stop(this.j2d.data.id);

        var gameConstructor = this.patchGameStateRender(
            this.statesManager.getCurrent().constructor
        );

        var newGameState = new gameConstructor();
        newGameState.init();
        newGameState.load();

        this.frameManager.start(this.j2d.data.id, newGameState, {
            j2d: this.j2d,
            frameLimit: this.data.frameLimit
        });

        this.j2d.trigger('afterStart');
        return this;
    };

    /**
     * @returns {SceneManager}
     */
    SceneManager.prototype.stop = function () {
        this.frameManager.stop(this.j2d.data.id);
        return this;
    };

    /**
     * @param {boolean} [fullscreen]
     * @returns {SceneManager}
     */
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

    /**
     * @param {boolean} [fullscreen]
     * @returns {SceneManager}
     */
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

            sceneManager.viewportManager.setScreen({
                x: j2d.device.width,
                y: j2d.device.height
            }).setOffset({
                x: -(j2d.device.width - sceneManager.data.originalWidth) / 2,
                y: -(j2d.device.height - sceneManager.data.originalHeight) / 2
            });
        } else {
            sceneManager.resize(sceneManager.data.originalWidth, sceneManager.data.originalHeight);
            sceneManager.data.enableFullscreen = false;

            j2d.element
                .width(sceneManager.data.originalWidth)
                .height(sceneManager.data.originalHeight)
                .css('margin', sceneManager.data.originalMargin);

            sceneManager.viewportManager.setScreen({
                x: sceneManager.data.originalWidth,
                y: sceneManager.data.originalHeight
            }).setOffset({
                x: 0,
                y: 0
            });
        }
        return this;
    };

    /**
     * @param {J2D} j2d
     * @param {{fullscreen: boolean}} data
     * @returns {SceneManager}
     */
    SceneManager.prototype.toggleFullScreen = function (j2d, data) {
        if (data === undefined) {
            data = {fullscreen: false};
        }
        if (!j2d.scene.enableFullscreen || data.fullscreen) {
            j2d.scene.fullScreen(true);
        } else {
            j2d.scene.fullScreen(false);
        }
        return this;
    };

    /**
     * @returns {CollectionNode|null}
     */
    SceneManager.prototype.getSceneLayer = function () {
        return this.layersManager.getLayer('scene');
    };

    /**
     * @returns {SceneManager}
     */
    SceneManager.prototype.fillBackground = function () {
        if (this.data.backgroundColor) {
            this.backgroundColor = this.data.backgroundColor;
        }
        return this;
    };

    /**
     * @param {Object} data
     * @returns {SceneManager}
     */
    SceneManager.prototype.render = function (data) {
        var sceneManager = this;
        sceneManager.layersManager.layers.forEach(function (value, index) {
            sceneManager.layersManager.layers[index].render(
                sceneManager.context,
                sceneManager.viewportManager.getViewport(),
                sceneManager.layersManager.globalCollection,
                data || {}
            );
        });
        return this;
    };

    /**
     * @param {BaseNode} node
     * @param {string} [key]
     * @returns {SceneManager}
     */
    SceneManager.prototype.add = function (node, key) {
        if (this.layersManager.globalCollection.has('scene')) {
            this.layersManager.globalCollection.get('scene').add(node, key);
        }
        return this;
    };

    /**
     * @param {BaseNode} [node]
     * @param {string} [key]
     * @returns {SceneManager}
     */
    SceneManager.prototype.remove = function (node, key) {
        if (this.layersManager.globalCollection.has('scene')) {
            this.layersManager.globalCollection.get('scene').remove(node, key);
        }
        return this;
    };

    /**
     * @param {CameraNode} node
     * @returns {SceneManager}
     */
    SceneManager.prototype.registerCamera = function (node) {
        this.viewportManager.addCamera(node.data.id, node);
        return this;
    };

    /**
     * Hack to mode without Cameras
     * @returns {SceneManager}
     */
    var updateNoCamerasViewport = function (scene) {
        // This hack use deprecated method, i known.
        scene.viewportManager.setViewport(
            new Vector2d(0, 0),
            new Vector2d(scene.data.width, scene.data.height)
        );

        return scene;
    };
    /**
     * @param {CameraNode} [node]
     * @returns {SceneManager}
     */
    SceneManager.prototype.updateViewport = function (node) {
        if (node === undefined) return updateNoCamerasViewport(this);
        this.viewportManager.updateViewport(node.data.id);
        return this;
    };

    if (typeof module === 'object' && typeof module.exports === 'object') module.exports.SceneManager = SceneManager;
    if (global.j2d === undefined) global.j2d.core.SceneManager = SceneManager;
    return SceneManager;
}));
