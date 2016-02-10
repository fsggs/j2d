/**
 * J2D (jQuery Canvas Graphic Engine plugin)
 *
 * @authors DeVinterX, Skaner(j2Ds)
 * @license BSD
 * @version 0.2.0-dev
 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('io/InputManager', ['jquery', 'utils/ArrayMap'], factory);
    } else if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = factory(require('jquery'), require('utils/ArrayMap'));
    } else {
        factory(root.jQuery, root.ArrayMap);
    }
}(typeof window !== 'undefined' ? window : global, function ($, ArrayMap) {
    "use strict";

    var InputManager = function (j2d) {
        this.j2d = j2d;

        this.id = j2d.id;
        this.element = j2d.element;

        this.data = {
            mouse: {
                startPosition: {
                    x: 0,
                    y: 0
                },
                currentPosition: {
                    x: 0,
                    y: 0
                },
                previousDistance: 0,
                distance: 0
            },
            viewport: {
                position: {
                    x: 0,
                    y: 0
                }
            },
            enabled: false,
            enableAdditionalData: false,
            keysPressed: new ArrayMap(),
            writeMode: false,
            timePressed: 0,
            preventAll: false,

            cursor: {
                enabled: false,
                image: 'auto'
            }
        };
        this.keyMap = {
            //DEBUG_INFO: [[InputManager.key.KEY_CTRL, InputManager.key.KEY_F1], 'j2d.debug.toggleScreen', {}],
            FULLSCREEN: [[InputManager.key.KEY_CTRL, InputManager.key.KEY_F11], 'j2d.scene.toggleFullScreen', {}]
        };
    };

    var checkKeyMap = function (e, enableCallback) {
        if (enableCallback === undefined) enableCallback = true;

        var j2d = e.data.manager.j2d,
            manager = e.data.manager,
            keyCode = e.which,
            keyMap = e.data.manager.keyMap;

        for (var index in keyMap) {
            if (keyMap.hasOwnProperty(index)) {
                var value = keyMap[index];
                if (!$.isArray(value[0]) && value[0] === keyCode && !!value[1]) {
                    if (typeof value[1] === 'string') {
                        value[1] = eval('(' + value[1] + ')');
                    }
                    if ((typeof value[1] === 'function') && enableCallback) {
                        value[1](j2d, value[2]);
                    }
                    return true;
                } else if ($.isArray(value[0])
                    && manager.data.keysPressed.equals(value[0]) && !!value[1]
                ) {
                    if (typeof value[1] === 'string') {
                        value[1] = eval('(' + value[1] + ')');
                    }
                    if (typeof value[1] === 'function' && enableCallback) {
                        value[1](j2d, value[2]);
                    }
                    return true
                }
            }
        }
        return false
    };

    var events = {
        onMouseClick: function (e) {
            var manager = e.data.manager;
            if (!manager.data.enabled || !manager.j2d.isPlay || !manager.j2d.element.hasClass('active')) return true;
            var keysPressed = manager.data.keysPressed;
            var keyCode = getKey(InputManager.key, e.which) || 'KEY_UNKNOWN_' + e.which;
            var mouse = manager.data.mouse;

            if (e.data.event !== 2) {
                if (e.data.event === 0) {
                    if (-1 === $.inArray(InputManager.key[keyCode], keysPressed)) {
                        keysPressed.push(InputManager.key[keyCode]);

                        if (manager.data.enableAdditionalData) {
                            mouse.startPosition.x = e.pageX;
                            mouse.startPosition.y = e.pageY;
                            mouse.distance = 0;

                            manager.data.timePressed = e.timeStamp;
                        }
                    }
                    if (checkKeyMap(e, false) || manager.data.preventAll) {
                        e.preventDefault();
                    }
                } else {
                    if (checkKeyMap(e) || manager.data.preventAll) {
                        e.preventDefault();
                    }
                    if (manager.data.enableAdditionalData) {
                        mouse.previousDistance = mouse.distance;
                        mouse.startPosition.x = 0;
                        mouse.startPosition.y = 0;
                    }

                    keysPressed.splice(
                        keysPressed.indexOf(InputManager.key[keyCode]), 1
                    );
                }
                manager.element.trigger(e.data.event === 0 ?
                    'mouseKeyDown' : 'mouseKeyUp', {keyCode: keyCode}
                );
            } else {
                if (checkKeyMap(e, false)) {
                    e.preventDefault();
                }
            }
        },

        onMouseWheel: function (e) {
            var manager = e.data.manager;
            if (!manager.data.enabled || !manager.j2d.isPlay || !manager.j2d.element.hasClass('active')) return true;
            var keysPressed = manager.data.keysPressed;
            var keyCode = (e.originalEvent.wheelDelta / 120 > 0) ?
                getKey(InputManager.key, 4) : getKey(InputManager.key, 5);

            e.which = (e.originalEvent.wheelDelta / 120 > 0) ? 4 : 5;

            if (-1 === $.inArray(InputManager.key[keyCode], keysPressed)) {
                keysPressed.push(InputManager.key[keyCode]);
            }

            if (checkKeyMap(e) || manager.data.preventAll) {
                e.preventDefault();
                manager.fixMouseWheel();
            }

            manager.element.trigger('mouseWheel', {keyCode: keyCode});
        },

        mouseWheelCancel: function (keysPressed, keyCode) {
            keysPressed.splice(
                keysPressed.indexOf(InputManager.key[keyCode]), 1
            );
        },

        onMouseMove: function (e) {
            var manager = e.data.manager;
            var mouse = e.data.manager.data.mouse;

            manager.data.mouse.currentPosition.x = e.pageX;
            manager.data.mouse.currentPosition.y = e.pageY;

            if (e.data.manager.data.enableAdditionalData) {
                mouse.distance = Math.sqrt(
                    Math.pow((mouse.currentPosition.x - mouse.startPosition.x), 2)
                    + Math.pow((mouse.currentPosition.y - mouse.startPosition.y), 2)
                ).toFixed(1);
            }
        },

        onKeyboardPress: function (e) {
            var manager = e.data.manager;
            if (!manager.data.enabled || !manager.j2d.isPlay || !manager.element.hasClass('active')) return true;
            var keysPressed = manager.data.keysPressed;
            var keyCode = getKey(InputManager.key, e.which) || 'KEY_UNKNOWN_' + e.which;
            if (e.data.event === 2 && true === manager.data.writeMode) {
                var char = String.fromCharCode(e.which || e.keyCode);
                e.preventDefault();
                manager.element.focus().trigger('keyboardCharPress', {
                    key: e.which || e.keyCode,
                    keyCode: keyCode,
                    char: char
                });
            }

            if (e.data.event !== 2 && false === manager.data.writeMode) {
                if (e.data.event === 0) {
                    if (-1 === $.inArray(InputManager.key[keyCode], keysPressed)) {
                        keysPressed.push(InputManager.key[keyCode]);
                        if (manager.data.enableAdditionalData) {
                            manager.data.timePressed = e.timeStamp;
                        }
                    }
                    if (checkKeyMap(e, false) || manager.data.preventAll) {
                        e.preventDefault();
                    }
                } else {
                    if (checkKeyMap(e) || manager.data.preventAll) {
                        e.preventDefault();
                    }

                    keysPressed.splice(
                        keysPressed.indexOf(InputManager.key[keyCode]), 1
                    );
                }

                manager.element.trigger(e.data.event === 0 ?
                    'keyboardKeyDown' : 'keyboardKeyUp', {keyCode: keyCode, key: e.which || e.keyCode}
                );
            }

            if (e.data.event !== 2 && true === manager.data.writeMode) {
                manager.element.trigger(e.data.event === 0 ?
                    'keyboardKeyDown' : 'keyboardKeyUp', {keyCode: keyCode, key: e.which || e.keyCode}
                );
            }
        },

        onTouchTap: function (e) {
            var manager = e.data.manager;
            if (!manager.data.enabled || !manager.j2d.isPlay || !manager.j2d.element.hasClass('active')) return true;
            var keysPressed = manager.data.keysPressed;
            var keyCode = getKey(InputManager.key, e.which + 1) || 'KEY_UNKNOWN_' + e.which;
            var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
            var mouse = manager.data.mouse;

            if (e.data.event === 0) {
                if (-1 === $.inArray(InputManager.key[keyCode], keysPressed)) {
                    keysPressed.push(InputManager.key[keyCode]);
                    if (manager.data.enableAdditionalData) {
                        mouse.startPosition.x = touch.pageX;
                        mouse.startPosition.y = touch.pageY;
                        mouse.distance = 0;

                        manager.data.timePressed = e.timeStamp;
                    }
                }
                if (checkKeyMap(e, false) || manager.data.preventAll) {
                    e.preventDefault();
                }
            } else {
                if (checkKeyMap(e) || manager.data.preventAll) {
                    e.preventDefault();
                }

                if (manager.data.enableAdditionalData) {
                    mouse.previousDistance = mouse.distance;
                    mouse.startPosition.x = 0;
                    mouse.startPosition.y = 0;
                }

                keysPressed.splice(
                    keysPressed.indexOf(InputManager.key[keyCode]), 1
                );
            }

            manager.element.trigger(e.data.event === 0 ?
                'mouseKeyDown' : 'mouseKeyUp', {keyCode: keyCode}
            );
        },

        onTouchMove: function (e) {
            var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
            var mouse = e.data.manager.data.mouse;

            mouse.currentPosition.x = touch.pageX.toFixed(0);
            mouse.currentPosition.y = touch.pageY.toFixed(0);

            if (e.data.manager.data.enableAdditionalData) {
                mouse.distance = Math.sqrt(
                    Math.pow((mouse.currentPosition.x - mouse.startPosition.x), 2)
                    + Math.pow((mouse.currentPosition.y - mouse.startPosition.y), 2)
                ).toFixed(1);
            }
        }
    };

    var bindEvents = function (manager) {
        var selector = '[guid=' + manager.id + ']';

        $(document).on('contextmenu', selector, {manager: manager, event: 2}, events.onMouseClick);
        $(document).on('mousedown', selector, {manager: manager, event: 0}, events.onMouseClick);
        $(document).on('mouseup', selector, {manager: manager, event: 1}, events.onMouseClick);
        $(document).on('mousewheel', selector, {manager: manager}, events.onMouseWheel);
        $(document).on('mousemove', selector, {manager: manager}, events.onMouseMove);

        $(document).on('keydown', null, {manager: manager, event: 0}, events.onKeyboardPress);
        $(document).on('keyup', null, {manager: manager, event: 1}, events.onKeyboardPress);
        $(document).on('keypress', null, {manager: manager, event: 2}, events.onKeyboardPress);

        $(document).on('touchstart', selector, {manager: manager, event: 0}, events.onTouchTap);
        $(document).on('touchend', selector, {manager: manager, event: 1}, events.onTouchTap);
        $(document).on('touchmove ', selector, {manager: manager}, events.onTouchMove);
    };

    var unbindEvents = function (manager) {
        var selector = '[guid=' + manager.id + ']';

        $(document).off('contextmenu', selector, {manager: manager, event: 1}, events.onMouseClick);
        $(document).off('mousedown', selector, {manager: manager, event: 0}, events.onMouseClick);
        $(document).off('mouseup', selector, {manager: manager, event: 1}, events.onMouseClick);
        $(document).off('mousewheel', selector, {manager: manager}, events.onMouseWheel);
        $(document).off('mousemove', selector, {manager: manager}, events.onMouseMove);

        $(document).off('keydown', null, {manager: manager, event: 0}, events.onKeyboardPress);
        $(document).off('keyup', null, {manager: manager, event: 1}, events.onKeyboardPress);
        $(document).off('keypress', null, {manager: manager, event: 2}, events.onKeyboardPress);

        $(document).off('touchstart', selector, {manager: manager, event: 0}, events.onTouchTap);
        $(document).off('touchend', selector, {manager: manager, event: 1}, events.onTouchTap);
        $(document).off('touchmove ', selector, {manager: manager}, events.onTouchMove);
    };

    InputManager.prototype.init = function () {
        if (!this.data.enabled && global.j2dPlugin.pluginInit) {
            bindEvents(this);

            this.data.enabled = true;
        }
    };

    InputManager.prototype.update = function () {
        if (!this.data.enabled) return false;

        var dX = this.j2d.scene.canvas.offsetWidth / this.j2d.scene.width,
            dY = this.j2d.scene.canvas.offsetHeight / this.j2d.scene.height,
            x = this.data.mouse.currentPosition.x / dX,
            y = this.data.mouse.currentPosition.y / dY;

        var offset = this.element.offset();
        this.data.viewport.x = this.j2d.scene.viewport.x + x - offset.left;
        this.data.viewport.y = this.j2d.scene.viewport.y + y - offset.top;
    };

    InputManager.prototype.flush = function () {
        this.data.keysPressed.length = 0;
    };

    InputManager.prototype.clear = function () {
    };

    InputManager.prototype.fixMouseWheel = function () {
        var keyPressed = this.data.keysPressed;
        if (-1 !== $.inArray(InputManager.key.SCROLL_MOUSE_UP, keyPressed)) {
            events.mouseWheelCancel(keyPressed, InputManager.key.SCROLL_MOUSE_UP);
        } else if (-1 !== $.inArray(InputManager.key.SCROLL_MOUSE_DOWN, keyPressed)) {
            events.mouseWheelCancel(keyPressed, InputManager.key.SCROLL_MOUSE_DOWN);
        }
    };

    InputManager.prototype.enable = function () {
        if (!this.data.enabled) {
            //bindEvents(this);
            this.data.enabled = false;
        }
    };

    InputManager.prototype.disable = function () {
        if (this.data.enabled) {
            //unbindEvents(this);
            this.data.enabled = false;
        }
    };

    InputManager.prototype.load = function (newKeyMap) {
        var oldKeyMap = JSON.stringify(this.keyMap);
        this.keyMap = JSON.parse(newKeyMap);
        return oldKeyMap;
    };

    InputManager.prototype.save = function () {
        return JSON.stringify(this.keyMap);
    };

    /** +KeyMap Manager **/
    InputManager.prototype.setKeys = function (mapObject) {
        this.keyMap = $.extend(true, {}, this.keyMap, mapObject);
    };
    /** -KeyMap Manager **/

    var getPressData = function (manager, keyList) {
        if (!manager.data.enableAdditionalData) return true;
        return {
            keyList: keyList,
            time: Date.now() - manager.data.timePressed
        };
    };

    InputManager.prototype.getMouseMoveDistance = function () {
        if (!this.data.enableAdditionalData) return 0;
        return {current: this.data.mouse.distance, previous: this.data.mouse.previousDistance};
    };

    /** +Input Checkers **/
    InputManager.prototype.checkPressedKeyList = function (keyList) {
        if ($.isArray(keyList)) {
            if (keyList.length !== this.data.keysPressed.length) {
                return false;
            } else if (this.data.keysPressed.equals(keyList)) {
                this.fixMouseWheel();
                return getPressData(this, keyList);
            }
            this.fixMouseWheel();
            return false;
        }
        //if (!this.data.keysPressed.equals([])) console.log(this.data.keysPressed);
        if (isNaN(keyList)) return false;
        if (-1 !== this.data.keysPressed.indexOf(keyList)) {
            this.fixMouseWheel();
            return getPressData(this, keyList);
        }
        this.fixMouseWheel();
        return false;
    };

    InputManager.prototype.checkPressedKeyMap = function (key) {
        if (this.keyMap[key] === undefined) return false;
        var keyList = this.keyMap[key][0];

        return this.checkPressedKeyList(keyList);
    };

    //InputManager.prototype.getPosition = function () {
    //    return this.j2d.vector.v2f(this.data.viewport.x + 0.5, this.data.viewport.y + 0.5);
    //};

    //InputManager.prototype.onNode = function (id) {
    //    if (!id.layer.visible) return false;
    //    return (this.data.viewport.x > id.options.position.x && this.data.viewport.x < id.options.position.x + id.options.size.x) &&
    //        (this.data.viewport.y > id.options.position.y && this.data.viewport.y < id.options.position.y + id.options.size.y);
    //};
    /** -Input Checkers **/

    /** +Input Write Mode **/
    InputManager.prototype.setWriteMode = function (mode) {
        this.data.writeMode = !!mode;
    };

    InputManager.prototype.isWriteMode = function () {
        return !!this.data.writeMode;
    };
    /** -Input Write Mode **/

    /** +Cursor **/
    InputManager.prototype.setCursorImage = function (image) {
        this.data.cursor.image = 'url("' + image + '"), auto';
        $(this.element).css('cursor', this.data.cursor.image);
    };

    InputManager.prototype.toggleCursor = function (enable) {
        if (enable !== undefined) {
            this.data.cursor.enable = !!enable;
        } else {
            this.data.cursor.enable = !this.data.cursor.enable;
        }

        if (!this.data.cursor.enable) {
            this.data.cursor.image = $(this.j2d.element).css('cursor');
            $(this.element).css('cursor', 'none');
        } else {
            $(this.element).css('cursor', this.data.cursor.image);
        }
    };

    InputManager.prototype.isCursorVisible = function () {
        return !!this.data.cursor.enable;
    };
    /** -Cursor **/

    /** static keys arrayList **/
    InputManager.key = {
        KEY_MOUSE_LEFT: 1,
        KEY_MOUSE_MIDDLE: 2,
        KEY_MOUSE_RIGHT: 3,

        SCROLL_MOUSE_UP: 4,
        SCROLL_MOUSE_DOWN: 5,

        KEY_BACKSPACE: 8,
        KEY_TAB: 9,
        KEY_ENTER: 13,
        KEY_SHIFT: 16,
        KEY_CTRL: 17,
        KEY_ALT: 18,
        KEY_PAUSE: 19,
        KEY_BREAK: 19,
        KEY_CAPS_LOCK: 20,
        KEY_ESCAPE: 27,
        KEY_SPACE_BAR: 32,
        KEY_PAGE_UP: 33,
        KEY_PAGE_DOWN: 34,
        KEY_END: 35,
        KEY_HOME: 36,
        KEY_LEFT_ARROW: 37,
        KEY_UP_ARROW: 38,
        KEY_RIGHT_ARROW: 39,
        KEY_DOWN_ARROW: 40,
        KEY_INSERT: 45,
        KEY_DELETE: 46,
        KEY_0: 48,
        KEY_1: 49,
        KEY_2: 50,
        KEY_3: 51,
        KEY_4: 52,
        KEY_5: 53,
        KEY_6: 54,
        KEY_7: 55,
        KEY_8: 56,
        KEY_9: 57,
        KEY_A: 65,
        KEY_B: 66,
        KEY_C: 67,
        KEY_D: 68,
        KEY_E: 69,
        KEY_F: 70,
        KEY_G: 71,
        KEY_H: 72,
        KEY_I: 73,
        KEY_J: 74,
        KEY_K: 75,
        KEY_L: 76,
        KEY_M: 77,
        KEY_N: 78,
        KEY_O: 79,
        KEY_P: 80,
        KEY_Q: 81,
        KEY_R: 82,
        KEY_S: 83,
        KEY_T: 84,
        KEY_U: 85,
        KEY_V: 86,
        KEY_W: 87,
        KEY_X: 88,
        KEY_Y: 89,
        KEY_Z: 90,
        KEY_LEFT_WINDOW_KEY: 91,
        KEY_RIGHT_WINDOW_KEY: 92,
        KEY_SELECT_KEY: 93,
        KEY_NUMPAD_0: 96,
        KEY_NUMPAD_1: 97,
        KEY_NUMPAD_2: 98,
        KEY_NUMPAD_3: 99,
        KEY_NUMPAD_4: 100,
        KEY_NUMPAD_5: 101,
        KEY_NUMPAD_6: 102,
        KEY_NUMPAD_7: 103,
        KEY_NUMPAD_8: 104,
        KEY_NUMPAD_9: 105,
        KEY_MULTIPLY: 106,
        KEY_ADD: 107,
        KEY_SUBTRACT: 109,
        KEY_DECIMAL_POINT: 110,
        KEY_DIVIDE: 111,
        KEY_F1: 112,
        KEY_F2: 113,
        KEY_F3: 114,
        KEY_F4: 115,
        KEY_F5: 116,
        KEY_F6: 117,
        KEY_F7: 118,
        KEY_F8: 119,
        KEY_F9: 120,
        KEY_F10: 121,
        KEY_F11: 122,
        KEY_F12: 123,
        KEY_NUM_LOCK: 144,
        KEY_SCROLL_LOCK: 145,
        KEY_SEMI_COLON: 186,
        KEY_EQUAL_SIGN: 187,
        KEY_COMMA: 188,
        KEY_DASH: 189,
        KEY_PERIOD: 190,
        KEY_FORWARD_SLASH: 191,
        KEY_GRAVE_ACCENT: 192,
        KEY_OPEN_BRACKET: 219,
        KEY_BACK_SLASH: 220,
        KEY_CLOSE_BRACKET: 221,
        KEY_SINGLE_QUOTE: 222,
        KEY_LEFT_COMMAND: 224,
        KEY_RIGHT_COMMAND: 224
    };

    function getKey(object, value) {
        return Object.keys(object).filter(function (key) {
            return object[key] === value
        })[0];
    }

    if (global.J2D !== undefined) global.InputManager = InputManager;
    return InputManager;
}));
