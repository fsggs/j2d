import EngineComponent from "api/EngineComponent";
import Layer from "layers/Layer";
import BaseNode from "nodes/BaseNode";
import Mutable from "objects/Mutable";

export default class LayersHandler extends EngineComponent {
    /**
     * @type {{}}
     */
    static defaults = {};

    /**
     * @type {LayersHandler.defaults|{}}
     */
    _data;

    /** @type {Layer} */
    _layers = new Layer('global');

    constructor() {
        super();
        this.add(new Layer('main'));
    }

    init(eventHandler, options) {
        super.init(eventHandler);
        this._data = Mutable.extend(true, {}, LayersHandler.defaults, options);
    }

    get layers() {
        return this._layers;
    }

    get(key) {
        this._layers.get(key);
    }

    has(key) {
        this._layers.has(key);
    }

    add(node, index) {
        if (node.instanceOf(BaseNode)) {
            this._layers.add(node, index);
        }
    }

    remove(node) {
        if (node.instanceOf(BaseNode)) {
            this._layers.remove(node);
        }
    }
}
