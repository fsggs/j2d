if (global === undefined) var global = window || this;
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('api/interfaces/IEngineComponent', ['api/PrototypeInterface'], factory);
    } else if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = factory(require('api/PrototypeInterface'));
    } else {
        factory(root.j2d.api.api.PrototypeInterface);
    }
}(typeof window !== 'undefined' ? window : global, function (PrototypeInterface) {
    "use strict";

    /**
     * IEngineComponent
     * @constructor
     */
    var IEngineComponent = function () {
    };

    IEngineComponent.prototype = Object.create(PrototypeInterface.prototype);
    IEngineComponent.prototype.constructor = IEngineComponent;

    if (typeof module === 'object' && typeof module.exports === 'object') module.exports.IEngineComponent = IEngineComponent;
    if (global !== undefined) global.j2d.api.interfaces.IEngineComponent = IEngineComponent;
    return IEngineComponent;
}));
