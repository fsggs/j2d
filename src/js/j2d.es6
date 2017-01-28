import Engine from "api/Engine";
import IEngineComponent from "api/interfaces/IEngineComponent";
import InvalidArgumentException from "exceptions/InvalidArgumentException";
import EventHandler from "events/EventHandler";
import InputHandler from "io/InputHandler";
import FrameHandler from "core/FrameHandler";
import SceneHandler from "core/SceneHandler";
import Device from "utils/Device";
import ObjectUtil from "utils/ObjectUtil";
import SystemConsole from "utils/SystemConsole";
import UUID from "utils/UUID";
import LayersHandler from "layers/LayersHandler";
import ViewportHandler from "core/ViewportHandler";

/**
 * @class EngineJ2D
 * @exports module:"j2d"
 *
 * @param {Element|HTMLElement|HTMLInputElement} element
 * @param {EngineJ2D.defaults|{}} data
 *
 * @constructor
 */
export default class EngineJ2D extends Engine {
    /** @type {string} */
    static VERSION = '1.0.0-dev (VeNoM iNjecTioN)';

    /** @type {boolean} */
    static PluginInit = false;

    /** @type {{id: string, pause: boolean, components: {
        * EventHandler: IEngineComponent|EngineComponent|EventHandler,
        * FrameHandler: IEngineComponent|EngineComponent|FrameHandler,
        * InputHandler: IEngineComponent|EngineComponent|InputHandler,
        * MediaHandler: IEngineComponent,
        * TweenHandler: IEngineComponent,
        * SceneHandler: IEngineComponent|EngineComponent|SceneHandler
        * }}}
     */
    static defaults = {
        id: '',
        pause: false,
        components: {
            EventHandler: null,
            FrameHandler: null,
            InputHandler: null,
            MediaHandler: null,
            TweenHandler: null,
            SceneHandler: null
        }
    };

    /** @type {Array.<EngineJ2D>|string} */
    static stack = [];

    /** @type jQuery|function */
    static _jQuery;

    /** @type boolean */
    _initialized = false;

    /** @type {Element|HTMLElement|HTMLInputElement} */
    _element = null;

    /** @type {EngineJ2D.defaults|{}} */
    _data = {};

    /** @type {function|null} */
    _state = null;

    /** @type {Device} */
    device = new Device();

    /** @type {SystemConsole} */
    logger = new SystemConsole();

    constructor(element, data) {
        super(data !== undefined ? data.id : null);

        this._element = element;
        this._data = data;

        this.log(this._data.components);
    }

    get guid() {
        return this._data.id;
    }

    set state(state) {
        return this._state = state;
    }

    /* +Handlers */

    get events() {
        return this.EventHandler;
    }

    get EventHandler() {
        return this._data.components.EventHandler;
    }

    set EventHandler(handler) {
        if (!handler.instanceOf(IEngineComponent))
            throw new InvalidArgumentException('Handler not implements IEngineComponent');
        return this._data.components.EventHandler = handler;
    }

    get frame() {
        return this.FrameHandler;
    }

    get FrameHandler() {
        return this._data.components.FrameHandler;
    }

    set FrameHandler(handler) {
        if (!handler.instanceOf(IEngineComponent))
            throw new InvalidArgumentException('Handler not implements IEngineComponent');
        return this._data.components.FrameHandler = handler;
    }

    get io() {
        return this.InputHandler;
    }

    get InputHandler() {
        return this._data.components.InputHandler;
    }

    set InputHandler(handler) {
        if (!handler.instanceOf(IEngineComponent))
            throw new InvalidArgumentException('Handler not implements IEngineComponent');
        return this._data.components.InputHandler = handler;
    }

    get media() {
        return this.MediaHandler;
    }

    get MediaHandler() {
        return this._data.components.MediaHandler;
    }

    set MediaHandler(handler) {
        if (!handler.instanceOf(IEngineComponent))
            throw new InvalidArgumentException('Handler not implements IEngineComponent');
        return this._data.components.MediaHandler = handler;
    }

    get tweens() {
        return this.TweenHandler;
    }

    get TweenHandler() {
        return this._data.components.TweenHandler;
    }

    set TweenHandler(handler) {
        if (!handler.instanceOf(IEngineComponent))
            throw new InvalidArgumentException('Handler not implements IEngineComponent');
        return this._data.components.TweenHandler = handler;
    }

    get scene() {
        return this.SceneHandler;
    }

    get SceneHandler() {
        return this._data.components.SceneHandler;
    }

    set SceneHandler(handler) {
        if (!handler.instanceOf(IEngineComponent))
            throw new InvalidArgumentException('Handler not implements IEngineComponent');
        return this._data.components.SceneHandler = handler;
    }

    /* -Handlers */

    /* +GameEngine */

    start() {
        if (!this._initialized) this.tryLoadComponents();
        this.enable();

        this.frame.start(this);
        this.events.trigger('start');
    };

    stop() {
        if (!this._initialized) this.tryLoadComponents();
        this.disable();

        this.frame.stop(this);
        this.events.trigger('stop');
    };

    // TODO:: add MediaManager
    pause() {
        if (!this._initialized) this.tryLoadComponents();

        if (this.io) this.io.flush();
        this._data.pause = true;
        this._element.classList.add('pause');
        this.events.trigger('pause');
    };

    // TODO:: add MediaManager
    resume() {
        if (!this._initialized) this.tryLoadComponents();

        this._element.classList.remove('pause');
        this._element.focus();
        this._data.pause = false;
        if (this.io) this.io.flush();
        this.events.trigger('resume');
    };

    update(timestamp) {
        if (this._state) this._state.bind(this, timestamp)();
    }

    /* -GameEngine **/

    /* +System **/

    log(message, level) {
        this.logger.log(message, level);
    };

    tryLoadComponents() {
        if (this._initialized) return;
        // EventHandler
        if (this.EventHandler === null) {
            this.EventHandler = new EventHandler();
        }
        this.EventHandler.enable();

        // InputHandler
        if (this.InputHandler === null) {
            this.InputHandler = new InputHandler();
            this.InputHandler.init(this.EventHandler, [
                InputHandler.IO.KEYBOARD,
                InputHandler.IO.MOUSE
            ], {
                cursor: 'default'
            });
        }
        this.InputHandler.enable();

        // SceneHandler
        if (this.SceneHandler === null) {
            this.SceneHandler = new SceneHandler();
            this.SceneHandler.init(this.EventHandler, this, {
                width: 640,
                height: 360,
                backgroundColor: 'black'
            });

            this.SceneHandler.LayersHandler = new LayersHandler();
            this.SceneHandler.LayersHandler.init(this.EventHandler);

            this.SceneHandler.ViewportHandler = new ViewportHandler();
            this.SceneHandler.ViewportHandler.init(this.EventHandler);
        }
        this.SceneHandler.LayersHandler.enable();
        this.SceneHandler.ViewportHandler.enable();
        this.SceneHandler.enable();

        // FrameHandler
        if (this.FrameHandler === null) {
            this.FrameHandler = FrameHandler.init();
            this.FrameHandler.init(this.EventHandler);
        }
        this.FrameHandler.enable();

        this._initialized = true;
    }

    /* -System **/

    /**
     * @name EngineJ2D
     * @static
     *
     * @param {string|jQuery} selected
     * @param {EngineJ2D.defaults|Object} options
     *
     * @returns {EngineJ2D|EngineJ2D[]|Array.<EngineJ2D>}
     */
    static init(selected, options) {
        if (selected === undefined) selected = '.j2d';
        if (options === undefined) options = {};

        options = ObjectUtil.extend(true, {}, EngineJ2D.defaults, options);

        let nodes = [];
        if (typeof selected === 'string') {
            nodes = window.document.querySelectorAll(selected);
        } else if (typeof selected === 'object' && window.jQuery !== undefined && selected instanceof window.jQuery) {
            nodes = selected.get();
        } else return null;

        let inactiveNodes = [];

        nodes.forEach(node => {
            if (!node.hasAttribute('guid')) inactiveNodes.push(node)
        });

        inactiveNodes.forEach((element) => {
            options.id = UUID.generate();

            element.setAttribute('guid', options.id);

            let id = element.getAttribute('id');
            if (id === undefined || id === null) {
                element.setAttribute('guid', options.id);
            }

            let tabIndex = element.getAttribute('tabindex');
            if (tabIndex === undefined || tabIndex === null || tabIndex === false) {
                element.setAttribute('tabindex', '-1');
            }

            if (!element.classList.contains('j2d')) {
                element.classList.add('j2d');
            }

            Engine._$classPreInitialize.push(options.id);
            EngineJ2D.stack[options.id] = new EngineJ2D(element, options);
            EngineJ2D.stack.push(options.id);

            element.click();
            element.focus();
        });

        let resumeBind = (current) => {
            let nodes, engine;
            nodes = window.document.querySelectorAll('div.canvas[guid]:not(.pause-disable):not(:focus)');
            Array.prototype.forEach.call(nodes, (node) => {
                if (current !== node) {
                    node.classList.remove('active');
                    engine = EngineJ2D.stack[node.getAttribute('guid')] || null;
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
            let engine;
            if (this.classList.contains('pause')) {
                engine = EngineJ2D.stack[this.getAttribute('guid')] || null;
                if (engine) engine.resume();
                resumeBind(this);
            } else if (!this.classList.contains('resume-by-click') && this.classList.contains(':focus')) {
                this.classList.add('active');
                this.focus();
                engine = EngineJ2D.stack[this.getAttribute('guid')] || null;
                if (engine) engine.resume();
                resumeBind(this);
            }
            return true;
        }

        let activeNodes = [];
        nodes = window.document.querySelectorAll('.j2d[guid]');
        Array.prototype.forEach.call(nodes, (node) => {
            activeNodes.push(EngineJ2D.stack[node.getAttribute('guid')] || null);
            node.addEventListener('click', resumeEventListener);
            node.addEventListener('touch', resumeEventListener);
            node.addEventListener('mouseenter', resumeEventListener);
        });
        return (1 === activeNodes.length) ? activeNodes[0] : activeNodes;
    }

    static ready(callback) {
        if (EngineJ2D.PluginInit) {
            if (EngineJ2D._jQuery) {
                EngineJ2D._jQuery(document).ready(callback);
            } else callback();
        } else {
            if (EngineJ2D._jQuery) {
                EngineJ2D._jQuery(document).on('j2d-ready', () => {
                    EngineJ2D._jQuery(document).ready(callback);
                });
            } else window.document.addEventListener('j2d-ready', callback);
        }
    }

    /**
     * @param {jQuery} jQuery
     * @return {jQuery}
     */
    static jQuery(jQuery) {
        EngineJ2D._jQuery = jQuery !== undefined ? jQuery : window.jQuery;

        (function ($) {
            //noinspection JSUnresolvedVariable
            /**
             * @param {EngineJ2D.defaults} [options]
             * @returns {EngineJ2D|Array.<EngineJ2D>}
             */
            $.fn.j2d = function (options) {
                /** @type {jQuery|EngineJ2D._jQuery} */
                let instance = this;
                return EngineJ2D.init(instance, options);
            };
        })(EngineJ2D._jQuery);

        return EngineJ2D._jQuery;
    }
}

/* ------------------------------ Plugin ------------------------------ */
(EngineJ2D.initPlugin = () => {
    if (EngineJ2D.PluginInit) return true;

    (new SystemConsole()).logSystem('j2D v.' + EngineJ2D.VERSION, 'https://github.com/fsggs/j2d');

    let firefox = window.navigator.userAgent.match(/Firefox\/([0-9]+)\./);
    let version = firefox ? parseInt(firefox[2], 10) : false;

    let isFullScreen = () => {
        //noinspection JSUnresolvedVariable
        return !!(window.document.webkitFullscreenElement
            || window.document.webkitCurrentFullScreenElement
            || (version && version < 47) ? window.document.mozFullScreenElement : window.document.fullscreenElement
                || window.document.msFullscreenElement
        );
    };

    function fullScreenEventListener() {
        let fullScreen = isFullScreen();
        if (!fullScreen) {
            let node, engine;
            node = window.document.querySelector('.j2d[guid].active');
            if (node) engine = EngineJ2D.stack[node.getAttribute('guid')] || null;
            if (engine) engine.scene.resizeToFullPage(fullScreen);

            node = window.document.querySelector('.j2d[guid]:not(.active)');
            if (node) engine = EngineJ2D.stack[node.getAttribute('guid')] || null;
            if (engine) engine.toggle(!fullScreen);
        }
    }

    let html = window.document.querySelector('html');

    if (!html.classList.contains('j2d-engine')) {
        window.document.addEventListener('fullscreenchange', fullScreenEventListener);
        window.document.addEventListener('webkitfullscreenchange', fullScreenEventListener);
        window.document.addEventListener('mozfullscreenchange', fullScreenEventListener);
        window.document.addEventListener('MSFullscreenChange', fullScreenEventListener);

        window.addEventListener('focus', () => {
            let node, engine;
            node = window.document.querySelector('.j2d[guid].active:not(.resume-by-click)');
            if (node) engine = EngineJ2D.stack[node.getAttribute('guid')] || null;
            if (engine) engine.resume();
        });

        window.addEventListener('blur', () => {
            let nodes, engine;
            nodes = window.document.querySelectorAll('.j2d[guid]:not(.pause-disable)');
            nodes.forEach(node => {
                if (node) engine = EngineJ2D.stack[node.getAttribute('guid')] || null;
                if (engine) engine.pause();
            });
        });

        window.addEventListener('resize', () => {
            EngineJ2D.stack.forEach(guid => {
                EngineJ2D.stack[guid].device.onResize();
            });

            let fullScreen = isFullScreen();
            if (fullScreen) {
                let node, engine;
                node = window.document.querySelector('.j2d[guid].active');
                if (node) engine = EngineJ2D.stack[node.getAttribute('guid')] || null;
                if (engine) engine.scene.resizeToFullPage(fullScreen);
            }
            return true;
        });
        html.classList.add('j2d-engine');
    }

    window.document.dispatchEvent((new CustomEvent('j2d-ready')));

    return EngineJ2D.PluginInit = true;
})();
