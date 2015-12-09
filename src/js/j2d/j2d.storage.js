/**
 * J2D (jQuery plugin of the fork j2ds)
 *
 * @authors Skaner, likerRr, DeVinterX
 * @license BSD, zlib
 * @version 0.1.5a
 * @see https://github.com/SkanerSoft/J2ds/commit/501b8993fc41960794572dc481a5f2fe492da349
 */

!function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else {
        factory(root.jQuery);
    }
}(global, function ($) {
    "use strict";

    /*!
     * jquery.storage.js 0.0.3 - https://github.com/yckart/jquery.storage.js
     * The client-side storage for every browser, on any device.
     *
     * Copyright (c) 2012 Yannick Albert (http://yckart.com)
     * Licensed under the MIT license (http://www.opensource.org/licenses/mit-license.php).
     * 2013/02/10
     **/
    if ($['localStorage'] === undefined || $['sessionStorage'] === undefined) {
        $.map(['localStorage', 'sessionStorage'], function (method) {
            var defaults = {
                cookiePrefix: 'fallback:' + method + ':',
                cookieOptions: {
                    path: '/',
                    domain: document.domain,
                    expires: ('localStorage' === method) ? {expires: 365} : undefined
                }
            };

            try {
                $.support[method] = method in window && window[method] !== null;
            } catch (e) {
                $.support[method] = false;
            }

            $[method] = function (key, value) {
                var options = $.extend({}, defaults, $[method].options);

                this.getItem = function (key) {
                    var returns = function (key) {
                        return JSON.parse($.support[method] ? window[method].getItem(key) : $.cookie(options.cookiePrefix + key));
                    };
                    if (typeof key === 'string') return returns(key);

                    var arr = [],
                        i = key.length;
                    while (i--) arr[i] = returns(key[i]);
                    return arr;
                };

                this.setItem = function (key, value) {
                    value = JSON.stringify(value);
                    return $.support[method] ?
                        window[method].setItem(key, value) : $.cookie(options.cookiePrefix + key, value, options.cookieOptions);
                };

                this.removeItem = function (key) {
                    return $.support[method]
                        ? window[method].removeItem(key)
                        : $.cookie(options.cookiePrefix + key, null, $.extend(options.cookieOptions, {
                            expires: -1
                        }
                    ));
                };

                this.clear = function () {
                    if ($.support[method]) {
                        return window[method].clear();
                    } else {
                        var reg = new RegExp('^' + options.cookiePrefix, ''),
                            opts = $.extend(options.cookieOptions, {
                                expires: -1
                            });

                        if (document.cookie && document.cookie !== '') {
                            $.map(document.cookie.split(';'), function (cookie) {
                                if (reg.test(cookie = $.trim(cookie))) {
                                    $.cookie(cookie.substr(0, cookie.indexOf('=')), null, opts);
                                }
                            });
                        }
                    }
                };

                if (typeof key !== "undefined") {
                    return typeof value !== "undefined"
                        ? ( value === null ? this.removeItem(key) : this.setItem(key, value) ) : this.getItem(key);
                }

                return this;
            };

            $[method].options = defaults;
        });
    }
    /*!
     * End plugin for jquery
     */

    var Storage = function (uid, storageType) {
        this.storage = (storageType === 'sessionStorage') ? 'sessionStorage' : 'localStorage';
        this.id = (uid !== undefined && typeof uid === 'string') ? uid : 'xxxxxxxx'.replace(/[xy]/g,
            function (c) {
                var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            }
        );
    };

    Storage.prototype.load = function (name) {
        return $[this.storage](this.id + '_' + name);
    };

    Storage.prototype.exist = function (name) {
        return !!($[this.storage](this.id + '_' + name));
    };

    Storage.prototype.save = function (name, value) {
        $[this.storage](this.id + '_' + name, value);
    };

    Storage.prototype.loadNode = function (name, node) {
        return node.loadJSON($[this.storage](this.id + '_' + name));
    };

    Storage.prototype.saveNode = function (name, node) {
        $[this.storage](this.id + '_' + name, node.saveJSON());
    };

    if (global.J2D !== undefined) global.Storage = Storage;
    return Storage;
});
