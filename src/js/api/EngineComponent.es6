import PrototypeObject from "api/PrototypeObject";
import IEngineComponent from "api/interfaces/IEngineComponent";

/**
 * EngineComponent
 * @constructor
 */
export default class EngineComponent extends PrototypeObject {
    static interfaces = [IEngineComponent];

    constructor() {
        super();
    }
};

