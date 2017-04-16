import Rectangle from "nodes/primitive2D/Rectangle";

/**
 * Rectangle
 * @constructor
 *
 * @property {BaseNode._data|{position: Array.<number>, size: Array.<number>}} _data
 */
export default class Sprite extends Rectangle {
    textureBuffer = null;
    texture = null;

    bindTextureBuffer(gl) {
        this.textureBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.textureBuffer);

        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
            0.0, 0.0,
            1.0, 0.0,
            0.0, 1.0,
            0.0, 1.0,
            1.0, 0.0,
            1.0, 1.0
        ]), gl.STATIC_DRAW);
    }

    bindTexture(gl) {
        this.texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 0, 0]));

        let image = new Image();
        image.src = 'img/logo.png';
        image.addEventListener('load', () => {
            gl.bindTexture(gl.TEXTURE_2D, this.texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,gl.UNSIGNED_BYTE, image);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
            gl.generateMipmap(gl.TEXTURE_2D);
            gl.bindTexture(gl.TEXTURE_2D, null);
        });
    }

    draw(context, viewport, data) {
        let gl = context, scene = data.components.SceneHandler;

        if (Sprite._shaderProgram && scene._data.render.startsWith('webgl')) {
            // WebGL Render

            let attributes = {
                aPosition: gl.getAttribLocation(Sprite._shaderProgram, 'aPosition'),
                aTexture: gl.getAttribLocation(Sprite._shaderProgram, 'aTexture'),
                uTexture: gl.getUniformLocation(Sprite._shaderProgram, 'uTexture'),
                uResolution: gl.getUniformLocation(Sprite._shaderProgram, 'uResolution'),
                uPosition: gl.getUniformLocation(Sprite._shaderProgram, 'uPosition'),
                uAngle: gl.getUniformLocation(Sprite._shaderProgram, 'uAngle'),
                uScale: gl.getUniformLocation(Sprite._shaderProgram, 'uScale'),
                uCenter: gl.getUniformLocation(Sprite._shaderProgram, 'uCenter')
            };

            if (this.positionBuffer === null) this.bindPositionBuffer(gl);
            if (this.textureBuffer === null) this.bindTextureBuffer(gl);
            if (this.texture === null) this.bindTexture(gl);

            gl.useProgram(Sprite._shaderProgram);

            gl.bindTexture(gl.TEXTURE_2D, this.texture);

            gl.enableVertexAttribArray(attributes.aPosition);
            gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
            gl.vertexAttribPointer(attributes.aPosition, 2, gl.FLOAT, false, 0, 0);

            gl.enableVertexAttribArray(attributes.aTexture);
            gl.bindBuffer(gl.ARRAY_BUFFER, this.textureBuffer);
            gl.vertexAttribPointer(attributes.aTexture, 2, gl.FLOAT, false, 0, 0);

            gl.uniform2fv(attributes.uResolution, new Float32Array([gl.canvas.clientWidth, gl.canvas.clientHeight]));
            gl.uniform2fv(attributes.uPosition, new Float32Array(this._data.position));
            gl.uniform1f(attributes.uAngle, this._data.angle);
            gl.uniform2fv(attributes.uScale, new Float32Array(this._data.scale));
            gl.uniform2fv(attributes.uCenter, new Float32Array(this._data.center));

            gl.uniform1i(attributes.uTexture, 0);

            gl.drawArrays(gl.TRIANGLES, 0, 6);
        } else {
            // Canvas2D Render
            let tempOpacity = 1.0;

            if (this._data.opacity !== 1.0) {
                tempOpacity = context.globalAlpha;
                context.globalAlpha = this._data.opacity;
            }

            if (this._data.angle) {
                context.save();

                context.translate(this._data.position[0], this._data.position[1]);
                context.rotate(this._data.angle);
                context.translate(-(this._data.position[0]), -(this._data.position[1]));
            }

            context.fillStyle = this._colorRGBA;
            context.lineWidth = 0;

            context.fillRect(
                this._data.position[0] - this._data.size[0] / 2,
                this._data.position[1] - this._data.size[1] / 2,
                this._data.size[0] * this._data.scale[0],
                this._data.size[1] * this._data.scale[1]
            );

            if (this._data.angle) {
                context.restore();
            }

            if (this._data.opacity !== 1.0) {
                context.globalAlpha = tempOpacity;
            }
        }
    }

    static _vertextShader = null;
    static _fragmentShader = null;
    static _shaderProgram = null;

    static VertexShader = Rectangle.VertexShader;

    // language=GLSL
    static FragmentShader = `
        precision mediump float;
        varying vec2 vTexture; 
        uniform sampler2D uTexture;
        
        void main() {
            gl_FragColor = texture2D(uTexture, vTexture);
        }
    `;
}
