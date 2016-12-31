import Device from "api/Device";

export default class Joystick extends Device {
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
        throw new Error('Error. IO interface "' + Joystick.IO + '" exist, but not supported yet.');
        //return true;
    };

    disable() {
        throw new Error('Error. IO interface "' + Joystick.IO + '" exist, but not supported yet.');
        //return true;
    };
}

