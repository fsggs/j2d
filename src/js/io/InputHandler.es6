import Handler from "api/Handler";
import InputHandlerCodes from "io/InputHandlerCodes";
import Keyboard from "io/devices/Keyboard";
import Joystick from "io/devices/Joystick";
import Mouse from "io/devices/Mouse";
import Touch from "io/devices/Touch";
import Device from "api/Device";
import EngineComponent from "api/EngineComponent";

/**
 * InputHandler
 * @constructor
 * @extends EngineComponent
 *
 * @interface IEngineComponent
 */
export default class InputHandler extends EngineComponent {

    static IO = {
        KEYBOARD: 'keyboard',
        JOYSTICK: 'joystick',
        MOUSE: 'mouse',
        TOUCH: 'touch'
    };

    defaultIO = {
        KEYBOARD: Keyboard,
        JOYSTICK: Joystick,
        MOUSE: Mouse,
        TOUCH: Touch
    };

    static KEY = InputHandlerCodes;
    KEY = InputHandler.KEY;

    static KEYS_HELPER = InputHandler.prototype.KEYS_HELPER = {
        getKeyById: function (index) {
            return InputHandler.KEY[index] || 'KEY_UNKNOWN_' + index;
        },
        getKeyByCode: function (keyCode) {
            return InputHandler.KEY[keyCode] || 0;
        }
    };

    constructor() {
        super();

        this.preventDefault = false;
        this.IO = [];
        this.options = {
            cursor: 'none'
        };

        this.store = {};

        this.data = {};

        this.keyCodeMap = {
            //DEBUG_INFO: [[InputHandler.KEY.KEY_CTRL, InputHandler.KEY.KEY_F1], 'j2d.debug.toggleScreen', {}],
            FULLSCREEN: [[InputHandler.KEY.KEY_CTRL, InputHandler.KEY.KEY_F11], 'j2d.scene.toggleFullScreen', {}]
        };
    }

    bindListeners() {
        for (let i = 0; i < this.IO.length; i++) {
            if (this.IO[i].enable() === false) return false;
        }
    };

    unBindListeners() {
        for (let i = 0; i < this.IO.length; i++) {
            if (this.IO[i].disable() === false) return false;
        }
    };

    update() {
        if (!this.isEnabled) return false;
        for (let i = 0; i < this.IO.length; i++) {
            if (this.IO[i].update() === false) return false;
        }
        return true;
    };

    clear() {
        if (!this.isEnabled) return false;
        for (let i = 0; i < this.IO.length; i++) {
            if (this.IO[i].clear() === false) return false;
        }
        return true;
    };

    load(newKeyCodeMap) {
        let oldKeyCodeMap = JSON.stringify(this.keyCodeMap);
        this.keyCodeMap = JSON.parse(newKeyCodeMap);
        return oldKeyCodeMap;
    };

    save() {
        return JSON.stringify(this.keyCodeMap);
    };

    flush() {
    }

    // TODO:: to refactoring

    static _getPressData(manager, keyList) {
        return {
            keyList: keyList,
            time: manager.store.keys.pressedTime[keyList[0]]
        };
    }

    checkPressedKeyList(keyList) {
        if (typeof keyList === 'object' && keyList instanceof Array) {
            if (keyList.length !== this.data.keys.keysDown.length) {
                return false;
                //} else if (this.data.keys.keysDown.equals(keyList)) {
                //    return getPressData(this, keyList);
            }
            return false;
        }
        if (isNaN(keyList)) return false;
        if (-1 !== this.data.keys.keysDown.indexOf(keyList)) {
            return InputHandler._getPressData(this, keyList);
        }
        return false;
    }

    checkPressedKeyMap(key) {
        if (this.keyCodeMap[key] === undefined) return false;
        return this.checkPressedKeyList(this.keyCodeMap[key][0]);
    }

    setKeys(mapObject) {
        //this.keyMap = $.extend(true, {}, this.keyMap, mapObject);
        return this;
    }

    init(eventHandler, io, options) {
        Handler.prototype.init.call(this, eventHandler);
        if (options !== undefined && options !== null && typeof options === 'object') {
            this.options = options;
        }
        if (io !== undefined && io !== null && typeof io === 'object' && io instanceof Array) {
            this.IO = [];
            io.map(function (device) {
                if (typeof device === 'string' && InputHandler.IO[device.toUpperCase()] !== undefined) {
                    device = new (this.defaultIO[device.toUpperCase()])();
                    this.IO[device.toString()] = device;
                    this.IO.push(device);
                    if (this.IO[device].init(this) === false) {
                        throw new Error('Error. Device "' + device + '" not initialize.');
                    }
                } else if (typeof device === 'object' && device instanceof Device) {
                    this.IO[device.toString()] = device;
                    this.IO.push(device);
                    if (this.IO[device.toString()].init(this) === false) {
                        throw new Error('Error. Device "' + device + '" not initialize.');
                    }
                } else {
                    throw new Error('Error. Unknown IO device "' + device.toString() + '" is not supported yet.');
                }
            }.bind(this));
        }
        return this;
    }

    enable() {
        Handler.prototype.enable.call(this);
        this.bindListeners();
        return this;
    }

    disable() {
        Handler.prototype.disable.call(this);
        this.unBindListeners();
        return this;
    }

    toggle(status) {
        Handler.prototype.toggle.call(this, status);
        return this;
    }
}
