/**
 * J2D (jQuery plugin of the fork j2ds)
 *
 * @authors Skaner, likerRr, DeVinterX
 * @license zlib
 * @version 0.1.5a
 * @see https://github.com/SkanerSoft/J2ds/commit/501b8993fc41960794572dc481a5f2fe492da349
 */

!function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('j2d.line', ['jquery.j2d', 'j2d.base', 'j2d.scene'], factory);
    } else {
        factory(root.J2D, BaseNode, Scene);
    }
}(global, function (J2D, BaseNode, Scene) {
    "use strict";

    if (!Scene.prototype.addLineNode) {
        Scene.prototype.addLineNode = function (position, points, scale, color, width, fill, cFill) {
            return new LineNode(this.parent, position, points, scale, color, width, fill, cFill);
        };
    }

    var LineNode = function (j2d, position, points, scale, color, width, fill, cFill) {
        BaseNode.call(this, j2d, position, j2d.vector.vec2df(0, 0));
        this.nodeName = 'LineNode';
        this.mergeOptions({
            color: color,
            points: points,
            fill: fill || false,
            scale: scale || 0,
            cFill: cFill,
            lineWidth: width
        });
    };

    LineNode.prototype = Object.create(BaseNode.prototype);
    LineNode.prototype.constructor = LineNode;

    LineNode.prototype.draw = function () {
        var context = this.layer.context;
        if (this.options.visible && this.isLookScene()) {

            if (this.options.alpha != 1) {
                var tmpAlpha = context.globalAlpha;
                context.globalAlpha = this.options.alpha;
            }

            if (this.options.angle) {
                context.save();
                context.translate(this.getPosition().x - this.j2d.scene.viewport.x, this.getPosition().y - this.j2d.scene.viewport.y);
                context.rotate(this.j2d.math.rad(this.options.angle));
                context.translate(-(this.getPosition().x - this.j2d.scene.viewport.x), -(this.getPosition().y - this.j2d.scene.viewport.y));
            }

            context.strokeStyle = this.options.color;
            context.lineWidth = this.options.lineWidth;
            context.lineCap = 'round';

            context.beginPath();
            context.moveTo(
                this.options.position.x - this.j2d.scene.viewport.x,
                this.options.position.y - this.j2d.scene.viewport.y
            );

            for (var i = 0, len = this.options.points.length; i < len; i += 1) {
                context.lineTo(
                    this.options.position.x + this.options.points[i][0] * this.options.scale - this.j2d.scene.viewport.x,
                    this.options.position.y + this.options.points[i][1] * this.options.scale - this.j2d.scene.viewport.y
                );
            }

            context.stroke();
            if (this.options.fill) {
                context.fillStyle = this.options.cFill;
                context.fill();
            }

            context.lineWidth = 0;
            context.lineCap = 'butt';

            if (this.options.angle) {
                context.restore();
            }

            if (this.options.alpha != 1) {
                context.globalAlpha = tmpAlpha;
            }
        }
    };

    if (global.J2D !== undefined) global.LineNode = LineNode;
    return LineNode;
});
