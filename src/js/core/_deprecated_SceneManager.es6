import ObjectUtil from "utils/ObjectUtil";
import Vector2d from "utils/Vector2d";
import FrameManager from "core/FrameManager";
import LayersManager from "core/LayersManager";
import ViewportManager from "core/ViewportManager";
import GameStatesManager from "core/GameStatesManager";

/**
 * @class SceneManager
 * @exports module:core/SceneManager
 *
 * @param {EngineJ2D} j2d
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
export default class SceneManager {
    static defaults = {
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

    constructor(j2d) {
        this.setGameCallback = this.setGameCallback.bind(this);
        this.start = this.start.bind(this);

        /** @type EngineJ2D */
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

        /** @type {GameStatesManager} */
        this.gameStatesManager = new GameStatesManager({}, this.setGameCallback);

        this.initLayers();
    }

    get backgroundColor() {
        return this.data.backgroundColor;
    }

    set backgroundColor(value) {
        this.data.backgroundColor = value;
        this.context.fillStyle = value;
        this.context.fillRect(0, 0, this.data.width, this.data.height);
    }

    get opacity() {
        return this.data.opacity;
    }

    set opacity(value) {
        this.data.opacity = value;
        this.canvas.style.opacity = value;
    }

    get visible() {
        return this.data.visible;
    }

    set visible(value) {
        this.data.visible = !!value;
        this.canvas.style.display = (!!value) ? 'block' : 'none';
    }

    get zIndex() {
        return 1000 - this.data.zIndex;
    }

    set zIndex(value) {
        this.data.zIndex = 1000 + value;
        this.canvas.style.zIndex = 1000 + value;
    }

    get viewport() {
        return this.data.viewport;
    }

    /**
     * @param {BaseGameState} state
     * @returns {Function}
     */
    patchGameStateRender(state) {
        var sceneManager = this;
        var constructor = state.constructor;
        if (typeof constructor === 'function' && constructor.prototype.render === undefined) {
            constructor.prototype.render = function (timestamp, data) {
                sceneManager.clear().fillBackground().render(data);
                return true;
            };
        }
        return constructor;
    };

    /**
     * @param {SceneManager.defaults|Object|undefined} options
     * @returns {SceneManager}
     */
    init(options) {
        this.data = ObjectUtil.extend(true, {}, SceneManager.defaults, options);

        this.j2d.trigger('beforeInit');

        this.data.originalWidth = this.data.width;
        this.data.originalHeight = this.data.height;
        this.data.originalMargin = getComputedStyle(this.j2d.element)['margin'];

        this.j2d.element.style.width = this.data.width + 'px';
        this.j2d.element.style.height = this.data.height + 'px';

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
    }

    /**
     * @returns {SceneManager}
     */
    initLayers() {
        if (!this.layersManager.getLayer('scene')) {
            this.layersManager.addLayer('scene', 0);
        }
        return this;
    }

    /**
     * @returns {SceneManager}
     */
    initCanvas() {
        if (document.querySelectorAll('.j2d[guid="' + this.j2d.data.id + '"] canvas').length === 0) {
            this.canvas = document.createElement('canvas');

            this.canvas.width = this.data.width;
            this.canvas.height = this.data.height;
            this.canvas.style.zIndex = this.data.zIndex;
            this.canvas.style.position = this.data.position;

            this.canvas.style.left = this.data.left;
            this.canvas.style.top = this.data.top;

            if (this.j2d.data.webGL) {
                //WebGL2D.enable(this.canvas);
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

            this.j2d.element.appendChild(this.canvas);
        }
        return this;
    }

    /**
     * @param {{x:number, y:number}|Vector2d} [pos]
     * @param {{x:number, y:number}|Vector2d} [size]
     * @returns {SceneManager}
     */
    clear(pos, size) {
        if (pos !== undefined && size !== undefined) {
            this.context.clearRect(pos.x - this.viewport.x, pos.y - this.viewport.y, size.x, size.y);
        } else {
            this.context.clearRect(0, 0, this.data.width, this.data.height);
        }
        return this;
    }

    /**
     * @param {number} width
     * @param {number} height
     * @returns {SceneManager}
     */
    resize(width, height) {
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
    }

    /**
     * TODO:: refactor this
     * @param {string} gameState
     * @returns {SceneManager}
     */
    setGameCallback(gameState) {
        var sceneManager = this;
        sceneManager.data.gameState = gameState || 'init_j2d';
        sceneManager.frameManager.stop(sceneManager.j2d.data.id);

        var gameConstructor = sceneManager.patchGameStateRender(
            sceneManager.gameStatesManager.getState(gameState)
        );

        var newGameState = new gameConstructor(sceneManager.gameStatesManager, {});
        newGameState.init({
            callback: function () {
                newGameState.load({
                    callback: function () {
                        sceneManager.frameManager.start(sceneManager.j2d.data.id, newGameState, {
                            j2d: sceneManager.j2d,
                            frameLimit: FrameHandler.frameLimit
                        });

                        sceneManager.j2d.trigger('changedGameState');

                        // TODO:: async unload?
                        sceneManager.gameStatesManager.getPreviousState().unload();
                    }
                });
            }
        });

        return this;
    }

    /**
     * @param {Function|callback} callback
     * @param {*} data
     * @returns {SceneManager}
     */
    async(callback, data) {
        setTimeout(callback.call(callback, data), 0);
        return this;
    }

    /**
     * @returns {SceneManager}
     */
    start() {
        var sceneManager = this;
        if (sceneManager.j2d.data.io) {
            sceneManager.j2d.data.io.init();
        }
        sceneManager.j2d.trigger('beforeStart');

        sceneManager.frameManager.stop(sceneManager.j2d.data.id);

        var gameConstructor = sceneManager.patchGameStateRender(
            sceneManager.gameStatesManager.getCurrent()
        );

        var newGameState = new gameConstructor(sceneManager.gameStatesManager, {});
        newGameState.init({
            callback: function () {
                newGameState.load({
                    callback: function () {
                        sceneManager.frameManager.start(sceneManager.j2d.data.id, newGameState, {
                            j2d: sceneManager.j2d,
                            frameLimit: FrameHandler.frameLimit
                        });

                        sceneManager.j2d.trigger('afterStart');
                    }
                });
            }
        });

        return sceneManager;
    }

    /**
     * @returns {SceneManager}
     */
    stop() {
        this.frameManager.stop(this.j2d.data.id);
        return this;
    }

    /**
     * @param {boolean} [fullscreen]
     * @returns {SceneManager}
     */
    fullScreen(fullscreen) {
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
    }

    /**
     * @param {boolean} [fullscreen]
     * @returns {SceneManager}
     */
    resizeToFullPage(fullscreen) {
        var j2d = this.j2d;
        var sceneManager = this;

        if (fullscreen) {
            sceneManager.data.originalWidth = sceneManager.data.width;
            sceneManager.data.originalHeight = sceneManager.data.height;

            sceneManager.resize(j2d.device.width, j2d.device.height);
            sceneManager.data.enableFullscreen = true;

            j2d.element.style.width = j2d.device.width + 'px';
            j2d.element.style.height = j2d.device.height + 'px';
            j2d.element.style.margin = 0;

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

            j2d.element.style.width = sceneManager.data.originalWidth + 'px';
            j2d.element.style.height = sceneManager.data.originalHeight + 'px';
            j2d.element.style.margin = sceneManager.data.originalMargin;

            sceneManager.viewportManager.setScreen({
                x: sceneManager.data.originalWidth,
                y: sceneManager.data.originalHeight
            }).setOffset({
                x: 0,
                y: 0
            });
        }
        return this;
    }

    /**
     * @param {EngineJ2D} j2d
     * @param {{fullscreen: boolean}} data
     * @returns {SceneManager}
     */
    toggleFullScreen(j2d, data) {
        if (data === undefined) {
            data = {fullscreen: false};
        }
        if (!j2d.scene.enableFullscreen || data.fullscreen) {
            j2d.scene.fullScreen(true);
        } else {
            j2d.scene.fullScreen(false);
        }
        return this;
    }

    /**
     * @returns {CollectionNode|null}
     */
    getSceneLayer() {
        return this.layersManager.getLayer('scene');
    }

    /**
     * @returns {SceneManager}
     */
    fillBackground() {
        if (this.data.backgroundColor) {
            this.backgroundColor = this.data.backgroundColor;
        }
        return this;
    }

    /**
     * @param {Object} data
     * @returns {SceneManager}
     */
    render(data) {
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
    }

    /**
     * @param {BaseNode} node
     * @param {string} [key]
     * @returns {SceneManager}
     */
    add(node, key) {
        if (this.layersManager.globalCollection.has('scene')) {
            this.layersManager.globalCollection.get('scene').add(node, key);
        }
        return this;
    }

    /**
     * @param {BaseNode} [node]
     * @param {string} [key]
     * @returns {SceneManager}
     */
    remove(node, key) {
        if (this.layersManager.globalCollection.has('scene')) {
            this.layersManager.globalCollection.get('scene').remove(node, key);
        }
        return this;
    }

    /**
     * @param {CameraNode} node
     * @returns {SceneManager}
     */
    registerCamera(node) {
        this.viewportManager.addCamera(node.data.id, node);
        return this;
    }

    /**
     * Hack to mode without Cameras
     * @returns {SceneManager}
     */
    _updateNoCamerasViewport(scene) {
        // This hack use deprecated method, i known.
        scene.viewportManager.setViewport(
            new Vector2d(0, 0),
            new Vector2d(scene.data.width, scene.data.height)
        );

        return scene;
    }

    /**
     * @param {CameraNode} [node]
     * @returns {SceneManager}
     */
    updateViewport(node) {
        if (node === undefined) return this._updateNoCamerasViewport(this);
        this.viewportManager.updateViewport(node.data.id);
        return this;
    }


    // static util = {
    //     /**
    //      * @param {CanvasRenderingContext2D} context
    //      */
    //     disableSmoothing: (context) => {
    //         let chrome = window.navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./);
    //         let version = chrome ? parseInt(chrome[2], 10) : false;
    //
    //         context['imageSmoothingEnabled'] = false;
    //         context['mozImageSmoothingEnabled'] = false;
    //         context['oImageSmoothingEnabled'] = false;
    //         if (version && version <= 29) {
    //             context['webkitImageSmoothingEnabled'] = false;
    //         }
    //         context['msImageSmoothingEnabled'] = false;
    //     }
    // };

    // /** Utils **/
    //util = EngineJ2D.util;
}
