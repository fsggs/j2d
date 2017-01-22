import PrototypeInterface from "api/PrototypeInterface";

/**
 * PrototypeObject
 * @constructor
 */
export default class PrototypeObject {
    static interfaces = [];

    constructor() {
        if (this.constructor.interfaces === undefined) this.constructor.interfaces = [];

        let scope = [];

        /**
         TODO:: Object.getPrototypeOf(obj),
         @link https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Object/getPrototypeOf
         */
        let implement = function (object) {
            if (object.__proto__.constructor.name === 'Object'
                || object.__proto__.constructor === undefined
                || object.__proto__.constructor.interfaces.length < 1
            ) return;

            for (let i = 0; i < object.__proto__.constructor.interfaces.length; i++) {
                if (!scope.includes(object.__proto__.constructor.interfaces[i].name)) {
                    scope.push(object.__proto__.constructor.interfaces[i].name);
                    this.constructor.interfaces.push(object.__proto__.constructor.interfaces[i]);
                }
            }

            implement(object.__proto__);
        }.bind(this);

        implement(this.__proto__);
    }

    instanceOf(interfaces) {
        let i = 0;
        if (typeof interfaces === 'object' && interfaces instanceof Array) {
            for (i = 0; i < interfaces.length; i++) {
                if (typeof interfaces[i] === 'function' && new (interfaces[i]) instanceof PrototypeInterface) {
                    if (this.constructor.interfaces.includes(interfaces[i]) === false) return false;
                } else if (typeof interfaces[i] === 'function') {
                    if (!(this instanceof interfaces[i])) return false;
                } else throw new Error('Error. "' + interfaces[i].constructor.name + '" is not interface!');
            }
        } else if (typeof interfaces === 'function' && new (interfaces) instanceof PrototypeInterface) {
            return this.constructor.interfaces.includes(interfaces);
        } else if (typeof interfaces === 'function') {
            if (!(this instanceof interfaces)) return false;
        } else {
            throw new Error('Error. "' + interfaces.constructor.name + '" is not interface!');
        }
        return true;
    }

    toString() {
        return this.__proto__.constructor.name;
    }
}
