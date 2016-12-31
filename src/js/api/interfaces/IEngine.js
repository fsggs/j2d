if (global === undefined) var global = window || this;
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('api/interfaces/IEngine', ['api/PrototypeInterface'], factory);
    } else if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = factory(require('api/PrototypeInterface'));
    } else {
        factory(root.j2d.api.PrototypeInterface);
    }
}(typeof window !== 'undefined' ? window : global, function (PrototypeInterface) {
    "use strict";

    /**
     * IEngine
     * @constructor
     */
    var IEngine = function () {
    };

    IEngine.prototype = Object.create(PrototypeInterface.prototype);
    IEngine.prototype.constructor = IEngine;

    if (typeof module === 'object' && typeof module.exports === 'object') module.exports.IEngine = IEngine;
    if (global !== undefined) global.j2d.api.interfaces.IEngine = IEngine;
    return IEngine;
}));
