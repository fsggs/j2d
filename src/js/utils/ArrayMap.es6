/**
 * @class ArrayMap
 * @exports module:utils/ArrayMap
 *
 * @constructor
 * @extends Array
 * @param args
 */
export default class ArrayMap extends Array {
    last = () => {
        return this[this.length - 1];
    };

    constructor(args) {
        super(args);
    }

    /**
     * @param {ArrayMap.<T>} array
     * @returns {boolean}
     */
    equals(array) {
        if (!array)
            return false;

        if (this.length != array.length)
            return false;

        for (var i = 0, l = this.length; i < l; i++) {
            if (this[i] instanceof Array && array[i] instanceof Array) {
                if (!this[i].equals(array[i]))
                    return false;
            }
            else if (this[i] != array[i]) {
                return false;
            }
        }
        return true;
    }

    /**
     * @param {string|Object} object
     * @returns {boolean}
     */
    contains(object) {
        var i = this.length;
        while (i--) {
            if (this[i] === object) {
                return true;
            }
        }
        return false;
    }

    /**
     * @param {Function} callback
     * @returns {boolean}
     */
    each(callback) {
        if (!callback) return false;
        var result = false;
        for (var i = 0; i < this.length; i++) {
            if ((result = callback(this[i], i)) == false) {
                return result;
            }
        }
        return result;
    }

    /**
     * @param {string|Object} key
     * @param {*} value
     * @returns {ArrayMap.<T>}
     */
    add(key, value) {
        if (this.contains(key))
            this[key] = value;
        else {
            this.push(key);
            this[key] = value;
        }
        return this;
    }

    /**
     * @param {string|Object} key
     * @returns {*}
     */
    get(key) {
        return this.contains(key) ? this[key] : null;
    }

    /**
     * @param {string|Object} key
     * @returns {ArrayMap.<T>}
     */
    remove(key) {
        for (var i = 0; i < this.length; ++i) {
            if (this[i] == key) {
                this.splice(i, 1);
                delete this[key];
                return this;
            }
        }
        return this;
    }
}
