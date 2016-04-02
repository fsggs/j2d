var global = window;

requirejs.config({
    baseUrl: '../src/js/',
    paths: {
        'jquery': '../../vendor/jquery/dist/jquery.min'
    }
});

define('Application', [
    'jquery',
    'jquery.j2d',
    'io/InputManager',
    'io/MediaManager',
    'utils/Vector2d',
    'nodes/RectNode',
    'nodes/CameraNode'
], function ($, J2D, InputManager, MediaManager, Vector2d, RectNode, Camera) {
    "use strict";

    $(global.document).ready(function () {
        var j2d = global.j2d = $('#j2d').j2d();
        j2d.smoothing = false;
        //j2d.WebGL = true;

        j2d.io = new InputManager(j2d);
        j2d.io.toggleCursor(true); // enable cursor

        j2d.media = new MediaManager(j2d);

        j2d.media.addSound({
            id: 'test',
            src: 'test.ogg'
        });

        j2d.media.audio("test").play();

        /* Managers */
        var scene = j2d.getSceneManager();

        /* Nodes */
        /** @type {BaseNode|RectNode} */
        var rectangle = (new RectNode({color: 'red'}).setSize(new Vector2d(20, 20)));
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

                if(camera_1st.angle >= 360-1) ts = false;
                if(camera_1st.angle == 0) ts = true;

                //rectangle.angle = rectangle.angle - 2;
                rectangle.setPosition(new Vector2d(x, y)).setColor(!ts ? 'yellow' : 'grey');
                scene.updateViewport(camera_1st);

                //scene.updateViewport();
            };

            this.render = function (timestamp, data) {
                scene.clear();
                scene.fillBackground();
                scene.render(data);
            };
        };

        // Fix for Camera
        $(window).on('resize', function() {
            width = j2d.element.width();
            height = j2d.element.height();
        });

        scene.init({
            width: width,
            height: height,
            backgroundColor: 'black'
        }).setGameState(GameState).start();
    });

});

require(['Application']);
