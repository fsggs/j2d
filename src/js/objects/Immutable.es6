import InvalidArgumentException from "exceptions/InvalidArgumentException";
import Mutable from "objects/Mutable";

const FREEZE_NODE_METHODS = ['get', 'set', 'toJS', 'toJSON'];

/**
 * @exports module:objects/Immutable
 */
export default class Immutable extends Object {
    constructor(object) {
        if (typeof object !== 'object' && object !== undefined) {
            throw new InvalidArgumentException('Attribute object type must be instance of Object.');
        }
        if (object === undefined) object = {};
        super(Object.assign(object instanceof Array ? [] : {}, object));
        Immutable.freeze(this);
    }

    toJS = () => Immutable.unFreeze(Object.assign(this instanceof Array ? [] : {}, this));

    toJSON = () => JSON.stringify(
        Immutable.unFreeze(Object.assign(this instanceof Array ? [] : {}, this))
    );

    get = () => Object.assign(this instanceof Array ? [] : {}, this);

    set = (data) => {
        if (typeof data !== 'object' && data !== undefined) {
            throw new InvalidArgumentException('Attribute object type must be instance of Object.');
        }

        if (Object.isFrozen(this)) {
            let oldObject = Immutable.unFreeze(Object.assign(this instanceof Array ? [] : {}, this));
            let newObject = Mutable.extend(true, oldObject instanceof Array ? [] : {}, oldObject, data);
            console.log(oldObject, this, newObject);

            return Immutable.freeze(newObject);
        } else {
            console.log(data)
        }
    };

    /**
     * @param {Object} object
     * @return {Object}
     */
    static freeze(object) {
        Object.getOwnPropertyNames(object).forEach((property) => {
            if (object.hasOwnProperty(property)
                && object[property] !== null
                && (typeof object[property] === 'object' || typeof object[property] === 'function')
                && !Object.isFrozen(object[property])
                && !FREEZE_NODE_METHODS.includes(property)
            ) {
                object[property] = new Immutable(object[property]);
            }
        });

        Object.freeze(object);
        return object;
    }

    /**
     * @param {Object} object
     * @return {Object}
     */
    static unFreeze(object) {
        let result = object instanceof Array ? [] : {};

        if (object instanceof Array) {
            object.forEach((v) => result.push(v));
        } else if (object instanceof String) {
            result = String(object).toString();
        } else if (typeof object == 'object') {
            for (let property in object) {
                if (object.hasOwnProperty(property) && !FREEZE_NODE_METHODS.includes(property)) {
                    result[property] = (typeof object[property] === 'object' && Object.isFrozen(object[property]))
                        ? Immutable.unFreeze(object[property])
                        : object[property];
                }
            }
        }

        return result;
    }
}
