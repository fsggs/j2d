/**
 * J2D (jQuery Canvas Graphic Engine plugin)
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
        'jquery.j2d': 'jquery.j2d.min'
    }
});

define(function(require) {
    var $ = require('jquery'),
        J2D = require('jquery.j2d');

    console.log($, J2D);

    J2D.initPlugin();

    $(window.document).ready(function () {

    });
});
