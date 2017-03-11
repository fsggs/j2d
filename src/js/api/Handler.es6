import PrototypeObject from "api/PrototypeObject";
import IHandler from "api/interfaces/IHandler";

/**
 * Handler
 * @constructor
 */
export default class Handler extends PrototypeObject {
    static interfaces = [IHandler];

    _isEnabled = false;

    events = null;

    constructor() {
        super();
    }

    init(eventHandler) {
        if (eventHandler !== undefined) {
            this.events = eventHandler;
        }
        return this;
    };

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
}
