import PrototypeObject from "api/PrototypeObject";
import UUID from "utils/UUID";
import Mutable from "objects/Mutable";

/**
 * @property {BaseNode.defaults|{}} _data
 */
export default class BaseNode extends PrototypeObject {
    static NodeName = 'BaseNode';
    static isSpecial = false;

    /** @type {{id: null|string}} */
    static defaults = {
        id: null
    };

    _data;

    constructor(data) {
        super();
        if (typeof data === 'string') data = {id: data};
        this._data = Mutable.extend(true, {}, BaseNode.defaults, data);
        if (this._data.id === null) this._data.id = UUID.generate();
    }

    get guid() {
        return this._data.id;
    }

    get isSpecialNode() {
        return this.constructor.isSpecial || false;
    }

    toString() {
        return function (device) {
            return (device[0].toLowerCase() + device.slice(1))
        }(this.constructor.NodeName || this.constructor.name);
    }
}
