import InvalidArgumentException from "exceptions/InvalidArgumentException";
import Mutable from "objects/Mutable";

const FREEZE_NODE_METHODS = ['get', 'set', 'toJS', 'toJSON'];
const FREEZE_NODE_ARRAY_METHODS = [
    'concat', 'copyWithin', 'fill', 'filter', 'map', 'pop', 'reduce',
    'reduceRight', 'reverse', 'shift', 'slice', 'sort', 'splice', 'unshift',
];

/**
 * @exports module:objects/Immutable
 */
export default class Immutable extends Object {
    __$ImmutableOptions;

    constructor(object, options) {
        if (object !== undefined && typeof object !== 'object') {
            throw new InvalidArgumentException('Attribute object type must be instance of Object.');
        }

        if (options === undefined) options = {};
        if (object === undefined) object = {};

        super(object instanceof Array ? new ImmutableArray(object, options) : Object.assign({}, object));

        this.__$ImmutableOptions = options;

        if (!Object.isFrozen(this)) Immutable.freeze(this, options);
    }

    toJS = () => Immutable.unFreeze(Object.assign(this instanceof Array ? [] : {}, this));

    toJSON = () => JSON.stringify(
        Immutable.unFreeze(Object.assign(this instanceof Array ? [] : {}, this))
    );

    get = () => Immutable.freeze(Object.assign(this instanceof Array ? [] : {}, this), this.__$ImmutableOptions);

    set = (data) => {
        if (data !== undefined && typeof data !== 'object') {
            throw new InvalidArgumentException('Attribute object type must be instance of Object.');
        }

        if (Object.isFrozen(this)) {
            let oldObject = Immutable.unFreeze(Object.assign(this instanceof Array ? [] : {}, this));
            let newObject = Mutable.extend(true, oldObject instanceof Array ? [] : {}, oldObject, data);
            console.log(oldObject, this, newObject);

            return Immutable.freeze(newObject, this.__$ImmutableOptions);
        }

        return null;
    };

    /**
     * @param {Object} object
     * @param {Object} options
     * @return {Object}
     */
    static freeze(object, options) {
        let properties = Object.getOwnPropertyNames(object);
        for (let i = 0; i < properties.length; i++) {
            if (object.hasOwnProperty(properties[i])
                && object[properties[i]] !== null
                && (typeof object[properties[i]] === 'object' || typeof object[properties[i]] === 'function')
                && !Object.isFrozen(object[properties[i]])
                && !(FREEZE_NODE_METHODS.indexOf(properties[i]) !== -1)
                && !(FREEZE_NODE_ARRAY_METHODS.indexOf(properties[i]) !== -1)
                && properties[i] !== '__$ImmutableOptions'
            ) {
                object[properties[i]] = new Immutable(object[properties[i]], options);
            }
        }

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
            for (let i = 0; i < object.length; i++) result.push(object[i]);
        } else if (object instanceof String) {
            result = String(object).toString();
        } else if (typeof object === 'object') {
            for (let property in object) {
                if (object.hasOwnProperty(property)
                    && !(FREEZE_NODE_METHODS.indexOf(property) !== -1)
                    && !(FREEZE_NODE_ARRAY_METHODS.indexOf(property) !== -1)
                    && property !== '__$ImmutableOptions'
                ) {
                    result[property] = (typeof object[property] === 'object' && Object.isFrozen(object[property]))
                        ? Immutable.unFreeze(object[property])
                        : object[property];
                }
            }
        }

        return result;
    }
}

class ImmutableArray extends Array {
    __$ImmutableOptions;

    constructor(array, options) {
        if (options === undefined) options = {};

        super([]);

        this.__$ImmutableOptions = options;

        if ((typeof array === 'object' && array instanceof Array)) {
            for (let i = 0; i < array.length; i++) this[i] = array[i];
        }
    }

    // Immutable methods
    /**
     * @param args
     * @return {Immutable|ImmutableArray|Object}
     */
    concat(...args) {
        return Immutable.freeze(super.concat(...args), this.__$ImmutableOptions);
    }

    /**
     * @param args
     * @return {Immutable|ImmutableArray|Object}
     */
    copyWithin(...args) {
        return Immutable.freeze(super.copyWithin(...args), this.__$ImmutableOptions);
    }

    /**
     * @param args
     * @return {Immutable|ImmutableArray|Object}
     */
    fill(...args) {
        let array = Immutable.unFreeze(Object.assign([], this));
        return Immutable.freeze(array.fill(...args), this.__$ImmutableOptions);
    }

    /**
     * @param args
     * @return {Immutable|ImmutableArray|Object}
     */
    filter(...args) {
        return Immutable.freeze(super.filter(...args), this.__$ImmutableOptions);
    }

    /**
     * @param args
     * @return {Immutable|ImmutableArray|Object}
     */
    map(...args) {
        return Immutable.freeze(super.map(...args), this.__$ImmutableOptions);
    }

    /**
     * @param args
     * @return {Immutable|ImmutableArray|Object}
     */
    pop(...args) {
        let array = Immutable.unFreeze(Object.assign([], this));
        array.pop(...args);
        return Immutable.freeze(array, this.__$ImmutableOptions);
    }

    /**
     * @param args
     * @return {Immutable|ImmutableArray|Object}
     */
    push(...args) {
        let array = Immutable.unFreeze(Object.assign([], this));
        array.push(...args);
        return Immutable.freeze(array, this.__$ImmutableOptions);
    }

    /**
     * @param args
     * @return {Immutable|ImmutableArray|Object}
     */
    reduce(...args) {
        let array = Immutable.unFreeze(Object.assign([], this));
        return Immutable.freeze(array.reduce(...args), this.__$ImmutableOptions);
    }

    /**
     * @param args
     * @return {Immutable|ImmutableArray|Object}
     */
    reduceRight(...args) {
        let array = Immutable.unFreeze(Object.assign([], this));
        return Immutable.freeze(array.reduceRight(...args), this.__$ImmutableOptions);
    }

    /**
     * @param args
     * @return {Immutable|ImmutableArray|Object}
     */
    reverse(...args) {
        let array = Immutable.unFreeze(Object.assign([], this));
        return Immutable.freeze(array.reverse(...args), this.__$ImmutableOptions);
    }

    /**
     * @param args
     * @return {Immutable|ImmutableArray|Object}
     */
    shift(...args) {
        let array = Immutable.unFreeze(Object.assign([], this));
        array.shift(...args);
        return Immutable.freeze(array, this.__$ImmutableOptions);
    }

    /**
     * @param args
     * @return {Immutable|ImmutableArray|Object}
     */
    slice(...args) {
        let array = Immutable.unFreeze(Object.assign([], this));
        return Immutable.freeze(array.slice(...args), this.__$ImmutableOptions);
    }

    /**
     * @param args
     * @return {Immutable|ImmutableArray|Object}
     */
    sort(...args) {
        let array = Immutable.unFreeze(Object.assign([], this));
        return Immutable.freeze(array.sort(...args), this.__$ImmutableOptions);
    }

    /**
     * @param args
     * @return {Immutable|ImmutableArray|Object}
     */
    splice(...args) {
        let array = Immutable.unFreeze(Object.assign([], this));
        return Immutable.freeze(array.splice(...args), this.__$ImmutableOptions);
    }

    /**
     * @param args
     * @return {Immutable|ImmutableArray|Object}
     */
    unshift(...args) {
        let array = Immutable.unFreeze(Object.assign([], this));
        array.unshift(...args);
        return Immutable.freeze(array, this.__$ImmutableOptions);
    }
}
