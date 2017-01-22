import Pointer from "io/devices/Pointer";

export default class Mouse extends Pointer {
    static DeviceName = Pointer.prototype.constructor.name; // this fix device name in InputHandler

    __fixMouseButtonId = (id) => {
        if (id > 2) {
            return id;
        } else if (id === 0) {
            return 'LEFT';
        } else if (id === 1) {
            return 'MIDDLE';
        } else if (id === 2) {
            return 'RIGHT';
        }
    };

    keyMouseDownEventHandler = (e) => {
        if (this.input.isEnabled && this.input.preventDefault) e.preventDefault();

        let keyCode = this.input.KEYS_HELPER.getKeyById('KEY_MOUSE_' + this.__fixMouseButtonId(e.button));
        if (!this.input.data.keys.keysDown.includes(keyCode)) {
            this.input.data.keys.keysDown.push(keyCode);
        }

        this.input.store.recordMouseDragDistance = true;
        this.input.store.pointer = {
            tracker: {
                x: e.pageX,
                y: e.pageY
            }
        };

        this.input.store.recordMouseClickTime = true;
        if (this.input.store.keys.pressedTime[keyCode] !== undefined) {
            this.input.store.keys.pressedTime[keyCode].delta = this.input.store.keys.pressedTime[keyCode].startTime - e.timeStamp
        } else {
            this.input.store.keys.pressedTime[keyCode] = {
                startTime: e.timeStamp,
                delta: 0
            };
        }

        this.input.events.trigger('io.mouseKeyDown', e);
    };

    keyMouseUpEventHandler = (e) => {
        if (this.input.isEnabled && this.input.preventDefault) e.preventDefault();

        let keyCode = this.input.KEYS_HELPER.getKeyById('KEY_MOUSE_' + this.__fixMouseButtonId(e.button));
        if (!this.input.data.keys.keysUp.includes(keyCode)) {
            this.input.data.keys.keysUp.push(keyCode);
        }

        this.input.store.recordMouseDragDistance = false;
        this.input.data.pointer.distance = 0;
        this.input.store.pointer = {
            tracker: {
                x: 0,
                y: 0
            }
        };

        this.input.store.recordMouseClickTime = false;
        if (this.input.store.keys.pressedTime[keyCode] !== undefined) {
            this.input.store.keys.pressedTime.splice(keyCode, 1)
        }

        this.input.events.trigger('io.mouseKeyUp', e);
    };

    keyMouseMoveEventHandler = (e) => {
        if (this.input.isEnabled && this.input.preventDefault) e.preventDefault();

        this.input.data.pointer = {
            x: e.pageX,
            y: e.pageY,
            distance: (this.input.store.recordMouseDragDistance) ? Math.sqrt(
                Math.pow((e.pageX - this.input.store.pointer.tracker.x), 2)
                + Math.pow((e.pageY - this.input.store.pointer.tracker.y), 2)
            ).toFixed(2) : 0.0,
            image: this.input.data.pointer.image
        };

        this.input.events.trigger('io.mouseMove', e);
    };

    scrollMouseEventHandler = (e) => {
        if (this.input.isEnabled && this.input.preventDefault) e.preventDefault();

        let keyCode = (e.wheelDelta / 120 > 0)
            ? this.input.KEYS_HELPER.getKeyById('SCROLL_MOUSE_UP')
            : this.input.KEYS_HELPER.getKeyById('SCROLL_MOUSE_DOWN');

        if (!this.input.data.keys.keysUp.includes(keyCode)) {
            this.input.data.keys.keysUp.push(keyCode);
            this.input.data.keys.keysDown.push(keyCode);
        }

        this.input.events.trigger('io.mouseScroll', e);
    };

    constructor(input) {
        super(input);

        this.keyMouseDownEventHandler = this.keyMouseDownEventHandler.bind(this);
        this.keyMouseUpEventHandler = this.keyMouseUpEventHandler.bind(this);
        this.keyMouseMoveEventHandler = this.keyMouseMoveEventHandler.bind(this);
        this.scrollMouseEventHandler = this.scrollMouseEventHandler.bind(this);
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
        this.input.data.pointer = {
            image: this.input.options.cursor || 'none',
            x: 0,
            y: 0,
            distance: 0
        };
        this.input.store.pointer = {
            tracker: {
                x: 0,
                y: 0
            },
            image: this.input.options.cursor || 'none'
        };
        this.input.store.recordMouseDragDistance = false;
        this.input.store.recordMouseClickTime = false;
        this.setPointerImage(this.input.options.cursor || 'none');
    };

    update() {
        //TODO:: fix pointer by viewport scene
        return true;
    };

    clear() {
        if (this.input.data.keys !== undefined) {
            this.input.data.keys = {
                keysUp: [],
                keysDown: []
            };
        }
        if (this.input.data.pointer !== undefined) {
            this.input.data.pointer = {
                image: this.input.options.pointer || 'none',
                x: 0,
                y: 0,
                distance: 0
            };
        }
        return true;
    };

    enable() {
        window.addEventListener('mousedown', this.keyMouseDownEventHandler, false);
        window.addEventListener('mouseup', this.keyMouseUpEventHandler, false);
        window.addEventListener('mousemove', this.keyMouseMoveEventHandler, false);
        window.addEventListener('wheel', this.scrollMouseEventHandler, false);
        return true;
    };

    disable() {
        window.removeEventListener('mousedown', this.keyMouseDownEventHandler, false);
        window.removeEventListener('mouseup', this.keyMouseUpEventHandler, false);
        window.removeEventListener('mousemove', this.keyMouseMoveEventHandler, false);
        window.removeEventListener('wheel', this.scrollMouseEventHandler, false);
        return true;
    };
}
