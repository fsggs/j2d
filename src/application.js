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

    //EngineJ2D.jQuery($);

    EngineJ2D.ready(function () {
        /** @type EngineJ2D|Array.<EngineJ2D> */
        var j2d = EngineJ2D.init('#j2d'); // JS
        //let j2d = $('#j2d').j2d(); // jQuery

        // j2d.state = ((timestamp) => {
        //     console.log(timestamp);
        // });

        j2d.start();

        var layers = j2d.scene.layers;

        var backgroundLayer = new Layer('background');
        var group1 = new GroupNode('logo');
        var group2 = new GroupNode('ui');

        layers.add(backgroundLayer, -1);

        //group1.add(backgroundLayer);

        layers.add(group1);
        layers.add(group2);

        console.log(layers);
    });
});
require(['Test']);
