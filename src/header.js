/**
 * j2D (JavaScript 2D Engine)
 *
 * @authors DeVinterX, Skaner(j2Ds)
 * @license BSD
 * @version 1.0.0-dev
 */

if (global === undefined) {
    var global = window || this
}
if (typeof define !== 'function' || !define.amd) {
    global.j2d = {
        api: {
            interfaces: {}
        },
        core: {},
        events: {},
        exceptions: {},
        io: {
            devices: {}
        },
        loaders: {},
        media: {},
        nodes: {},
        states: {},
        transitions: {utils: {}},
        utils: {}
    };
}
