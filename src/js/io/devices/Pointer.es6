import Device from "api/Device";

export default class Pointer extends Device {
    constructor(input) {
        super(input);
        if (this.constructor.name === 'Pointer') {
            throw new Error('Error. Pointer is abstract class.');
        }
    }

    setPointerImage(image) {
        if (image) {
            switch (image) {
                case 'none':
                case 'default':
                case 'auto':
                case 'crosshair':
                case 'e-resize':
                case 'help':
                case 'move':
                case 'n-resize':
                case 'ne-resize':
                case 'nw-resize':
                case 'pointer':
                case 'progress':
                case 's-resize':
                case 'se-resize':
                case 'sw-resize':
                case 'text':
                case 'w-resize':
                case 'wait':
                case 'inherit':
                    break;
                default:
                    image = 'url("' + image + '"), auto'
            }
        }
        this.input.data.pointer.image = this.input.store.pointer.image = this.input.options.cursor = image;
        window.document.body.style.cursor = this.input.data.pointer.image;
        return this;
    };

    toggleCursor(toggle) {
        if (this.input.data.image !== 'none' && (toggle === undefined || toggle === false)) {
            this.input.store.pointer.image = window.document.body.style.cursor;
            window.document.body.style.cursor = 'none';
        } else {
            window.document.body.style.cursor = this.input.store.pointer.image;
        }
        return this;
    };

    isPointerVisible() {
        return this.input.data.pointer.image === 'none';
    };

    getPointerPosition() {
        if (this.data.pointer === undefined) return [0, 0];
        return [this.data.pointer.x, this.data.pointer.y];
    };

    getPointerMoveDistance() {
        if (this.data.pointer === undefined) return 0;
        return this.data.pointer.distance;
    };
}
