/**
 * J2D (jQuery Canvas Graphic Engine plugin)
 *
 * @authors DeVinterX, Skaner(j2Ds)
 * @license BSD
 * @version 0.2.0-dev
 */

if (global === undefined) {
    var global = window || this
}
if (typeof define !== 'function' || !define.amd) {
    global.j2d = {
        core: {},
        exceptions: {},
        io: {},
        media: {},
        nodes: {},
        transitions: {},
        utils: {}
    };
}
