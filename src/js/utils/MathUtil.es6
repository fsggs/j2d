/**
 * @class MathUtil
 * @exports module:utils/MathUtil
 *
 * @constructor
 */
export default class MathUtil {
    /**
     * @param {number} number
     * @returns {number}
     */
    static number2Integer(number) {
        return number >> 0;
    }

    /**
     * @param {number} number
     * @returns {boolean}
     */
    static isInteger(number) {
        return typeof number === "number" && isFinite(number)
            && number > -9007199254740992 && number < 9007199254740992
            && Math.floor(number) === number;
    }

    /**
     * @param {number} min
     * @param {number} max
     * @param {number} opacity
     * @returns {string}
     */
    static randomColor(min, max, opacity) {
        return 'rgba('
            + MathUtil.random(min, max) + ', '
            + MathUtil.random(min, max) + ', '
            + MathUtil.random(min, max) + ', '
            + opacity + ')';
    }

    static vectorColorToRGBA(vector4) {
        return 'rgba('
            + parseInt(vector4[0] * 100) + ', '
            + parseInt(vector4[1] * 100) + ', '
            + parseInt(vector4[2] * 100) + ', '
            + vector4[3] + ')';
    }

    /**
     * @param {number} min
     * @param {number} max
     * @param {boolean} [omitZero]
     * @returns {number}
     */
    static random(min, max, omitZero) {
        let random = (Math.floor(Math.random() * (max - min + 1) + min));
        return (omitZero && random == 0)
            ? MathUtil.random(min, max, omitZero)
            : random;
    }

    /**
     * @param {number} degree
     * @returns {number}
     */
    static degree2Radian(degree) {
        return degree * (Math.PI / 180);
    }

    /**
     * @param {number} radian
     * @returns {number}
     */
    static radian2Degree(radian) {
        return radian * (180 / Math.PI);
    }
}
