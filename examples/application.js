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
    'utils/Vector2d',
    'nodes/RectNode',
    'nodes/CameraNode'
], function ($, J2D, InputManager, Vector2d, RectNode, Camera) {
    "use strict";

    $(global.document).ready(function () {
        var j2d = global.j2d = $('#j2d').j2d();
        j2d.smoothing = false;
        //j2d.WebGL = true;

        j2d.io = new InputManager(j2d);
        j2d.io.toggleCursor(true); // enable cursor

        /* Managers */
        var scene = j2d.getSceneManager();
        var media = j2d.getMediaManager();

        media.addSound({
            id: "test",
            urls: ['sound.ogg']
        });

        media.sound("test").play();

        /* Nodes */
        /** @type {BaseNode|RectNode} */
        var rectangle = (new RectNode({color: 'red'}).setSize(new Vector2d(20, 20)));
        /** @type {BaseNode|CameraNode} */
        var camera_1st = (new Camera()).setSize(new Vector2d(400, 300));

        scene.add(rectangle);
        scene.registerCamera(camera_1st);

        var GameState = function () {
            var t, x, y;
            var ts = true;

            this.update = function (timestamp, data) {
                t = timestamp * 0.0008;
                x = Math.sin(t) * 100 + 150;
                y = Math.cos(t * 0.9) * 100 + 150;
                t = null;

                camera_1st.angle = camera_1st.angle + 1;
                camera_1st.setSize(new Vector2d(400 + camera_1st.angle, 300 + camera_1st.angle));

                //rectangle.angle = rectangle.angle - 2;
                rectangle.setPosition(new Vector2d(x, y)).setColor(ts ? 'yellow' : 'grey');
                scene.updateViewport(camera_1st);
            };
            this.render = function (timestamp, data) {
                //ts = !ts;

                scene.clear();
                scene.fillBackground();
                scene.render(data);
            };
        };

        //scene.init({
        //    width: 400,
        //    height: 300,
        //    backgroundColor: 'black'
        //}).setGameState(GameState).start();
    });

});

require(['Application']);
