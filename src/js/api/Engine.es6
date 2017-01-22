import PrototypeObject from "api/PrototypeObject";
import IEngine from "api/interfaces/IEngine";
import RuntimeException from "exceptions/RuntimeException";

/**
 * Engine
 * @constructor
 */
export default class Engine extends PrototypeObject {
    static interfaces = [IEngine];
    static _$classPreInitialize = [];

    _isEnabled = false;

    constructor(id) {
        super();

        if (!Engine._$classPreInitialize.includes(id)) {
            throw new RuntimeException(`The constructor is private. Please use static ${this.constructor.name}.init()`);
        } else Engine._$classPreInitialize.splice(Engine._$classPreInitialize.indexOf(id), 1);
    }

    get isEnabled() {
        return this._isEnabled;
    }

    enable() {
        this._isEnabled = true;
        return this;
    };

    disable() {
        this._isEnabled = false;
        return this;
    };

    toggle(status) {
        if (status === undefined) status = !this.isEnabled;
        if (status) {
            this.enable();
        } else {
            this.disable();
        }
        return this;
    };
};

