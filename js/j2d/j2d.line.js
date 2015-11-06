/**
 * J2D (jQuery plugin of the fork j2ds)
 *
 * @authors Skaner, likerRr, DeVinterX
 * @license zlib
 * @version 0.1.0
 * @see https://github.com/SkanerSoft/J2ds/commit/81c85984b36cfd7ff413577737e10e8a81b0263c
 */

define([
    'jquery.j2d',
    'j2d/j2d.base'
], function (J2D, BaseNode) {
    "use strict";

    if (!J2D.prototype.scene.addLineNode) {
        J2D.prototype.scene.addLineNode = function (pos, points, scale, color, width, fill, cFill) {
            return new LineNode(this.parent, pos, points, scale, color, width, fill, cFill);
        };
    }

    var LineNode = function (j2d, pos, points, scale, color, width, fill, cFill) {

        BaseNode.call(this, j2d, pos, j2d.vector.vec2df(0, 0));

        /*Свойства*/
        this.color = color;
        this.points = points;
        this.fill = fill || false;
        this.scale = scale || 0;
        this.cFill = cFill;
        this.lineWidth = width;
    };

    LineNode.prototype = Object.create(BaseNode.prototype);
    LineNode.prototype.constructor = LineNode;

    LineNode.prototype.draw = function () {
        var context = this.layer.context;
        if (this.visible && this.isLookScene()) {

            if (this.alpha != 1) {
                var tmpAlpha = context.globalAlpha;
                context.globalAlpha = this.alpha;
            }

            context.strokeStyle = this.color;
            context.lineWidth = this.lineWidth;

            context.beginPath();
            context.moveTo(this.pos.x - this.j2d.scene.viewport.x,
                this.pos.y - this.j2d.scene.viewport.y);

            for (var i = 0, len = this.points.length; i < len; i += 1) {
                context.lineTo(
                    this.pos.x + this.points[i][0] * this.scale - this.j2d.scene.viewport.x,
                    this.pos.y + this.points[i][1] * this.scale - this.j2d.scene.viewport.y);
            }

            context.stroke();
            if (this.fill) {
                context.fillStyle = this.cFill;
                context.fill();
            }

            if (this.alpha != 1) {
                context.globalAlpha = tmpAlpha;
            }
        }
    };

    return LineNode;
});
