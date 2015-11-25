/**
 * J2D (jQuery plugin of the fork j2ds)
 *
 * @authors Skaner, likerRr, DeVinterX
 * @license zlib
 * @version 0.1.4
 * @see https://github.com/SkanerSoft/J2ds/commit/501b8993fc41960794572dc481a5f2fe492da349
 */

define('j2d.line', [
    'jquery.j2d',
    'j2d.base'
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

            if (this.angle) {
                context.save();
                context.translate(this.getPosition().x - this.j2d.scene.viewport.x, this.getPosition().y - this.j2d.scene.viewport.y);
                context.rotate(this.j2d.math.rad(this.angle));
                context.translate(-(this.getPosition().x - this.j2d.scene.viewport.x), -(this.getPosition().y - this.j2d.scene.viewport.y));
            }

            context.strokeStyle = this.color;
            context.lineWidth = this.lineWidth;
            context.lineCap = 'round';

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

            context.lineWidth = 0;
            context.lineCap = 'butt';

            if (this.angle) {
                context.restore();
            }

            if (this.alpha != 1) {
                context.globalAlpha = tmpAlpha;
            }
        }
    };

    return LineNode;
});
