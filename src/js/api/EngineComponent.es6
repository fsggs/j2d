import Handler from "api/Handler";
import IEngineComponent from "api/interfaces/IEngineComponent";

/**
 * EngineComponent
 * @constructor
 *
 * @interface IEngineComponent
 */
export default class EngineComponent extends Handler {
    static interfaces = [IEngineComponent];

    constructor() {
        super();
    }
};

