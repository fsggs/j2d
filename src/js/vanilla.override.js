/**
 * J2D Vanilla Override Module
 *
 * @authors DeVinterX
 * @license BSD
 * @version 1.0.3
 */

!function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('vanilla.override', [], factory);
    } else {
        factory();
    }
}(global, function () {
        "use strict";

        var vanilla = {
            version: '1.0.3'
        };

        (function () {
            if (!global.vanilla || global.vanilla.version !== vanilla.version) {
                global.vanilla = vanilla;

                console.info('J2D Initialize "vanilla.override" module.');

                if (Array.prototype.equals) {
                    console.warn('Overriding existing Array.prototype.equals.');
                }
                global.Array.prototype.equals = function (array) {
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
                };
                Object.defineProperty(Array.prototype, 'equals', {enumerable: false});

                if (Array.prototype.contains) {
                    console.warn('Overriding existing Array.prototype.contains.');
                }
                Array.prototype.contains = function (object) {
                    var i = this.length;
                    while (i--) {
                        if (this[i] === object) {
                            return true;
                        }
                    }
                    return false;
                };
                Object.defineProperty(Array.prototype, 'contains', {enumerable: false});

                if (Array.prototype.each) {
                    console.warn('Overriding existing Array.prototype.each.');
                }
                Array.prototype.each = function (callback) {
                    if (!callback) return false;
                    var result = false;
                    for (var i = 0; i < this.length; i++) {
                        if ((result = callback(this[i], i)) == false) {
                            return result;
                        }
                    }
                };
                Object.defineProperty(Array.prototype, 'each', {enumerable: false});

                if (Array.prototype.add) {
                    console.warn('Overriding existing Array.prototype.add.');
                }
                Array.prototype.add = function (key, value) {
                    if (this.contains(key))
                        this[key] = value;
                    else {
                        this.push(key);
                        this[key] = value;
                    }
                };
                Object.defineProperty(Array.prototype, 'add', {enumerable: false});

                if (Array.prototype.remove) {
                    console.warn('Overriding existing Array.prototype.remove.');
                }
                Array.prototype.remove = function (key) {
                    for (var i = 0; i < this.length; ++i) {
                        if (this[i] == key) {
                            this.splice(i, 1);
                            return;
                        }
                    }
                };
                Object.defineProperty(Array.prototype, 'remove', {enumerable: false});

                /** Date **/
                var dateFormat = function () {
                    var token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
                        timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
                        timezoneClip = /[^-+\dA-Z]/g,
                        pad = function (val, len) {
                            val = String(val);
                            len = len || 2;
                            while (val.length < len) val = "0" + val;
                            return val;
                        };

                    return function (date, mask, utc) {
                        var dF = dateFormat;

                        if (arguments.length == 1 && Object.prototype.toString.call(date) == "[object String]" && !/\d/.test(date)) {
                            mask = date;
                            date = undefined;
                        }

                        date = date ? new Date(date) : new Date;
                        if (isNaN(date)) throw new SyntaxError("invalid date");

                        mask = String(dF.masks[mask] || mask || dF.masks["default"]);

                        if (mask.slice(0, 4) == "UTC:") {
                            mask = mask.slice(4);
                            utc = true;
                        }

                        var _ = utc ? "getUTC" : "get",
                            d = date[_ + "Date"](),
                            D = date[_ + "Day"](),
                            m = date[_ + "Month"](),
                            y = date[_ + "FullYear"](),
                            H = date[_ + "Hours"](),
                            M = date[_ + "Minutes"](),
                            s = date[_ + "Seconds"](),
                            L = date[_ + "Milliseconds"](),
                            o = utc ? 0 : date.getTimezoneOffset(),
                            flags = {
                                d: d,
                                dd: pad(d),
                                ddd: dF.i18n.dayNames[D],
                                dddd: dF.i18n.dayNames[D + 7],
                                m: m + 1,
                                mm: pad(m + 1),
                                mmm: dF.i18n.monthNames[m],
                                mmmm: dF.i18n.monthNames[m + 12],
                                yy: String(y).slice(2),
                                yyyy: y,
                                h: H % 12 || 12,
                                hh: pad(H % 12 || 12),
                                H: H,
                                HH: pad(H),
                                M: M,
                                MM: pad(M),
                                s: s,
                                ss: pad(s),
                                l: pad(L, 3),
                                L: pad(L > 99 ? Math.round(L / 10) : L),
                                t: H < 12 ? "a" : "p",
                                tt: H < 12 ? "am" : "pm",
                                T: H < 12 ? "A" : "P",
                                TT: H < 12 ? "AM" : "PM",
                                Z: utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
                                o: (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
                                S: ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10]
                            };

                        return mask.replace(token, function ($0) {
                            return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
                        });
                    };
                }();

                dateFormat.masks = {
                    "default": "ddd mmm dd yyyy HH:MM:ss",
                    shortDate: "m/d/yy",
                    mediumDate: "mmm d, yyyy",
                    longDate: "mmmm d, yyyy",
                    fullDate: "dddd, mmmm d, yyyy",
                    shortTime: "h:MM TT",
                    mediumTime: "h:MM:ss TT",
                    longTime: "h:MM:ss TT Z",
                    isoDate: "yyyy-mm-dd",
                    isoTime: "HH:MM:ss",
                    isoDateTime: "yyyy-mm-dd'T'HH:MM:ss",
                    isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
                };

                dateFormat.i18n = {
                    dayNames: [
                        "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",
                        "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
                    ],
                    monthNames: [
                        "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
                        "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
                    ]
                };

                if (Date.prototype.format) {
                    console.warn('Overriding existing Date.prototype.format.');
                }
                Date.prototype.format = function (mask, utc) {
                    return dateFormat(this, mask, utc);
                };
                Object.defineProperty(Date.prototype, 'format', {enumerable: false});
            }
        })();

        return vanilla;
    }
);
