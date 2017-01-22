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
            "api/interfaces/IInputHandler",
            "api/Device",
            "api/Handler",
            "api/Engine",
            "api/EngineComponent",
            "api/PrototypeInterface",
            "api/PrototypeObject",
            "events/EventHandler",
            "core/FrameHandler",
            "core/GameStatesManager",
            "core/LayersManager",
            "core/SceneManager",
            "core/ViewportManager",
            "io/devices/Joystick",
            "io/devices/Keyboard",
            "io/devices/Mouse",
            "io/devices/Pointer",
            "io/devices/Touch",
            "io/InputHandler",
            "io/InputHandlerCodes",
            "exception/Exception",
            "exception/BadFunctionCallException",
            "exception/BadMethodCallException",
            "exception/InvalidArgumentException",
            "exception/LengthException",
            "exception/LogicException",
            "exception/OutOfBoundsException",
            "exception/OutOfRangeException",
            "exception/RangeException",
            "exception/RuntimeException",
            "exception/UnexpectedValueException",
            "io/MediaManager",
            "loader/AssetsLoader",
            "media/Audio",
            "media/Sound",
            "media/Video",
            "nodes/BaseNode",
            "nodes/AnimatedNode",
            "nodes/CameraNode",
            "nodes/CollectionNode",
            "nodes/RectNode",
            "states/BaseGameState",
            "states/DefaultGameState",
            "transitions/utils/Easing",
            "transitions/utils/Interpolation",
            "transitions/Tween",
            "utils/ArrayMap",
            "utils/DeviceUtil",
            "utils/Events",
            "utils/MathUtil",
            "utils/ObjectUtil",
            "utils/SystemConsole",
            "utils/UUID",
            "utils/Vector2d",
            "utils/Vector2dInteger"
        ]
    }
});

define('Test', (require) => {
    let EngineJ2D = require('j2d');

    let j2d = EngineJ2D.init('#j2d');
    // j2d.state = ((timestamp) => {
    //     console.log(timestamp);
    // });
    j2d.start();
});
require(['Test']);
