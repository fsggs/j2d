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
        define('j2d.circle', ['jquery.j2d', 'j2d.base', 'j2d.scene'], factory);
    } else {
        factory(root.J2D, root.BaseNode, root.Scene);
    }
}(global, function (J2D, BaseNode, Scene) {
    "use strict";

    if (!Scene.prototype.addCircleNode) {
        Scene.prototype.addCircleNode = function (position, radius, color) {
            return new CircleNode(this.parent, position, radius, color);
        };
    }

    var CircleNode = function (j2d, position, radius, color) {
        BaseNode.call(this, j2d, position, j2d.vector.vec2df(radius * 2, radius * 2));
        this.nodeName = 'CircleNode';
        this.mergeOptions({
            color: color,
            radius: radius
        });
    };

    CircleNode.prototype = Object.create(BaseNode.prototype);
    CircleNode.prototype.constructor = CircleNode;

    CircleNode.prototype.draw = function () {
        var context = this.layer.context;
        if (this.options.visible && this.isLookScene()) {
            if (this.options.alpha != 1) {
                var tmpAlpha = context.globalAlpha;
                context.globalAlpha = this.options.alpha;
            }
            context.lineWidth = 0;
            context.fillStyle = this.options.color;

            context.beginPath();
            context.arc(
                this.options.position.x - this.j2d.scene.viewport.x + this.options.radius,
                this.options.position.y - this.j2d.scene.viewport.y + this.options.radius,
                this.options.radius, 0, 2 * Math.PI,
                true
            );
            context.stroke();
            context.fill();

            if (this.options.alpha != 1) {
                context.globalAlpha = tmpAlpha;
            }
        }
    };

    if (global.J2D !== undefined) global.CircleNode = CircleNode;
    return CircleNode;
});
