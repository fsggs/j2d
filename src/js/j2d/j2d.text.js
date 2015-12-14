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
        define('j2d.text', ['jquery.j2d', 'j2d.base', 'j2d.scene'], factory);
    } else {
        factory(root.J2D, root.BaseNode, root.Scene);
    }
}(global, function (J2D, BaseNode, Scene) {
    "use strict";

    if (!Scene.prototype.addTextNode) {
        Scene.prototype.addTextNode = function (position, text, sizePx, color, family, width, colorL) {
            return new TextNode(this.parent, position, text, sizePx, color, family, width, colorL);
        };
    }

    //TODO::
    var TextNode = function (j2d, position, text, sizePx, color, family, width, colorL) {
        BaseNode.call(this, j2d, position, j2d.vector.vec2df(0, 0));
        this.nodeName = 'TextNode';
        this.mergeOptions({
            vAlign: 'top',
            hAlign: 'left',
            color: color ? color : 'black',

            family: family ? family : 'sans-serif',
            sizePx: sizePx ? sizePx : 20,

            box: {
                offset: {
                    y: this.j2d.math.toInt(this.sizePx * 0.26)
                },
                size: {
                    y: -this.j2d.math.toInt(this.sizePx * 0.26)
                }
            },
            lineWidth: width ? width : 0,
            colorL: colorL ? colorL : 'black',

            fullText: text,
            maxWidth: 0,
            lines: text.split("\n")
        });

        /*Свойства*/
        this.options.font = this.options.sizePx + 'px ' + this.options.family;
        this.j2d.scene.context.font = this.options.font;

        for (var i = 0, len = this.options.lines.length; i < len; i += 1) {
            this.options.maxWidth = (this.options.maxWidth < this.j2d.scene.context.measureText(this.options.lines[i]).width ?
                this.j2d.scene.context.measureText(this.options.lines[i]).width :
                this.options.maxWidth);
        }

        this.options.size.x = this.options.maxWidth;
        this.options.size.y = this.options.lines.length * this.options.sizePx;
    };

    TextNode.prototype = Object.create(BaseNode.prototype);
    TextNode.prototype.constructor = TextNode;

    TextNode.prototype.setSize = function (sizePx) {
        this.options.sizePx = sizePx;
        this.options.font = this.options.sizePx + 'px ' + this.options.family;
        this.j2d.scene.context.font = this.options.font;

        this.options.box.offset.y = this.j2d.math.toInt(this.options.sizePx * 0.26);
        this.options.box.size.y = -this.j2d.math.toInt(this.options.sizePx * 0.26);

        for (var i = 0, len = this.options.lines.length; i < len; i += 1) {
            this.options.maxWidth = (this.options.maxWidth < this.j2d.scene.context.measureText(this.options.lines[i]).width
                ? this.j2d.scene.context.measureText(this.options.lines[i]).width
                : this.options.maxWidth
            );
        }
        this.options.size.x = this.options.maxWidth;
        this.options.size.y = this.options.lines.length * this.options.sizePx;
    };

    TextNode.prototype.getSize = function () {
        return this.options.sizePx;
    };

    TextNode.prototype.drawSimpleText = function (text, position, color, colorL) {
        var context = this.layer.context;
        context.fillStyle = color ? color : this.options.color;
        context.textAlign = this.options.hAlign;
        context.textBaseline = this.options.vAlign;
        context.font = this.options.font;
        context.lineWidth = this.options.lineWidth;
        context.strokeStyle = colorL ? colorL : this.options.colorL;

        var lines = text.split("\n");

        position = position ? position : this.options.position;

        for (var i = 0, len = lines.length; i < len; i += 1) {
            if (this.options.lineWidth) {
                context.strokeText(lines[i], position.x, position.y + this.options.sizePx * i);
            }
            context.fillText(lines[i], position.x, position.y + this.options.sizePx * i);
        }
        context.lineWidth = 0;
        context.strokeStyle = 'black';
    };

    TextNode.prototype.getText = function () {
        return this.options.fullText;
    };

    TextNode.prototype.setText = function (text) {
        this.options.fullText = text;
        this.options.maxWidth = 0;
        this.options.lines = text.split("\n");

        this.j2d.scene.context.font = this.options.font;

        this.options.box.offset.y = this.j2d.math.toInt(this.options.sizePx * 0.26);
        this.options.box.size.y = -this.j2d.math.toInt(this.options.sizePx * 0.26);

        for (var i = 0, len = this.options.lines.length; i < len; i += 1) {
            this.options.maxWidth = (this.options.maxWidth < this.j2d.scene.context.measureText(this.options.lines[i]).width
                ? this.j2d.scene.context.measureText(this.options.lines[i]).width
                : this.options.maxWidth
            );
        }
        this.options.size.x = this.options.maxWidth;
        this.options.size.y = this.options.lines.length * this.options.sizePx;
    };

    TextNode.prototype.draw = function () {
        var context = this.layer.context;
        if (this.options.visible && this.isLookScene()) {
            if (this.options.alpha != 1) {
                var tmpAlpha = context.globalAlpha;
                context.globalAlpha = this.options.alpha;
            }

            if (this.options.angle) {
                context.save();
                context.translate(
                    this.getPosition().x - this.j2d.scene.viewport.x,
                    this.getPosition().y - this.j2d.scene.viewport.y
                );
                context.rotate(this.j2d.math.rad(this.options.angle));
                context.translate(
                    -(this.getPosition().x - this.j2d.scene.viewport.x),
                    -(this.getPosition().y - this.j2d.scene.viewport.y)
                );
            }

            context.fillStyle = this.options.color;
            context.textAlign = this.options.hAlign;
            context.textBaseline = this.options.vAlign;
            context.font = this.options.font;
            context.lineWidth = this.options.lineWidth;
            context.strokeStyle = this.options.colorL;

            for (var i = 0, len = this.options.lines.length; i < len; i += 1) {
                if (this.options.lineWidth) {
                    context.strokeText(this.options.lines[i], this.options.position.x, this.options.position.y + this.options.sizePx * i);
                }
                context.fillText(this.options.lines[i], this.options.position.x, this.options.position.y + this.options.sizePx * i);
            }

            context.lineWidth = 0;
            context.strokeStyle = 'black';

            if (this.options.angle) {
                context.restore();
            }

            if (this.options.alpha != 1) {
                context.globalAlpha = tmpAlpha;
            }
        }
    };

    if (global.J2D !== undefined) global.TextNode = TextNode;
    return TextNode;
});
