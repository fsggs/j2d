import EngineComponent from "api/EngineComponent";
import InvalidArgumentException from "exceptions/InvalidArgumentException";
import IEngineComponent from "api/interfaces/IEngineComponent";
import Mutable from "objects/Mutable";
import RuntimeException from "exceptions/RuntimeException";

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

    /** @type {SceneHandler.defaults|{render:string, components: {
        * LayersHandler: IEngineComponent|EngineComponent|LayersHandler|boolean|null,
        * ViewportHandler: IEngineComponent|EngineComponent|ViewportHandler|boolean|null
        * }}}
     */
    _data = {
        render: 'auto',
        // render: 'canvas2d',
        isLostContext: false,
        components: {
            LayersHandler: true,
            ViewportHandler: true
        }
    };

    _engine;

    /** @type {HTMLCanvasElement} */
    _element;

    /** @type {CanvasRenderingContext2D|WebGLRenderingContext} */
    _context;

    _shaders = {
        vertex: [],
        fragment: []
    };

    constructor() {
        super();
    }

    get layers() {
        return this.LayersHandler.layers;
    }

    /**
     * @return {IEngineComponent|EngineComponent|LayersHandler|boolean|null}
     */
    get LayersHandler() {
        if (typeof this._data.components.LayersHandler === 'boolean') {
            return null;
        } else return this._data.components.LayersHandler;
    }

    /**
     * @param {IEngineComponent|EngineComponent|LayersHandler|boolean|null} handler
     */
    set LayersHandler(handler) {
        if ((typeof handler === 'boolean' && handler === false) || handler === null) {
            this._data.components.LayersHandler = false;
            return;
        } else if (typeof handler === 'object' && !handler.instanceOf(IEngineComponent)) {
            throw new InvalidArgumentException('Handler not implements IEngineComponent');
        }

        this._data.components.LayersHandler = handler;
    }

    get viewport() {
        return this.ViewportHandler.viewport;
    }

    /**
     * @return {IEngineComponent|EngineComponent|ViewportHandler|boolean|null}
     */
    get ViewportHandler() {
        if (typeof this._data.components.ViewportHandler === 'boolean') {
            return null;
        } else return this._data.components.ViewportHandler;
    }

    /**
     * @param {IEngineComponent|EngineComponent|ViewportHandler|boolean|null} handler
     */
    set ViewportHandler(handler) {
        if ((typeof handler === 'boolean' && handler === false) || handler === null) {
            this._data.components.ViewportHandler = false;
            return;
        } else if (typeof handler === 'object' && !handler.instanceOf(IEngineComponent)) {
            throw new InvalidArgumentException('Handler not implements IEngineComponent');
        }

        this._data.components.ViewportHandler = handler;
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

        /** @type {Element|HTMLCanvasElement} */
        let node = document.querySelector($);
        if (node !== null) {
            if (node.nodeName === 'DIV') {
                let nodes = document.querySelectorAll($ + ' canvas');
                if (nodes.length === 0) {
                    let canvas = window.document.createElement('canvas');
                    node.appendChild(canvas);
                    nodes = [canvas];
                } else if (nodes.length > 1) {
                    for (let i = 0; i < nodes.length; i++) {
                        if (i !== 0) node.removeChild(nodes[i]);
                    }
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

                try {
                    // if ((this._data.render === 'auto' || this._data.render === 'webgl2')
                    //     && (this._context = node.getContext('webgl2') || node.getContext('experimental-webgl2'))
                    // ) {
                    //     this._data.render = 'webgl2';
                    // } else
                    if ((this._data.render === 'auto' || this._data.render === 'webgl')
                        && (this._context = node.getContext('webgl') || node.getContext('experimental-webgl'))
                    ) {
                        this._data.render = 'webgl';
                    } else if ((this._data.render === 'auto' || this._data.render === 'canvas2d')
                        && (this._context = node.getContext('2d'))
                    ) {
                        this._data.render = 'canvas2d';
                    } else {
                        //noinspection ExceptionCaughtLocallyJS
                        throw new RuntimeException(`Browser does not support ${(this._data.render === 'auto')
                            ? 'any' : `"${this._data.render}"`} render type.`);
                    }
                } catch (error) {
                    this._engine.log(error, 'error');
                    return;
                }

                if (!this._data.smoothing) {
                    SceneHandler.disableSmoothing(this._context);
                }

                this._context.shadowColor = 'rgba(0, 0, 0, 0)';

                if (this._data.render === 'webgl2' || this._data.render === 'webgl') {
                    this.bindWebGLListeners(node);
                    this.onWebGLInit();
                }

                this._element = node;

                this._engine.log(`Find scene with GUID "${this._engine.guid}" [${this._data.render.toUpperCase()}]`, 'info');
            }
        }
    }

    onWebGLInit() {
        let gl = this._context;

        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        //gl.enable(gl.CULL_FACE);
        //gl.cullFace(gl.FRONT);
        gl.enable(gl.DEPTH_TEST);
        //gl.depthFunc(gl.LEQUAL);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    }

    onWebGLContextLost = (e) => {
        e.preventDefault();
        this._data.isLostContext = true;
        // cancelRequestAnimationFrame(requestId);
    };

    onWebGLContextRestored = (e) => {
        e.preventDefault();
        this.onWebGLInit();
        this._data.isLostContext = false;
    };

    bindWebGLListeners(node) {
        node.addEventListener('webglcontextlost', this.onWebGLContextLost, false);
        node.addEventListener('webglcontextrestored', this.onWebGLContextRestored, false);
    }

    unBindWebGLListeners(node) {
        node.removeEventListener('webglcontextlost', this.onWebGLContextLost, false);
        node.removeEventListener('webglcontextrestored', this.onWebGLContextRestored, false);
    }

    destructor() {
        if ((this._data.render === 'webgl2' || this._data.render === 'webgl') && this._context.isContextLost()) {
            this._context.getExtension('WEBGL_lose_context').loseContext();
        }
    }

    registerNodeShaders(nodePrototype) {
        let gl = this._context;
        if (this._data.render === 'webgl2' || this._data.render === 'webgl') {
            if (nodePrototype.VertexShader && nodePrototype.FragmentShader) {
                nodePrototype._shaderProgram = gl.createProgram();

                nodePrototype._vertextShader = SceneHandler.compileShader(gl,
                    gl.createShader(gl.VERTEX_SHADER),
                    nodePrototype.VertexShader
                );
                nodePrototype._fragmentShader = SceneHandler.compileShader(gl,
                    gl.createShader(gl.FRAGMENT_SHADER),
                    nodePrototype.FragmentShader
                );

                gl.attachShader(nodePrototype._shaderProgram, nodePrototype._vertextShader);
                gl.attachShader(nodePrototype._shaderProgram, nodePrototype._fragmentShader);

                gl.linkProgram(nodePrototype._shaderProgram);

                if (!gl.getProgramParameter(nodePrototype._shaderProgram, gl.LINK_STATUS)) {
                    console.info('Could not initialise shaders');
                }
            }
        }
    }

    static compileShader(gl, shader, source) {
        gl.shaderSource(shader, source);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.info(gl.getShaderInfoLog(shader));
            return null;
        }

        return shader;
    }

    // +SceneMainLayer Hack

    get(key) {
        this.layers.get(key);
    }

    has(key) {
        this.layers.has(key);
    }

    add(node, index) {
        this.layers.add(node, index);
    }

    remove(node) {
        this.layers.remove(node);
    }

    // -SceneMainLayer Hack

    static disableSmoothing(context) {
        let chrome = window.navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./);
        let version = chrome ? parseInt(chrome[2], 10) : false;

        if (context.hasOwnProperty('imageSmoothingEnabled')) {
            context.imageSmoothingEnabled = false;
        } else {
            context['imageSmoothingEnabled'] = false;
            context['mozImageSmoothingEnabled'] = false;
            context['oImageSmoothingEnabled'] = false;
            if (version && version <= 29) {
                context['webkitImageSmoothingEnabled'] = false;
            }
            context['msImageSmoothingEnabled'] = false;
        }
    }

    clear() {
        if (this._data.render.startsWith('webgl')) {
            let gl = this._context;
            gl.clearColor(0.0, 0.0, 0.0, 1.0);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        } else {
            this._context.clearRect(0, 0, this._element.width, this._element.height);
        }
    }

    render(data) {
        if (data.components.SceneHandler._data.isLostContext) return;

        this.clear();
        this.layers.render(this._context, this.viewport, data || {})
    }
}
