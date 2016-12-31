import Tween from "transitions/Tween";

let EasingEnum;

/**
 * @class Easing
 * @exports module:transitions/utils/Easing
 *
 * @type {{Linear: {None: Easing.Linear.None}, Quadratic: {In: Easing.Quadratic.In, Out: Easing.Quadratic.Out, InOut: Easing.Quadratic.InOut}, Cubic: {In: Easing.Cubic.In, Out: Easing.Cubic.Out, InOut: Easing.Cubic.InOut}, Quartic: {In: Easing.Quartic.In, Out: Easing.Quartic.Out, InOut: Easing.Quartic.InOut}, Quintic: {In: Easing.Quintic.In, Out: Easing.Quintic.Out, InOut: Easing.Quintic.InOut}, Sinusoidal: {In: Easing.Sinusoidal.In, Out: Easing.Sinusoidal.Out, InOut: Easing.Sinusoidal.InOut}, Exponential: {In: Easing.Exponential.In, Out: Easing.Exponential.Out, InOut: Easing.Exponential.InOut}, Circular: {In: Easing.Circular.In, Out: Easing.Circular.Out, InOut: Easing.Circular.InOut}, Elastic: {In: Easing.Elastic.In, Out: Easing.Elastic.Out, InOut: Easing.Elastic.InOut}, Back: {In: Easing.Back.In, Out: Easing.Back.Out, InOut: Easing.Back.InOut}, Bounce: {In: Easing.Bounce.In, Out: Easing.Bounce.Out, InOut: Easing.Bounce.InOut}}}
 */
let Easing = {
    Linear: {
        /**
         * @return {number}
         */
        None: function (k) {
            return k;
        }
    },
    Quadratic: {
        /**
         * @return {number}
         */
        In: function (k) {
            return k * k;
        },

        /**
         * @return {number}
         */
        Out: function (k) {
            return k * (2 - k);
        },

        /**
         * @return {number}
         */
        InOut: function (k) {
            if ((k *= 2) < 1) return 0.5 * k * k;
            return -0.5 * (--k * (k - 2) - 1);
        }
    },

    Cubic: {
        /**
         * @return {number}
         */
        In: function (k) {
            return k * k * k;
        },

        /**
         * @return {number}
         */
        Out: function (k) {
            return --k * k * k + 1;
        },

        /**
         * @return {number}
         */
        InOut: function (k) {
            if ((k *= 2) < 1) return 0.5 * k * k * k;
            return 0.5 * ((k -= 2) * k * k + 2);
        }
    },

    Quartic: {
        /**
         * @return {number}
         */
        In: function (k) {
            return k * k * k * k;
        },

        /**
         * @return {number}
         */
        Out: function (k) {
            return 1 - (--k * k * k * k);
        },

        /**
         * @return {number}
         */
        InOut: function (k) {
            if ((k *= 2) < 1)  return 0.5 * k * k * k * k;
            return -0.5 * ((k -= 2) * k * k * k - 2);
        }
    },

    Quintic: {
        /**
         * @return {number}
         */
        In: function (k) {
            return k * k * k * k * k;
        },

        /**
         * @return {number}
         */
        Out: function (k) {
            return --k * k * k * k * k + 1;
        },

        /**
         * @return {number}
         */
        InOut: function (k) {
            if ((k *= 2) < 1) return 0.5 * k * k * k * k * k;
            return 0.5 * ((k -= 2) * k * k * k * k + 2);
        }

    },

    Sinusoidal: {
        /**
         * @return {number}
         */
        In: function (k) {
            return 1 - Math.cos(k * Math.PI / 2);
        },

        /**
         * @return {number}
         */
        Out: function (k) {
            return Math.sin(k * Math.PI / 2);
        },

        /**
         * @return {number}
         */
        InOut: function (k) {
            return 0.5 * (1 - Math.cos(Math.PI * k));
        }
    },

    Exponential: {
        /**
         * @return {number}
         */
        In: function (k) {
            return k === 0 ? 0 : Math.pow(1024, k - 1);
        },

        /**
         * @return {number}
         */
        Out: function (k) {
            return k === 1 ? 1 : 1 - Math.pow(2, -10 * k);
        },

        /**
         * @return {number}
         */
        InOut: function (k) {
            if (k === 0) return 0;
            if (k === 1) return 1;
            if ((k *= 2) < 1) return 0.5 * Math.pow(1024, k - 1);

            return 0.5 * (-Math.pow(2, -10 * (k - 1)) + 2);
        }
    },

    Circular: {
        /**
         * @return {number}
         */
        In: function (k) {
            return 1 - Math.sqrt(1 - k * k);
        },

        /**
         * @return {number}
         */
        Out: function (k) {
            return Math.sqrt(1 - (--k * k));
        },

        /**
         * @return {number}
         */
        InOut: function (k) {
            if ((k *= 2) < 1) return -0.5 * (Math.sqrt(1 - k * k) - 1);
            return 0.5 * (Math.sqrt(1 - (k -= 2) * k) + 1);
        }
    },

    Elastic: {
        /**
         * @return {number}
         */
        In: function (k) {
            var s;
            var a = 0.1;
            var p = 0.4;

            if (k === 0) return 0;
            if (k === 1) return 1;

            if (!a || a < 1) {
                a = 1;
                s = p / 4;
            } else {
                s = p * Math.asin(1 / a) / (2 * Math.PI);
            }

            return -(a * Math.pow(2, 10 * (k -= 1)) * Math.sin((k - s) * (2 * Math.PI) / p));
        },

        /**
         * @return {number}
         */
        Out: function (k) {
            var s;
            var a = 0.1;
            var p = 0.4;

            if (k === 0) return 0;
            if (k === 1) return 1;

            if (!a || a < 1) {
                a = 1;
                s = p / 4;
            } else {
                s = p * Math.asin(1 / a) / (2 * Math.PI);
            }

            return (a * Math.pow(2, -10 * k) * Math.sin((k - s) * (2 * Math.PI) / p) + 1);
        },

        /**
         * @return {number}
         */
        InOut: function (k) {

            var s;
            var a = 0.1;
            var p = 0.4;

            if (k === 0) return 0;
            if (k === 1) return 1;

            if (!a || a < 1) {
                a = 1;
                s = p / 4;
            } else {
                s = p * Math.asin(1 / a) / (2 * Math.PI);
            }

            if ((k *= 2) < 1) {
                return -0.5 * (a * Math.pow(2, 10 * (k -= 1)) * Math.sin((k - s) * (2 * Math.PI) / p));
            }

            return a * Math.pow(2, -10 * (k -= 1)) * Math.sin((k - s) * (2 * Math.PI) / p) * 0.5 + 1;

        }

    },

    Back: {
        /**
         * @return {number}
         */
        In: function (k) {
            var s = 1.70158;

            return k * k * ((s + 1) * k - s);
        },

        /**
         * @return {number}
         */
        Out: function (k) {
            var s = 1.70158;

            return --k * k * ((s + 1) * k + s) + 1;
        },

        /**
         * @return {number}
         */
        InOut: function (k) {
            var s = 1.70158 * 1.525;
            if ((k *= 2) < 1) return 0.5 * (k * k * ((s + 1) * k - s));

            return 0.5 * ((k -= 2) * k * ((s + 1) * k + s) + 2);
        }
    },

    Bounce: {
        /**
         * @return {number}
         */
        In: function (k) {
            return 1 - Tween.Easing.Bounce.Out(1 - k);
        },

        /**
         * @return {number}
         */
        Out: function (k) {
            if (k < (1 / 2.75)) {
                return 7.5625 * k * k;
            } else if (k < (2 / 2.75)) {
                return 7.5625 * (k -= (1.5 / 2.75)) * k + 0.75;
            } else if (k < (2.5 / 2.75)) {
                return 7.5625 * (k -= (2.25 / 2.75)) * k + 0.9375;
            } else {
                return 7.5625 * (k -= (2.625 / 2.75)) * k + 0.984375;
            }
        },

        /**
         * @return {number}
         */
        InOut: function (k) {
            if (k < 0.5) return Tween.Easing.Bounce.In(k * 2) * 0.5;
            return Tween.Easing.Bounce.Out(k * 2 - 1) * 0.5 + 0.5;
        }
    },

    get: (easing) => {
        if (EasingEnum[easing] !== undefined) {
            return EasingEnum[easing];
        }

        // TODO:: Exceptions
        //throw new InvalidArgumentException('Unknown easing: ' + easing);
    },
    register: (easing, easingFunction) => {
        EasingEnum[easing] = easingFunction;
    }
};

EasingEnum = {
    'linear': Easing.Linear.None,

    'quadratic-in': Easing.Quadratic.In,
    'quadratic-out': Easing.Quadratic.Out,
    'quadratic-in-out': Easing.Quadratic.InOut,

    'cubic-in': Easing.Cubic.In,
    'cubic-out': Easing.Cubic.Out,
    'cubic-in-out': Easing.Cubic.InOut,

    'quartic-in': Easing.Quartic.In,
    'quartic-out': Easing.Quartic.Out,
    'quartic-in-out': Easing.Quartic.InOut,

    'quintic-in': Easing.Quintic.In,
    'quintic-out': Easing.Quintic.Out,
    'quintic-in-out': Easing.Quintic.InOut,

    'sinusoidal-in': Easing.Sinusoidal.In,
    'sinusoidal-out': Easing.Sinusoidal.Out,
    'sinusoidal-in-out': Easing.Sinusoidal.InOut,

    'exponential-in': Easing.Exponential.In,
    'exponential-out': Easing.Exponential.Out,
    'exponential-in-out': Easing.Exponential.InOut,

    'circular-in': Easing.Circular.In,
    'circular-out': Easing.Circular.Out,
    'circular-in-out': Easing.Circular.InOut,

    'elastic-in': Easing.Elastic.In,
    'elastic-out': Easing.Elastic.Out,
    'elastic-in-out': Easing.Elastic.InOut,

    'back-in': Easing.Back.In,
    'back-out': Easing.Back.Out,
    'back-in-out': Easing.Back.InOut,

    'bounce-in': Easing.Bounce.In,
    'bounce-out': Easing.Bounce.Out,
    'bounce-in-out': Easing.Bounce.InOut
};

export default Easing;
