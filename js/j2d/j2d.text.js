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

    if (!J2D.prototype.scene.addTextNode) {
        J2D.prototype.scene.addTextNode = function (pos, text, sizePx, color, family, width, colorL) {
            return new TextNode(this.parent, pos, text, sizePx, color, family, width, colorL);
        };
    }

    var TextNode = function (j2d, pos, text, sizePx, color, family, width, colorL) {

        BaseNode.call(this, j2d, pos, j2d.vector.vec2df(0, 0));

        /*Свойства*/

        this.vAlign = 'top';
        this.hAlign = 'left';
        this.color = color ? color : 'black';

        this.family = family ? family : 'sans-serif';
        this.sizePx = sizePx;

        this.lineWidth = width ? width : 0;
        this.colorL = colorL ? colorL : 'black';

        this.font = this.sizePx + 'px ' + this.family;

        this.fullText = text;
        this.maxWidth = 0;
        this.lines = text.split("\n");

        this.j2d.scene.context.font = this.font;

        for (var i = 0, len = this.lines.length; i < len; i += 1) {
            this.maxWidth = (this.maxWidth < this.j2d.scene.context.measureText(this.lines[i]).width ?
                this.j2d.scene.context.measureText(this.lines[i]).width :
                this.maxWidth);
        }

        this.size.x = this.maxWidth;
        this.size.y = this.lines.length * this.sizePx;
    };

    TextNode.prototype = Object.create(BaseNode.prototype);
    TextNode.prototype.constructor = TextNode;

    TextNode.prototype.setSize = function (sizePx) {
        this.sizePx = sizePx;
        this.font = this.sizePx + 'px ' + this.family;
        this.j2d.scene.context.font = this.font;

        for (var i = 0, len = this.lines.length; i < len; i += 1) {
            this.maxWidth = (this.maxWidth < this.j2d.scene.context.measureText(this.lines[i]).width ?
                this.j2d.scene.context.measureText(this.lines[i]).width :
                this.maxWidth);
        }
        this.size.x = this.maxWidth;
        this.size.y = this.lines.length * this.sizePx;
    };

    TextNode.prototype.getSize = function () {
        return this.sizePx;
    };

    TextNode.prototype.drawSimpleText = function (text, color, colorL, pos) {
        var context = this.layer.context;
        context.fillStyle = color ? color : this.color;
        context.textAlign = this.hAlign;
        context.textBaseline = this.vAlign;
        context.font = this.font;
        context.lineWidth = this.lineWidth;
        context.strokeStyle = colorL ? colorL : this.colorL;

        var lines = text.split("\n");

        pos = pos ? pos : this.pos;

        for (var i = 0, len = lines.length; i < len; i += 1) {
            if (this.lineWidth) {
                context.strokeText(lines[i], pos.x, pos.y + this.sizePx * i);
            }
            context.fillText(lines[i], pos.x, pos.y + this.sizePx * i);
        }
        context.lineWidth = 0;
        context.strokeStyle = 'black';
    };

    TextNode.prototype.getText = function () {
        return this.fullText;
    };

    TextNode.prototype.setText = function (text) {
        this.fullText = text;
        this.maxWidth = 0;
        this.lines = text.split("\n");

        this.j2d.scene.context.font = this.font;

        for (var i = 0, len = this.lines.length; i < len; i += 1) {
            this.maxWidth = (this.maxWidth < this.j2d.scene.context.measureText(this.lines[i]).width ?
                this.j2d.scene.context.measureText(this.lines[i]).width :
                this.maxWidth);
        }
        this.size.x = this.maxWidth;
        this.size.y = this.lines.length * this.sizePx;
    };

    TextNode.prototype.draw = function () {
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

            context.fillStyle = this.color;
            context.textAlign = this.hAlign;
            context.textBaseline = this.vAlign;
            context.font = this.font;
            context.lineWidth = this.lineWidth;
            context.strokeStyle = this.colorL;

            for (var i = 0, len = this.lines.length; i < len; i += 1) {
                if (this.lineWidth) {
                    context.strokeText(this.lines[i], this.pos.x, this.pos.y + this.sizePx * i);
                }
                context.fillText(this.lines[i], this.pos.x, this.pos.y + this.sizePx * i);
            }

            context.lineWidth = 0;
            context.strokeStyle = 'black';

            if (this.angle) {
                context.restore();
            }

            if (this.alpha != 1) {
                context.globalAlpha = tmpAlpha;
            }
        }
    };

    return TextNode;
});
