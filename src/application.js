"use strict";

requirejs.config({
    baseUrl: "js/",
    paths: {
        'j2d': 'j2d'
    },
    bundles: {
        'j2d': [
            "j2d",
            "api/interfaces/IEngine",
            "api/interfaces/IEngineComponent",
            "api/interfaces/IHandler",
            "api/Device",
            "api/Handler",
            "api/EngineComponent",
            "api/PrototypeInterface",
            "api/PrototypeObject",
            "events/EventHandler",
            "core/FrameHandler",
            "io/devices/Joystick",
            "io/devices/Keyboard",
            "io/devices/Mouse",
            "io/devices/Pointer",
            "io/devices/Touch",
            "io/InputHandler",
            "io/InputHandlerCodes"
        ]
    }
});

define('Test', (require) => {
    let EventHandler = require('events/EventHandler');
    let InputHandler = require('io/InputHandler');
    let j2dEngine = require('j2d');

    let events = (new EventHandler()).enable();
    let input = window.input = new InputHandler();
    input.init(events, [
        InputHandler.IO.KEYBOARD,
        InputHandler.IO.MOUSE
    ], {
        cursor: 'img/default.cur'
    }).enable();

    let j2d = new j2dEngine();
    //j2d.io = input;
    //j2d.events = events;
});
require(['Test']);
