/**
 * J2D (jQuery Canvas Graphic Engine plugin)
 *
 * @authors DeVinterX, Skaner(j2Ds)
 * @license BSD
 * @version 0.2.0-dev
 */

/**
 * @implements {IMathUtil}
 */
export default class MathUtil {
    static number2Integer(number) {
        return number >> 0;
    }

    static randomColor(min, max, opacity) {
        return 'rgba('
            + MathUtil.random(min, max) + ', '
            + MathUtil.random(min, max) + ', '
            + MathUtil.random(min, max) + ', '
            + opacity + ')';
    }

    static random(min, max, omitZero) {
        let random = (Math.floor(Math.random() * (max - min + 1) + min));
        return (omitZero && random == 0)
            ? MathUtil.random(min, max, omitZero)
            : random;
    }

    static degree2Radian(degree) {
        return degree * (Math.PI / 180);
    }
}

if (window.J2D !== undefined) window.MathUtil = MathUtil;
