define([
    'jquery.j2d',
    'j2d/j2d.base'
], function (J2D, BaseNode) {
    "use strict";

    if (!J2D.prototype.scene.addCircleNode) {
        J2D.prototype.scene.addCircleNode = function (pos, radius, color) {
            return new CircleNode(this.parent, pos, radius, color);
        };
    }

    var CircleNode = function (j2d, pos, radius, color) {

        BaseNode.call(this, j2d, pos, j2d.vector.vec2df(radius * 2, radius * 2));

        /*Свойства*/
        this.color = color;
        this.radius = radius;
    };

    CircleNode.prototype = Object.create(BaseNode.prototype);
    CircleNode.prototype.constructor = CircleNode;

    CircleNode.prototype.draw = function () {
        var context = this.layer.context;
        if (this.visible && this.isLookScene()) {
            if (this.alpha != 1) {
                var tmpAlpha = context.globalAlpha;
                context.globalAlpha = this.alpha;
            }
            context.fillStyle = this.color;

            context.beginPath();
            context.arc(this.pos.x - this.j2d.scene.viewport.x + this.radius,
                this.pos.y - this.j2d.scene.viewport.y + this.radius,
                this.radius, 0, 2 * Math.PI, true);
            context.stroke();
            context.fill();

            if (this.alpha != 1) {
                context.globalAlpha = tmpAlpha;
            }
        }
    };

    return CircleNode;
});
