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
    'nodes/RectNode'
], function ($, J2D, InputManager, Vector2d, RectNode) {
    "use strict";

    $(global.document).ready(function () {
        var j2d = global.j2d = $('#j2d').j2d();
        j2d.smoothing = false;
        j2d.WebGL = true;

        j2d.io = new InputManager(j2d);
        j2d.io.toggleCursor(true); // enable cursor
        var scene = j2d.getSceneManager();

        var rectangle = (new RectNode({color: 'red'}).setSize(new Vector2d(20, 20)));
        scene.add(rectangle);

        var GameState = function () {
            var t, x, y;
            var ts = true;

            this.update = function (timestamp, data) {
                t = new Date().getTime() * 0.0008;
                x = Math.sin(t) * 100 + 150;
                y = Math.cos(t * 0.9) * 100 + 150;
                t = null;

                rectangle.setPosition(new Vector2d(x, y)).setColor(ts ? 'yellow' : 'grey');
            };
            this.render = function (timestamp, data) {
                ts = !ts;

                scene.clear();
                scene.fillBackground();
                scene.render(data);
            };
        };

        scene.init({
            width: 400,
            height: 300,
            backgroundColor: 'black'
        }).setGameState(GameState).start();
    });

});

require(['Application']);
