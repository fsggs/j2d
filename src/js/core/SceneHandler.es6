import EngineComponent from "api/EngineComponent";
import InvalidArgumentException from "exceptions/InvalidArgumentException";
import IEngineComponent from "api/interfaces/IEngineComponent";
import Mutable from "objects/Mutable";

export default class SceneHandler extends EngineComponent {
    /**
     * @type {{
        * width: number|string,
        * height: number|string,
        * visible: boolean|string,
        * position: string,
        * top: number|string,
        * bottom: number|string,
        * left: number|string,
        * right: number|string,
        * zIndex: number|string,
        * opacity: number|string,
        * backgroundColor: null|string,
        * smoothing: boolean
        * }}
     */
    static defaults = {
        width: 0,
        height: 0,

        visible: true,
        position: 'absolute',
        top: 0,
        bottom: 'auto',
        left: 0,
        right: 'auto',
        zIndex: 1000,
        opacity: 1.0,
        backgroundColor: null,

        smoothing: false
    };

    /** @type {SceneHandler.defaults|{components: {
        * LayersHandler: IEngineComponent|EngineComponent|LayersHandler,
        * ViewportHandler: IEngineComponent|EngineComponent|ViewportHandler
        * }}}
     */
    _data = {
        components: {
            LayersHandler: null,
            ViewportHandler: null
        }
    };

    _engine;

    _element;
    _context;

    constructor() {
        super();
    }

    get layers() {
        return this.LayersHandler.layers;
    }

    /**
     * @return {LayersHandler|null}
     */
    get LayersHandler() {
        return this._data.components.LayersHandler;
    }

    /**
     * @param {LayersHandler|null} handler
     */
    set LayersHandler(handler) {
        if (!handler.instanceOf(IEngineComponent))
            throw new InvalidArgumentException('Handler not implements IEngineComponent');
        return this._data.components.LayersHandler = handler;
    }

    get viewport() {
        return this.ViewportHandler.viewport;
    }

    /**
     * @return {ViewportHandler|null}
     */
    get ViewportHandler() {
        return this._data.components.ViewportHandler;
    }

    /**
     * @param {ViewportHandler|null} handler
     */
    set ViewportHandler(handler) {
        if (!handler.instanceOf(IEngineComponent))
            throw new InvalidArgumentException('Handler not implements IEngineComponent');
        return this._data.components.ViewportHandler = handler;
    }

    init(eventHandler, engine, options) {
        super.init(eventHandler);

        if (options && typeof options === 'object') this.options = options;
        options = Mutable.extend(true, {}, SceneHandler.defaults, options);
        if (options.components !== undefined) delete options.components;

        this._engine = engine;
        this._data = Mutable.extend(true, {}, this._data, options);

        this.initCanvas();
    }

    initCanvas() {
        const $ = `.j2d[guid="${this._engine.guid}"]`;
        let node = document.querySelector($);
        if (node !== null) {
            if (node.nodeName === 'DIV') {
                let nodes = document.querySelectorAll($ + ' canvas');
                if (nodes.length === 0) {
                    let canvas = window.document.createElement('canvas');
                    node.appendChild(canvas);
                    nodes = [canvas];
                } else if (nodes.length > 1) {
                    nodes.forEach((_node, i) => {
                        if (i !== 0) node.removeChild(_node);
                    });
                }
                node = nodes[0];
            }

            if (node.nodeName === 'CANVAS') {
                node.width = this._data.width;
                node.height = this._data.height;
                node.style.zIndex = this._data.zIndex;
                node.style.position = this._data.position;

                node.style.left = this._data.left;
                node.style.right = this._data.right;
                node.style.top = this._data.top;
                node.style.bottom = this._data.bottom;

                node.style.backgroundColor = this._data.backgroundColor;

                this._context = node.getContext('2d');

                if (!this._data.smoothing) {
                    this._disableSmoothing(this._context);
                }

                this._context.shadowColor = 'rgba(0, 0, 0, 0)';

                this._element = node;

                this._engine.log(`Find scene with GUID "${this._engine.guid}"`, 'info');
            }
        }
    }

    _disableSmoothing() {
        let chrome = window.navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./);
        let version = chrome ? parseInt(chrome[2], 10) : false;

        this._context['imageSmoothingEnabled'] = false;
        this._context['mozImageSmoothingEnabled'] = false;
        this._context['oImageSmoothingEnabled'] = false;
        if (version && version <= 29) {
            this._context['webkitImageSmoothingEnabled'] = false;
        }
        this._context['msImageSmoothingEnabled'] = false;
    }

    render(data) {
        this.layers.forEach(layer => {
            layer.render(this._context, this.viewport, this.layers, data || {})
        });
    }
}
