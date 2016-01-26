var global = window;

requirejs.config({
    baseUrl: "../src/js/",
    paths: {
        'jquery': '../../vendor/jquery/dist/jquery.min'
    }
});

define('Application', [
    'jquery',
    'jquery.j2d'
], function ($, J2D) {
    "use strict";

    J2D.initPlugin();

    $(global.document).ready(function () {
        var j2d = window.j2ds = $('#j2d').j2d();
        j2d.setSmoothing(false);
        // j2d.enableWebGL();

        var scene = j2d.getSceneManager();

        var GameState = function () {
            this.update = function (timestamp, data) {

            };
            // console.log('bu');
        };

        scene.init({
            width: 400,
            height: 300,
            backgroundColor: 'black'
        }).setGameState(new GameState).start();
    });

});

require(['Application']);