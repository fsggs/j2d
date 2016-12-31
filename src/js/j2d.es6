import IEngine from "api/interfaces/IEngine";
import EngineComponent from "api/EngineComponent";
import ObjectUtil from "utils/ObjectUtil";
import UUID from "utils/UUID";
import DeviceUtil from "utils/DeviceUtil";
import ArrayMap from "utils/ArrayMap";
import SceneManager from "core/SceneManager";
import Log from "utils/SystemConsole"

/*
 * TODO:: Events System
 */

/**
 * @class EngineJ2D
 * @exports module:"j2d"
 *
 * @param {Element} element
 * @param {EngineJ2D.defaults} data
 *
 * @constructor
 * @property {boolean} WebGL // TODO:: To scene
 * @property {boolean} smoothing // TODO:: To scene
 * @property {InputManager|null} io
 * @property {MediaManager|null} media
 * @property {boolean} isPlay
 */
export default class EngineJ2D extends EngineComponent {
    static interfaces = [IEngine];

    static VERSION = '1.0.0-dev (VeNoM iNjecTioN)';

    static defaults = {
        /** @type string|null */
        id: null,
        io: null,
        media: null,
        deltaTime: 0,
        pause: false,
        ready: false,

        frameLimit: 60,
        smoothing: true,

        webGL: false
    };

    /**
     * @type {Array.<EngineJ2D>|ArrayMap.<EngineJ2D>}
     */
    static stack = new ArrayMap();

    constructor(element, data) {
        super();

        /** @type {Element} */
        this.element = element;

        /** @type EngineJ2D.defaults */
        this.data = data;

        /** @type DeviceUtil */
        this.device = new DeviceUtil();

        /** @type SceneManager */
        this.scene = new SceneManager(this);

        /** @type SystemConsole */
        this.Log = new Log();
    }

    get WebGL() {
        return this.data.webGL;
    }

    set WebGL(value) {
        this.data.webGL = !!value;
        if (!!value && !this.data.webGL) {
            this.element.classList.add('WebGL');
        } else if (!value && this.data.webGL) {
            this.element.classList.remove('WebGL');
        }
    }

    get smoothing() {
        return this.data.smoothing;
    }

    set smoothing(value) {
        this.data.smoothing = !!value;
    }

    get io() {
        return this.data.io;
    }

    set io(value) {
        return this.data.io = value
    }

    get media() {
        return this.data.media;
    }

    set media(value) {
        return this.data.media = value
    }

    get isPlay() {
        return !this.data.pause;
    }

    /** +GameEngine **/
    start() {
        this.scene.start();
        this.trigger('start');
    };

    stop() {
        this.scene.stop();
        this.trigger('stop');
    };

    // TODO:: add MediaManager
    pause() {
        if (this.data.io) this.data.io.flush();
        this.data.pause = true;
        this.element.classList.add('pause');
        this.trigger('pause');
    };

    // TODO:: add MediaManager
    resume() {
        this.element.classList.remove('pause');
        this.element.focus();
        this.data.pause = false;
        if (this.data.io) this.data.io.flush();
        this.trigger('resume');
    };

    /** -GameEngine **/

    /** @returns {SceneManager} */
    getSceneManager() {
        return this.scene;
    };

    /** @returns {LayersManager} */
    getLayersManager() {
        return this.scene.layersManager;
    };

    /** @returns {FrameManager} */
    getFrameManager() {
        return this.scene.frameManager;
    };

    /** @returns {ViewportManager} */
    getViewportManager() {
        return this.scene.viewportManager;
    };

    /** @returns {GameStatesManager} */
    getGameStatesManager() {
        return this.scene.gameStatesManager;
    };

    on() {
    };

    once() {
    };

    off() {
    };

    trigger() {
    };

    log(message, level) {
        this.Log.log(message, level);
    };

    /**
     * @name EngineJ2D
     * @static
     *
     * @param {string|window.jQuery} selected
     * @param {EngineJ2D.defaults|Object} options
     *
     * @returns {EngineJ2D|EngineJ2D[]|Array.<EngineJ2D>}
     */
    static initEngine(selected, options) {
        var nodes = [];
        if (typeof selected === 'string') {
            nodes = window.document.querySelectorAll(selected);
        } else if (typeof selected === 'object' && window.jQuery !== undefined && selected instanceof window.jQuery) {
            nodes = selected.get();
        } else return null;

        var inactiveNodes = [];
        Array.prototype.forEach.call(nodes, (node) => {
            if (!node.hasAttribute('guid')) inactiveNodes.push(node)
        });

        inactiveNodes.forEach((element) => {
            var options = ObjectUtil.extend(true, {}, EngineJ2D.defaults, options);
            options.id = UUID.generate();

            element.setAttribute('guid', options.id);

            var id = element.getAttribute('id');
            if (id === undefined || id === null) {
                element.setAttribute('guid', options.id);
            }

            var tabIndex = element.getAttribute('tabindex');
            if (tabIndex === undefined || tabIndex === null || tabIndex === false) {
                element.setAttribute('tabindex', '-1');
            }

            if (!element.classList.contains('j2d')) {
                element.classList.add('j2d');
            }

            EngineJ2D.stack.add(options.id, new EngineJ2D(element, options));
            element.click();
            element.focus();
        });

        var resumeBind = (current) => {
            var nodes, engine;
            nodes = window.document.querySelectorAll('div.canvas[guid]:not(.pause-disable):not(:focus)');
            Array.prototype.forEach.call(nodes, (node) => {
                if (current !== node) {
                    node.classList.remove('active');
                    engine = EngineJ2D.stack.get(node.getAttribute('guid'));
                    if (engine) engine.pause();
                }
            });

            nodes = window.document.querySelectorAll('div.canvas[guid].active.pause-disable:not(:focus)');
            Array.prototype.forEach.call(nodes, (node) => {
                if (current !== node) {
                    node.classList.remove('active');
                }
            });
        };

        function resumeEventListener() {
            var engine;
            if (this.classList.contains('pause')) {
                engine = EngineJ2D.stack.get(this.getAttribute('guid'));
                if (engine) engine.resume();
                resumeBind(this);
            } else if (!this.classList.contains('resume-by-click') && this.classList.contains(':focus')) {
                this.classList.add('active');
                this.focus();
                engine = EngineJ2D.stack.get(this.getAttribute('guid'));
                if (engine) engine.resume();
                resumeBind(this);
            }
            return true;
        }

        var activeNodes = [];
        nodes = window.document.querySelectorAll('.j2d[guid]');
        Array.prototype.forEach.call(nodes, (node) => {
            activeNodes.push(EngineJ2D.stack.get(node.getAttribute('guid')));
            node.addEventListener('click', resumeEventListener);
            node.addEventListener('touch', resumeEventListener);
            node.addEventListener('mouseenter', resumeEventListener);
        });
        return (1 === activeNodes.length) ? activeNodes[0] : activeNodes;
    };

    static util = {
        /**
         * @param {CanvasRenderingContext2D} context
         */
        disableSmoothing: (context) => {
            var chrome = window.navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./);
            var version = chrome ? parseInt(chrome[2], 10) : false;

            context['imageSmoothingEnabled'] = false;
            context['mozImageSmoothingEnabled'] = false;
            context['oImageSmoothingEnabled'] = false;
            if (version && version <= 29) {
                context['webkitImageSmoothingEnabled'] = false;
            }
            context['msImageSmoothingEnabled'] = false;
        }
    };

    /** Utils **/
    util = EngineJ2D.util;
    initEngine = EngineJ2D.initEngine;
}

/* ------------------------------ Plugin ------------------------------ */
(EngineJ2D.initPlugin = () => {
    if (window.j2dPlugin !== undefined) return null;
    window.j2dPlugin = {pluginInit: true, stack: new ArrayMap()};

    (new Log()).logSystem('j2D v.' + EngineJ2D.VERSION, 'https://github.com/fsggs/j2d');

    if (window.jQuery !== undefined) {
        /**
         * @param {EngineJ2D.defaults} [options]
         * @returns {EngineJ2D|EngineJ2D[]|Array.<EngineJ2D>}
         */
        window.jQuery.fn.j2d = (options) => {
            return EngineJ2D.initEngine(this, options);
        };
    }

    window.j2dPlugin.initEngine = EngineJ2D.initEngine;

    var firefox = window.navigator.userAgent.match(/Firefox\/([0-9]+)\./);
    var version = firefox ? parseInt(firefox[2], 10) : false;

    var isFullScreen = () => {
        //noinspection JSUnresolvedVariable
        return !!(window.document.webkitFullscreenElement
            || window.document.webkitCurrentFullScreenElement
            || (version && version < 47) ? window.document.mozFullScreenElement : window.document.fullscreenElement
            || window.document.msFullscreenElement
        );
    };

    function fullScreenEventListener() {
        var fullScreen = isFullScreen();
        if (!fullScreen) {
            var node, engine;
            node = window.document.querySelector('.j2d[guid].active');
            if (node) engine = EngineJ2D.stack.get(node.getAttribute('guid'));
            if (engine) engine.scene.resizeToFullPage(fullScreen);

            node = window.document.querySelector('.j2d[guid]:not(.active)');
            if (node) engine = EngineJ2D.stack.get(node.getAttribute('guid'));
            if (engine) engine.toggle(!fullScreen);
        }
    }

    var html = window.document.querySelector('html');

    if (!html.classList.contains('j2d')) {
        window.document.addEventListener('fullscreenchange', fullScreenEventListener);
        window.document.addEventListener('webkitfullscreenchange', fullScreenEventListener);
        window.document.addEventListener('mozfullscreenchange', fullScreenEventListener);
        window.document.addEventListener('MSFullscreenChange', fullScreenEventListener);

        window.addEventListener('focus', () => {
            var node, engine;
            node = window.document.querySelector('.j2d[guid].active:not(.resume-by-click)');
            if (node) engine = EngineJ2D.stack.get(node.getAttribute('guid'));
            if (engine) engine.resume();
        });

        window.addEventListener('blur', () => {
            var nodes, engine;
            nodes = window.document.querySelectorAll('.j2d[guid]:not(.pause-disable)');
            Array.prototype.forEach.call(nodes, (node) => {
                if (node) engine = EngineJ2D.stack.get(node.getAttribute('guid'));
                if (engine) engine.pause();
            });
        });

        window.addEventListener('resize', () => {
            EngineJ2D.stack.forEach((guid) => {
                EngineJ2D.stack[guid].device.onResize();
            });

            var fullScreen = isFullScreen();
            if (fullScreen) {
                var node, engine;
                node = window.document.querySelector('.j2d[guid].active');
                if (node) engine = EngineJ2D.stack.get(node.getAttribute('guid'));
                if (engine) engine.scene.resizeToFullPage(fullScreen);
            }
            return true;
        });
        html.classList.add('j2d');
    }
})();

