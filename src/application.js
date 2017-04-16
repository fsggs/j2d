'use strict';

requirejs.config({
    baseUrl: 'js/',
    paths: {
        'j2d': 'j2d',
        'jquery': '../jquery.min'
    },
    bundles: {
        'j2d': [
            'j2d',
            'api/interfaces/IEngine',
            'api/interfaces/IEngineComponent',
            'api/interfaces/IHandler',
            'api/interfaces/IInputHandler',
            'api/Device',
            'api/Handler',
            'api/Engine',
            'api/EngineComponent',
            'api/PrototypeInterface',
            'api/PrototypeObject',
            'events/EventHandler',
            'core/FrameHandler',
            'core/SceneHandler',
            'core/ViewportHandler',
            'exception/Exception',
            'exception/BadFunctionCallException',
            'exception/BadMethodCallException',
            'exception/InvalidArgumentException',
            'exception/LengthException',
            'exception/LogicException',
            'exception/OutOfBoundsException',
            'exception/OutOfRangeException',
            'exception/RangeException',
            'exception/RuntimeException',
            'exception/UnexpectedValueException',
            'io/devices/Joystick',
            'io/devices/Keyboard',
            'io/devices/Mouse',
            'io/devices/Pointer',
            'io/devices/Touch',
            'io/InputHandler',
            'io/InputHandlerCodes',
            'layers/Layer',
            'layers/LayersHandler',
            'nodes/BaseNode',
            'nodes/CameraNode',
            'nodes/primitive2D/Rectangle',
            'nodes/primitive2D/Sprite',
            'nodes/GroupNode',
            'objects/Immutable',
            'objects/Mutable',
            'stores/BaseStore',
            'utils/Device',
            'utils/Events',
            'utils/MathUtil',
            'utils/ObjectUtil',
            'utils/SystemConsole',
            'utils/UUID',
            'utils/Vector2d'
        ]
    }
});

define('Test', function (require) {
    //let $ = require('jquery');
    var EngineJ2D = require('j2d');
    var Layer = require('layers/Layer').default;
    var GroupNode = require('nodes/GroupNode');
    var Rectangle = require('nodes/primitive2D/Rectangle');
    var Sprite = require('nodes/primitive2D/Sprite');

    //EngineJ2D.jQuery($);

    let random = (min, max) => {
        return (Math.floor(Math.random() * (max - min + 1) + min));
    };

    EngineJ2D.ready(function () {
        /** @type EngineJ2D|Array.<EngineJ2D> */
        var j2d = EngineJ2D.init('#j2d'); // JS
        //let j2d = $('#j2d').j2d(); // jQuery

        // j2d.state = ((timestamp) => {
        //     console.log(timestamp);
        // });

        j2d.start();

        var scene = j2d.scene;

        var backgroundLayer = new Layer('background');
        scene.add(backgroundLayer, -1);

        scene.registerNodeShaders(Rectangle);
        scene.registerNodeShaders(Sprite);

        var rect1 = new Rectangle(100, 100, 50, 50);
        var rect2 = new Rectangle(0, 0, 30, 30);


        var sprite = new Sprite(200, 200, 222 / 4, 256 / 4);

        setTimeout(()=>{
            var bigLayer = new Layer('big');
            for (let i = 0; i < 2000; i++) {
                let pos = [random(0, 640), random(0, 360)];
                let size = [random(10, 100), random(10, 100)];
                bigLayer.add(new Rectangle(pos[0], pos[1], size[0], size[1]));
            }
            scene.add(bigLayer);
        }, 5000);

        //scene.add(rect1);
        //scene.add(rect2);
        scene.add(sprite);

    });
});
require(['Test']);
