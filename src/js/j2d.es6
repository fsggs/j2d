import Engine from "api/Engine";
import IEngineComponent from "api/interfaces/IEngineComponent";
import InvalidArgumentException from "exceptions/InvalidArgumentException";
import EventHandler from "events/EventHandler";
import InputHandler from "io/InputHandler";
import FrameHandler from "core/FrameHandler";
import SceneHandler from "core/SceneHandler";
import Device from "utils/Device";
import SystemConsole from "utils/SystemConsole";
import UUID from "utils/UUID";
import LayersHandler from "layers/LayersHandler";
import ViewportHandler from "core/ViewportHandler";
import Mutable from "objects/Mutable";

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

    /**
     * Call setter to 'null/false' to disable components, or 'true' to auto load default implementation.
     *
     * @type {{id: string, pause: boolean, deltaTime: number, timestamp: number, components: {
        * EventHandler: IEngineComponent|EngineComponent|EventHandler|boolean|null,
        * FrameHandler: IEngineComponent|EngineComponent|FrameHandler|boolean|null,
        * InputHandler: IEngineComponent|EngineComponent|InputHandler|boolean|null,
        * MediaHandler: IEngineComponent|EngineComponent|boolean|null,
        * TweenHandler: IEngineComponent|EngineComponent|boolean|null,
        * SceneHandler: IEngineComponent|EngineComponent|SceneHandler|boolean|null
        * }}}
     */
    static defaults = {
        id: '',
        pause: false,
        deltaTime: 0,
        timestamp: 0,
        components: {
            EventHandler: true,
            FrameHandler: true,
            InputHandler: false,
            MediaHandler: false,
            TweenHandler: false,
            SceneHandler: true
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

    /** @type {function} */ // TODO:: temporary hack!
    update = (deltaTime, timestamp) => {
        // console.info(timestamp);
    };

    /** @type {function} */ // TODO:: temporary hack!
    render = (deltaTime, timestamp) => {
        if (this._data.components.SceneHandler) {
            this._data.components.SceneHandler.render(this._data);
        }
    };

    /** @type {Device} */
    device = new Device();

    /** @type {SystemConsole} */
    logger = new SystemConsole();

    constructor(element, data) {
        super(data !== undefined ? data.id : null);

        this._element = element;
        this._data = data;
    }

    get guid() {
        return this._data.id;
    }

    /* +Handlers */

    get events() {
        return this.EventHandler;
    }

    /**
     * @return {IEngineComponent|EngineComponent|EventHandler|boolean|null}
     */
    get EventHandler() {
        if (typeof this._data.components.EventHandler === 'boolean') {
            return null;
        } else return this._data.components.EventHandler;
    }

    /**
     * @param {IEngineComponent|EngineComponent|EventHandler|boolean|null} handler
     */
    set EventHandler(handler) {
        if ((typeof handler === 'boolean' && handler === false) || handler === null) {
            this._data.components.EventHandler = false;
            return;
        } else if (typeof handler === 'object' && !handler.instanceOf(IEngineComponent)) {
            throw new InvalidArgumentException('Handler not implements IEngineComponent');
        }

        this._data.components.EventHandler = handler;
    }

    get frame() {
        return this.FrameHandler;
    }

    /**
     * @return {IEngineComponent|EngineComponent|FrameHandler|boolean|null}
     */
    get FrameHandler() {
        if (typeof this._data.components.FrameHandler === 'boolean') {
            return null;
        } else return this._data.components.FrameHandler;
    }

    /**
     * @param {IEngineComponent|EngineComponent|FrameHandler|boolean|null} handler
     */
    set FrameHandler(handler) {
        if ((typeof handler === 'boolean' && handler === false) || handler === null) {
            this._data.components.FrameHandler = false;
            return;
        } else if (typeof handler === 'object' && !handler.instanceOf(IEngineComponent)) {
            throw new InvalidArgumentException('Handler not implements IEngineComponent');
        }

        this._data.components.FrameHandler = handler;
    }

    get io() {
        return this.InputHandler;
    }

    /**
     * @return {IEngineComponent|EngineComponent|InputHandler|boolean|null}
     */
    get InputHandler() {
        if (typeof this._data.components.InputHandler === 'boolean') {
            return null;
        } else return this._data.components.InputHandler;
    }

    /**
     * @param {IEngineComponent|EngineComponent|InputHandler|boolean|null} handler
     */
    set InputHandler(handler) {
        if ((typeof handler === 'boolean' && handler === false) || handler === null) {
            this._data.components.InputHandler = false;
            return;
        } else if (typeof handler === 'object' && !handler.instanceOf(IEngineComponent)) {
            throw new InvalidArgumentException('Handler not implements IEngineComponent');
        }

        this._data.components.InputHandler = handler;
    }

    get media() {
        return this.MediaHandler;
    }

    /**
     * @return {IEngineComponent|EngineComponent|MediaHandler|boolean|null}
     */
    get MediaHandler() {
        if (typeof this._data.components.MediaHandler === 'boolean') {
            return null;
        } else return this._data.components.MediaHandler;
    }

    /**
     * @param {IEngineComponent|EngineComponent|MediaHandler|boolean|null} handler
     */
    set MediaHandler(handler) {
        if ((typeof handler === 'boolean' && handler === false) || handler === null) {
            this._data.components.MediaHandler = false;
            return;
        } else if (typeof handler === 'object' && !handler.instanceOf(IEngineComponent)) {
            throw new InvalidArgumentException('Handler not implements IEngineComponent');
        }

        this._data.components.MediaHandler = handler;
    }

    get tweens() {
        return this.TweenHandler;
    }

    /**
     * @return {IEngineComponent|EngineComponent|TweenHandler|boolean|null}
     */
    get TweenHandler() {
        if (typeof this._data.components.TweenHandler === 'boolean') {
            return null;
        } else return this._data.components.TweenHandler;
    }

    /**
     * @param {IEngineComponent|EngineComponent|TweenHandler|boolean|null} handler
     */
    set TweenHandler(handler) {
        if ((typeof handler === 'boolean' && handler === false) || handler === null) {
            this._data.components.TweenHandler = false;
            return;
        } else if (typeof handler === 'object' && !handler.instanceOf(IEngineComponent)) {
            throw new InvalidArgumentException('Handler not implements IEngineComponent');
        }

        this._data.components.TweenHandler = handler;
    }

    get scene() {
        return this.SceneHandler;
    }

    /**
     * @return {IEngineComponent|EngineComponent|SceneHandler|boolean|null}
     */
    get SceneHandler() {
        if (typeof this._data.components.SceneHandler === 'boolean') {
            return null;
        } else return this._data.components.SceneHandler;
    }

    /**
     * @param {IEngineComponent|EngineComponent|SceneHandler|boolean|null} handler
     */
    set SceneHandler(handler) {
        if ((typeof handler === 'boolean' && handler === false) || handler === null) {
            this._data.components.SceneHandler = false;
            return;
        } else if (typeof handler === 'object' && !handler.instanceOf(IEngineComponent)) {
            throw new InvalidArgumentException('Handler not implements IEngineComponent');
        }

        this._data.components.SceneHandler = handler;
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

    pause() {
        if (!this._initialized) this.tryLoadComponents();

        if (this.io) this.io.flush();
        if (this.media) this.media.pause();
        this._data.pause = true;
        this._element.classList.add('pause');
        this.events.trigger('pause');
    };

    resume() {
        if (!this._initialized) this.tryLoadComponents();

        this._element.classList.remove('pause');
        this._element.focus();
        this._data.pause = false;
        if (this.io) this.io.flush();
        if (this.media) this.media.resume();
        this.events.trigger('resume');
    };

    /* -GameEngine **/

    /* +System **/

    log(message, level) {
        this.logger.log(message, level);
    };

    tryLoadComponents() {
        if (this._initialized) return;

        let COMPONENT = this._data.components;

        // EventHandler
        if (typeof COMPONENT.EventHandler === 'boolean' && COMPONENT.EventHandler === true) {
            COMPONENT.EventHandler = new EventHandler();
        }

        if (typeof COMPONENT.EventHandler === 'object' && COMPONENT.EventHandler instanceof IEngineComponent) {
            COMPONENT.EventHandler.enable();
        }


        // InputHandler
        if (typeof COMPONENT.InputHandler === 'boolean' && COMPONENT.InputHandler === true) {
            COMPONENT.InputHandler = new InputHandler();
            COMPONENT.InputHandler.init(COMPONENT.EventHandler, [
                InputHandler.IO.KEYBOARD,
                InputHandler.IO.MOUSE
            ], {
                cursor: 'default'
            });
        }

        if (typeof COMPONENT.InputHandler === 'object' && COMPONENT.InputHandler instanceof IEngineComponent) {
            COMPONENT.InputHandler.enable();
        }

        // SceneHandler
        if (typeof COMPONENT.SceneHandler === 'boolean' && COMPONENT.SceneHandler === true) {
            COMPONENT.SceneHandler = new SceneHandler();
            COMPONENT.SceneHandler.init(COMPONENT.EventHandler, this, {
                width: 640,
                height: 360,
                backgroundColor: 'black'
            });

            COMPONENT.SceneHandler.LayersHandler = new LayersHandler();
            COMPONENT.SceneHandler.LayersHandler.init(COMPONENT.EventHandler);

            COMPONENT.SceneHandler.ViewportHandler = new ViewportHandler();
            COMPONENT.SceneHandler.ViewportHandler.init(COMPONENT.EventHandler);
        }

        if (typeof COMPONENT.SceneHandler.LayersHandler === 'object'
            && COMPONENT.SceneHandler.LayersHandler instanceof IEngineComponent
        ) {
            COMPONENT.SceneHandler.LayersHandler.enable();
        }

        if (typeof COMPONENT.SceneHandler.ViewportHandler === 'object'
            && COMPONENT.SceneHandler.ViewportHandler instanceof IEngineComponent
        ) {
            COMPONENT.SceneHandler.ViewportHandler.enable();
        }

        if (typeof COMPONENT.EventHandler === 'object' && COMPONENT.EventHandler instanceof IEngineComponent) {
            COMPONENT.SceneHandler.enable();
        }

        // FrameHandler
        if (typeof COMPONENT.FrameHandler === 'boolean' && COMPONENT.FrameHandler === true) {
            COMPONENT.FrameHandler = FrameHandler.init();
            COMPONENT.FrameHandler.init(COMPONENT.EventHandler);
        }

        if (typeof COMPONENT.FrameHandler === 'object' && COMPONENT.FrameHandler instanceof IEngineComponent) {
            COMPONENT.FrameHandler.enable();
        }

        this._initialized = true;
    }

    /* -System **/

    /**
     * @name EngineJ2D
     * @static
     *
     * @param {string|jQuery} selected
     * @param {EngineJ2D.defaults|Object} [options]
     *
     * @returns {EngineJ2D|EngineJ2D[]|Array.<EngineJ2D>}
     */
    static init(selected, options) {
        if (selected === undefined) selected = '.j2d';
        if (options === undefined) options = {};

        options = Mutable.extend(true, {}, EngineJ2D.defaults, options);

        let nodes = [];
        if (typeof selected === 'string') {
            nodes = window.document.querySelectorAll(selected);
        } else if (typeof selected === 'object' && window.jQuery !== undefined && selected instanceof window.jQuery) {
            nodes = selected.get();
        } else return null;

        let inactiveNodes = [];

        for (let i = 0; i < nodes.length; i++) {
            if (!nodes[i].hasAttribute('guid')) inactiveNodes.push(nodes[i])
        }

        for (let i = 0; i < inactiveNodes.length; i++) {
            options.id = UUID.generate();

            inactiveNodes[i].setAttribute('guid', options.id);

            let id = inactiveNodes[i].getAttribute('id');
            if (id === undefined || id === null) {
                inactiveNodes[i].setAttribute('guid', options.id);
            }

            let tabIndex = inactiveNodes[i].getAttribute('tabindex');
            if (tabIndex === undefined || tabIndex === null || tabIndex === false) {
                inactiveNodes[i].setAttribute('tabindex', '-1');
            }

            if (!inactiveNodes[i].classList.contains('j2d')) {
                inactiveNodes[i].classList.add('j2d');
            }

            Engine._$classPreInitialize.push(options.id);
            EngineJ2D.stack[options.id] = new EngineJ2D(inactiveNodes[i], options);
            EngineJ2D.stack.push(options.id);

            inactiveNodes[i].click();
            inactiveNodes[i].focus();
        }

        let resumeBind = (current) => {
            let nodes, engine;
            nodes = window.document.querySelectorAll('div.canvas[guid]:not(.pause-disable):not(:focus)');
            for (let i = 0; i < nodes.length; i++) {
                if (current !== nodes[i]) {
                    nodes[i].classList.remove('active');
                    engine = EngineJ2D.stack[nodes[i].getAttribute('guid')] || null;
                    if (engine) engine.pause();
                }
            }

            nodes = window.document.querySelectorAll('div.canvas[guid].active.pause-disable:not(:focus)');
            for (let i = 0; i < nodes.length; i++) {
                if (current !== nodes[i]) {
                    nodes[i].classList.remove('active');
                }
            }
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
        for (let i = 0; i < nodes.length; i++) {
            activeNodes.push(EngineJ2D.stack[nodes[i].getAttribute('guid')] || null);
            nodes[i].addEventListener('click', resumeEventListener);
            nodes[i].addEventListener('touch', resumeEventListener);
            nodes[i].addEventListener('mouseenter', resumeEventListener);
        }
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

    /**
     * @return {boolean}
     */
    static CompatibilityCheck() {
        let check = false;

        // Disable IE < 11
        if (Device.browser === 'MSIE' && Device.version < 11) {
            let message = 'j2D Error: Please install normal modern browser, IE 11 supported.';
            alert(message);
            console.error(message);

            check = true;
        }

        // Fix IE 11
        if (Device.browser === 'IE' && Device.version >= 11) {
            (() => {
                let CustomEvent = (event, params) => {
                    params = params || {bubbles: false, cancelable: false, detail: undefined};
                    /** @type {Event|CustomEvent}*/
                    let customEvent = document.createEvent('CustomEvent');
                    customEvent.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
                    customEvent.preventDefault = function () {
                        Object.defineProperty(this, 'defaultPrevented', {
                            get: () => {
                                return true;
                            }
                        });
                    };
                    customEvent.preventDefault();
                    return customEvent;
                };
                CustomEvent.prototype = window.Event.prototype;
                window.CustomEvent = CustomEvent;
            })();
        }

        return check;
    }
}

/* ------------------------------ Plugin ------------------------------ */
(EngineJ2D.initPlugin = () => {
    if (EngineJ2D.PluginInit || EngineJ2D.CompatibilityCheck()) return true;

    (new SystemConsole()).logSystem(
        `j2D v.${EngineJ2D.VERSION} | Browser ${Device.browser} v.${Device.version}`, 'https://github.com/fsggs/j2d'
    );

    let isFullScreen = () => {
        //noinspection JSUnresolvedVariable
        return !!(window.document.webkitFullscreenElement
            || window.document.webkitCurrentFullScreenElement
            || (Device.browser === 'Firefox' && Device.version < 47
                ? window.document.mozFullScreenElement
                : window.document.fullscreenElement)
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
            for (let i = 0; i < nodes.length; i++) {
                if (nodes[i]) engine = EngineJ2D.stack[nodes[i].getAttribute('guid')] || null;
                if (engine) engine.pause();
            }
        });

        window.addEventListener('resize', () => {
            for (let i = 0; i < EngineJ2D.stack.length; i++) {
                EngineJ2D.stack[EngineJ2D.stack[i]].device.onResize();
            }

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
