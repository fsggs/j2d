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
            'utils/Device',
            'utils/Events',
            'utils/MathUtil',
            'utils/ObjectUtil',
            'utils/SystemConsole',
            'utils/UUID',
            'utils/Vector2d',
            'utils/Vector2dInteger'
        ]
    }
});

define('Test', (require) => {
    let $ = require('jquery');
    let EngineJ2D = require('j2d');
    let Layer = require('layers/Layer').default;
    let GroupNode = require('nodes/GroupNode');

    EngineJ2D.jQuery($);

    EngineJ2D.ready(() => {
        /** @type EngineJ2D|Array.<EngineJ2D> */
            //let j2d = EngineJ2D.init('#j2d'); // JS
        let j2d = $('#j2d').j2d(); // jQuery

        // j2d.state = ((timestamp) => {
        //     console.log(timestamp);
        // });

        j2d.start();

        let lm = j2d.scene.layers;

        let backgroundLayer = new Layer('background');
        let group1 = new GroupNode('logo');
        let group2 = new GroupNode('ui');

        lm.add(backgroundLayer, -1);

        //group1.add(backgroundLayer);

        lm.add(group1);
        lm.add(group2);

        //console.log(lm);
    });
});
require(['Test']);
