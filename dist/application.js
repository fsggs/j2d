/**
 * j2D (JavaScript 2D Engine)
 *
 * @authors DeVinterX, Skaner(j2Ds)
 * @license BSD
 * @version 0.2.0-dev
 */

"use strict";

requirejs.config({
    baseUrl: "js/",
    paths: {
        'jquery': '../vendor/jquery.min',
        'j2d': 'j2d.min'
    },
    bundles: {
        'j2d.min': [
            // jQuery plugin
            'j2d',

            // Core
            'core/FrameManager',
            'core/GameStatesManager',
            'core/LayersManager',
            'core/SceneManager',
            'core/ViewportManager',
            'core/WebGL2D',

            // Exceptions
            'exceptions/BadFunctionCallException',
            'exceptions/BadMethodCallException',
            'exceptions/Exception',
            'exceptions/InvalidArgumentException',
            'exceptions/LengthException',
            'exceptions/LogicException',
            'exceptions/OutOfBoundsException',
            'exceptions/OutOfRangeException',
            'exceptions/RangeException',
            'exceptions/RuntimeException',
            'exceptions/UnexpectedValueException',

            // IO
            'io/InputManager',
            'io/MediaManager',

            //Loaders
            'loaders/AssetsLoader',

            // Media
            'media/Audio',
            'media/Sound',
            'media/Video',

            // Nodes
            'nodes/BaseNode',
            'nodes/AnimatedNode',
            'nodes/CameraNode',
            'nodes/CollectionNode',
            'nodes/RectNode',

            //States
            'states/BaseGameState',
            'states/DefaultGameState',

            //Transitions
            'transitions/Tween',
            'transitions/utils/Easing',
            'transitions/utils/Interpolation',

            // Utils
            'utils/ArrayMap',
            'utils/DeviceUtil',
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

define(function (require) {
    var $ = require('jquery'),
        EngineJ2D = require('j2d'),
        Vector2d = require('utils/Vector2d'),
        RectNode = require('nodes/RectNode'),
        BaseGameState = require('states/BaseGameState'),
        Camera = require('nodes/CameraNode');

    $(window.document).ready(function () {
        var j2d = global.j2d_engine = $('#j2d_engine').j2d();
        j2d.smoothing = false;

        /* Managers */
        var scene = j2d.getSceneManager();
        var gsm = j2d.getGameStatesManager();

        /* Nodes */
        /** @type {BaseNode|RectNode} */
        var rectangle = (new RectNode({color: 'red'}))
            .setSize(new Vector2d(20, 20))
            .setPosition(new Vector2d(20, 20));
        /** @type {BaseNode|CameraNode} */
        var camera_1st = (new Camera()).setSize(new Vector2d(400, 300));

        scene.add(rectangle);
        scene.registerCamera(camera_1st);

        var width = 400,
            height = 300;

        var GameState = function () {
            var t, x, y;
            var ts = true;

            this.update = function (timestamp, data) {
                t = timestamp * 0.0018;
                x = Math.sin(t) * 100 + 150;
                y = Math.cos(t * 0.9) * 100 + 150;
                t = null;

                camera_1st.angle = camera_1st.angle + (ts ? 1 : -1);
                camera_1st.setSize(new Vector2d(width + camera_1st.angle, height + camera_1st.angle));
                camera_1st.scale = camera_1st.angle / 50;

                if (camera_1st.angle >= 360 - 1) ts = false;
                if (camera_1st.angle == 0) ts = true;

                rectangle.setPosition(new Vector2d(x, y)).setColor(!ts ? 'yellow' : 'grey');
                scene.updateViewport(camera_1st);
            };

            this.render = function (timestamp, data) {
                scene.clear();
                scene.fillBackground();
                scene.render(data);
            };
        };

        GameState.prototype = Object.create(BaseGameState.prototype);
        GameState.prototype.constructor = GameState;

        // Fix for Camera
        $(window).on('resize', function () {
            width = j2d.element.width();
            height = j2d.element.height();
        });

        scene.init({
            width: width,
            height: height,
            backgroundColor: 'black'
        }).start();

        gsm.add(new GameState(), 'myGame');
    });
});
