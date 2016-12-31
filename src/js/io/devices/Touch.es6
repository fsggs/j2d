import Pointer from "io/devices/Pointer";

export default class Touch extends Pointer {
    static DeviceName = Pointer.prototype.constructor.name; // this fix device name in InputHandler

    constructor(input) {
        super(input);
    }

    init(input) {
        if (input !== undefined && this.input === undefined) this.input = input;
        return true;
    };

    update() {
        return true;
    };

    clear() {
        return true;
    };

    enable() {
        throw new Error('Error. IO interface "' + Touch.IO + '" exist, but not supported yet.');
        //return true;
    };

    disable() {
        throw new Error('Error. IO interface "' + Touch.IO + '" exist, but not supported yet.');
        //return true;
    };
}
