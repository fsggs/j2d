/**
 * @class ObjectUtil
 * @exports module:utils/ObjectUtil
 *
 * @constructor
 */
export default class ObjectUtil {
    static extend() {
        let args = Array.prototype.slice.call(arguments);
        let deepness = false;
        if (typeof args[0] === 'boolean') {
            deepness = args[0];
            args.splice(0, 1);
        }

        let out = args[0] || function () {
                if (args[1] !== undefined && args[1] !== null && typeof args[1] === 'object') {
                    return Object.create(args[1])
                }
                return {};
            }();

        for (let i = 1; i < args.length; i++) {
            let object = args[i];

            if (!object) continue;

            for (let key in object) {
                //noinspection JSUnresolvedFunction
                if (object.hasOwnProperty(key)) {
                    if (typeof object[key] === 'object' && object[key] !== null) {
                        out[key] = deepness ? ObjectUtil.extend(deepness, out[key], object[key]) : object[key];
                    } else {
                        out[key] = object[key];
                    }
                }
            }
        }

        return out;
    }
}
