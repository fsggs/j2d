/**
 * Device
 * @constructor
 */
export default class Device {
    input = undefined;

    constructor(input) {
        if (input !== undefined) this.input = input;
    }

    enable() {
        return true;
    };

    disable() {
        return true;
    };

    init(input) {
        if (input !== undefined && this.input === undefined) this.input = input;
        return false;
    };

    update() {
        return true;
    };

    clear() {
        return true;
    };

    toString() {
        return function (device) {
            return (device[0].toLowerCase() + device.slice(1))
        }(this.constructor.DeviceName || this.constructor.name);
    };
};
