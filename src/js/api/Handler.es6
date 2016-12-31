import PrototypeObject from "api/PrototypeObject";
import IHandler from "api/interfaces/IHandler";

/**
 * Handler
 * @constructor
 */
export default class Handler extends PrototypeObject {
    static interfaces = [IHandler];

    constructor() {
        super();

        this.events = null;
        this.isEnabled = false;
    }

    init(eventHandler) {
        if (eventHandler !== undefined) {
            this.events = eventHandler;
        }
        return this;
    };

    enable() {
        this.isEnabled = true;
        return this;
    };

    disable() {
        this.isEnabled = false;
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
