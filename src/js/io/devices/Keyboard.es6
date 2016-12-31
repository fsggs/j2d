import Device from "api/Device";

export default class Keyboard extends Device {
    keyDownEventHandler = (e) => {
        if (this.input.isEnabled && this.input.preventDefault) e.preventDefault();
        if (!this.input.data.keys.keysDown.includes(e.keyCode)) {
            this.input.data.keys.keysDown.push(e.keyCode);
        }

        this.input.store.recordKeyPressTime = true;
        if (this.input.store.keys.pressedTime[e.keyCode] !== undefined) {
            this.input.store.keys.pressedTime[e.keyCode].delta = this.input.store.keys.pressedTime[e.keyCode].startTime - e.timeStamp
        } else {
            this.input.store.keys.pressedTime[e.keyCode] = {
                startTime: e.timeStamp,
                delta: 0
            };
        }

        this.input.events.trigger('io.keyboardKeyDown', e);
    };

    keyUpEventHandler = (e) => {
        if (this.input.isEnabled && this.input.preventDefault) e.preventDefault();
        if (!this.input.data.keys.keysUp.includes(e.keyCode)) {
            this.input.data.keys.keysUp.push(e.keyCode);
        }

        this.input.store.recordKeyPressTime = false;
        if (this.input.store.keys.pressedTime[e.keyCode] !== undefined) {
            this.input.store.keys.pressedTime.splice(e.keyCode, 1)
        }

        this.input.events.trigger('io.keyboardKeyUp', e);
    };

    constructor(input) {
        super(input);

        this.keyDownEventHandler = this.keyDownEventHandler.bind(this);
        this.keyUpEventHandler = this.keyUpEventHandler.bind(this);
    }

    init(input) {
        if (input !== undefined && this.input === undefined) this.input = input;
        this.input.data.keys = {
            keysUp: [],
            keysDown: []
        };
        this.input.store.keys = {
            pressedTime: []
        };
        this.input.store.recordKeyPressTime = false;
    };

    update() {
        return true;
    };

    clear() {
        if (this.input.data.keys !== undefined) {
            this.input.data.keys = {
                keysUp: [],
                keysDown: []
            };
        }
        return true;
    };

    enable() {
        window.addEventListener('keydown', this.keyDownEventHandler, false);
        window.addEventListener('keyup', this.keyUpEventHandler, false);
        return true;
    };

    disable() {
        window.removeEventListener('keydown', this.keyDownEventHandler, false);
        window.removeEventListener('keyup', this.keyUpEventHandler, false);
        return true;
    };
};
