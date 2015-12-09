/**
 * J2D (jQuery plugin of the fork j2ds)
 *
 * @authors Skaner, likerRr, DeVinterX
 * @license zlib
 * @version 0.1.5a
 * @see https://github.com/SkanerSoft/J2ds/commit/81c85984b36cfd7ff413577737e10e8a81b0263c
 */

!function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('j2d.io.legacy', ['jquery'], factory);
    } else {
        factory(root.jQuery);
    }
}(global, function ($) {
    "use strict";

    var IO = function (j2d) {
        this.j2d = j2d;

        this.data = {
            pos: {x: 0, y: 0},
            x: 0,
            y: 0,
            abs: {x: 0, y: 0},
            lClick: false,
            mClick: false,
            rClick: false,
            touch: false,
            keyDown: [],
            keyPress: [],
            keyPressed: [],
            keyUp: [],
            keyUpped: false,
            canceled: false,
            body: false,
            anyKey: false,
            writeMode: false,
            displayCursor: '',
            visible: true
        };
    };

    IO.prototype.init = function () {
        var io = this;

        IO.activeElement = io.j2d.element;
        IO.activeElement.focus();
        io.j2d.options.window.ontouchstart = io.onTouch;
        io.j2d.options.window.ontouchmove = io.onTouch;
        io.j2d.options.window.ontouchend = function () {
            io.data.canceled = false;
            io.falseInput();
        };
        io.j2d.options.window.oncontextmenu = function () {
            return false;
        };
        io.j2d.options.window.onselectstart = io.j2d.options.window.oncontextmenu;
        io.j2d.options.window.ondragstart = io.j2d.options.window.oncontextmenu;
        io.j2d.options.window.onmousedown = io.onClick;
        io.j2d.options.window.onmouseup = function () {
            io.data.canceled = false;
            io.falseInput();
        };
        io.j2d.options.window.onmousemove = io.cursorPosition;
        io.j2d.options.window.onkeydown = function (e) {
            io.keyEvent(e);
        };
        io.j2d.options.window.onkeyup = function (e) {
            io.data.canceled = false;
            io.keyEvent(e);
        };
        io.j2d.options.window.onkeypress = function (e) {
            io.keyEvent(e);
        };
    };

    IO.prototype.update = function () {
        var dX = this.j2d.scene.canvas.offsetWidth / this.j2d.scene.width;
        var dY = this.j2d.scene.canvas.offsetHeight / this.j2d.scene.height;
        this.data.x = (this.data.abs.x / dX);
        this.data.y = (this.data.abs.y / dY);

        this.data.pos.x = this.j2d.scene.viewport.x + this.data.x;
        this.data.pos.y = this.j2d.scene.viewport.y + this.data.y;
    };

    IO.prototype.clear = function () {
        this.data.keyPress = [];
        this.data.keyUp = [];
    };

    IO.prototype.keyList = function () {
        var arrayList = [];
        for (var i in IO.keys) {
            if (IO.keys.hasOwnProperty(i)) {
                arrayList.push(i);
            }
        }
        return arrayList;
    };

    IO.prototype.isKeyDown = function (code) {
        return this.data.keyDown[IO.keys[code]];
    };

    IO.prototype.isKeyPress = function (code) {
        return this.data.keyPress[IO.keys[code]];
    };

    IO.prototype.isKeyUp = function (code) {
        return this.data.keyUp[IO.keys[code]];
    };

    IO.prototype.getPosition = function () {
        return this.j2d.vector.vec2df(this.data.pos.x, this.data.pos.y);
    };

    IO.prototype.setWriteMode = function (mode) {
        this.data.writeMode = mode;
    };

    IO.prototype.isWriteMode = function () {
        return this.data.writeMode;
    };

    IO.prototype.keyEvent = function (e) {
        if (e.type == 'keydown') {
            if (!this.data.keyPressed[e.keyCode]) {
                this.data.keyPress[e.keyCode] = true;
                this.data.keyPressed[e.keyCode] = true;
            }
            if (!this.data.writeMode) {
                e.preventDefault();
            } else {
                $(this.j2d.element).trigger('keyPress');
            }
        } else if (e.type == 'keyup') {
            if (this.data.keyPressed[e.keyCode]) {
                this.data.keyPress[e.keyCode] = false;
                this.data.keyPressed[e.keyCode] = false;
                this.data.keyUp[e.keyCode] = true;
                this.data.keyUpped = true;
                e.preventDefault();
            }
        } else if (e.type == 'keypress' && (this.data.writeMode)) {
            var char = '';
            if (e.which != 0 && e.charCode != 0) {
                if (e.which >= 32) {
                    char = String.fromCharCode(e.which);
                }
            }
            $(this.j2d.element).trigger('keyPress', [char]);
        }

        this.data.keyDown[e.keyCode] = (e.type == 'keydown') && (!this.data.canceled);
        this.data.anyKey = e.keyCode;
        return false;
    };

    //! системная
    IO.prototype.cancel = function (id) {
        if (!id) {
            this.data.canceled = true;
            this.falseInput();
            this.data.keyDown = [];
        }
        else {
            this.data.keyDown[IO.keys[id]] = false;
        }
    };

    //! системная
    // Вернет true, если мышь наxодится над объектом
    IO.prototype.onNode = function (id) {
        if (!id.layer.visible) return false;
        return (this.data.pos.x > id.options.position.x && this.data.pos.x < id.options.position.x + id.options.size.x) &&
            (this.data.pos.y > id.options.position.y && this.data.pos.y < id.options.position.y + id.options.size.y);
    };

    IO.prototype.cursorPosition = function (e) {
        var io = IO.activeElement.j2d().options.io;

        if (!io.data.touch) {
            var x, y;

            if (document.all) {
                x = e.x + document.body.scrollLeft;
                y = e.y + document.body.scrollTop;
            } else {
                x = e.pageX; // Координата X курсора
                y = e.pageY;// Координата Y курсора
            }
            io.data.abs.x = x;
            io.data.abs.y = y;
        }
    };


    IO.prototype.onClick = function (e) {
        var io = IO.activeElement.j2d().options.io;

        if (!e.which && e.button) {
            if (e.button & 1) e.which = 1;
            else if (e.button & 4) e.which = 2;
            else if (e.button & 2) e.which = 3;
        }

        io.data.lClick = (e.which == 1) && (!io.data.canceled);
        io.data.mClick = (e.which == 2) && (!io.data.canceled);
        io.data.rClick = (e.which == 3) && (!io.data.canceled);
        IO.activeElement.focus();
        e.preventDefault();
        return false;
    };

    IO.prototype.onTouch = function (e) {
        var io = IO.activeElement.j2d().options.io;

        io.data.abs.x = e.touches[0].pageX;
        io.data.abs.y = e.touches[0].pageY;
        io.data.lClick = !io.data.canceled;
        io.data.touch = !io.data.canceled;
        IO.activeElement.focus();
        e.preventDefault();
        return false;
    };

    IO.prototype.falseInput = function () {
        this.data.lClick = false;
        this.data.mClick = false;
        this.data.rClick = false;
    };

    IO.prototype.setCursorImage = function (curImg) {
        $(this.j2d.element).css('cursor', 'url("' + curImg + '"), auto');
    };

    IO.prototype.setVisible = function (visible) {
        this.data.visible = visible;
        if (!visible) {
            this.data.displayCursor = $(this.j2d.element).css('cursor');
            $(this.j2d.element).css('cursor', 'none');
        } else {
            $(this.j2d.element).css('cursor', this.data.displayCursor);
        }
    };

    IO.prototype.isVisible = function () {
        return this.data.visible;
    };

    IO.keys = {
        'LEFT': 37,
        'RIGHT': 39,
        'UP': 38,
        'DOWN': 40,
        'SPACE': 32,
        'CTRL': 17,
        'SHIFT': 16,
        'ALT': 18,
        'ESC': 27,
        'ENTER': 13,
        'MINUS': 189,
        'PLUS': 187,
        'CAPS_LOCK': 20,
        'BACKSPACE': 8,
        'TAB': 9,
        'Q': 81,
        'W': 87,
        'E': 69,
        'R': 82,
        'T': 84,
        'Y': 89,
        'U': 85,
        'I': 73,
        'O': 79,
        'P': 80,
        'A': 65,
        'S': 83,
        'D': 68,
        'F': 70,
        'G': 71,
        'H': 72,
        'J': 74,
        'K': 75,
        'L': 76,
        'Z': 90,
        'X': 88,
        'V': 86,
        'B': 66,
        'N': 78,
        'M': 77,
        '0': 48,
        '1': 49,
        '2': 50,
        '3': 51,
        '4': 52,
        '5': 53,
        '6': 54,
        '7': 55,
        '8': 56,
        'C': 67,
        '9': 57,
        'NUM_0': 45,
        'NUM_1': 35,
        'NUM_2': 40,
        'NUM_3': 34,
        'NUM_4': 37,
        'NUM_5': 12,
        'NUM_6': 39,
        'NUM_7': 36,
        'NUM_8': 38,
        'NUM_9': 33,
        'NUM_MINUS': 109,
        'NUM_PLUS': 107,
        'NUM_LOCK': 144,
        'F1': 112,
        'F2': 113,
        'F3': 114,
        'F4': 115,
        'F5': 116,
        'F6': 117,
        'F7': 118,
        'F8': 119,
        'F9': 120,
        'F10': 121,
        'F11': 122,
        'F12': 123
    };

    IO.activeElement = undefined;

    if (window.J2D !== undefined) window.IO = IO;
    return IO;
});
