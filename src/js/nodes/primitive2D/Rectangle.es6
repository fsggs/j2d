import BaseNode from "nodes/BaseNode";
import MathUtil from "utils/MathUtil";

/**
 * Rectangle
 * @constructor
 *
 * @property {BaseNode._data|{position: Array.<number>, size: Array.<number>}} _data
 */
export default class Rectangle extends BaseNode {
    _webGLCache = {
        positionBuffer: null,
        attributes: [],
        cacheData: null
    };

    constructor(x, y, width, height) {
        super({
            position: [x || 0.0, y || 0.0],
            size: [width || 0.0, height || 0.0],
            angle: MathUtil.degree2Radian(45),
            scale: [1.0, 1.0],
            center: [0.0, 0.0],
            color: [Math.random(), Math.random(), Math.random(), 1.0],
            opacity: 1.0
        });

        this._colorRGBA = MathUtil.vectorColorToRGBA(this._data.color);

        this.setWebGLCache();
        this.toCenter();
    }

    toCenter(cx, cy) {
        if (cx === undefined) cx = this._data.size[0] / 2;
        if (cy === undefined) cy = this._data.size[1] / 2;

        this._data.center = [-cx, -cy];
        this._webGLCache.cacheData.uCenter = new Float32Array([-cx, -cy])
    }

    setWebGLCache() {
        this._webGLCache.cacheData = {
            uResolution: null,
            uPosition: new Float32Array(this._data.position),
            uScale: new Float32Array(this._data.scale),
            uCenter: new Float32Array(this._data.center),
            uColor: new Float32Array(this._data.color)
        };
    }

    bindPositionBuffer(gl) {
        this._webGLCache.positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this._webGLCache.positionBuffer);

        let x = [0, this._data.size[0]];
        let y = [0, this._data.size[1]];

        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
            x[0], y[0],
            x[1], y[0],
            x[0], y[1],
            x[0], y[1],
            x[1], y[0],
            x[1], y[1],
        ]), gl.STATIC_DRAW);
    }

    bindAttributes(gl) {
        this._webGLCache.attributes = {
            aPosition: gl.getAttribLocation(Rectangle._shaderProgram, 'aPosition'),
            uColor: gl.getUniformLocation(Rectangle._shaderProgram, 'uColor'),
            uResolution: gl.getUniformLocation(Rectangle._shaderProgram, 'uResolution'),
            uPosition: gl.getUniformLocation(Rectangle._shaderProgram, 'uPosition'),
            uAngle: gl.getUniformLocation(Rectangle._shaderProgram, 'uAngle'),
            uScale: gl.getUniformLocation(Rectangle._shaderProgram, 'uScale'),
            uCenter: gl.getUniformLocation(Rectangle._shaderProgram, 'uCenter')
        };
    }

    draw(context, viewport, data) {
        let gl = context, scene = data.components.SceneHandler;

        if (Rectangle._shaderProgram && scene._data.render.startsWith('webgl')) {
            // WebGL Render

            if (this._webGLCache.attributes.length === 0) this.bindAttributes(gl);
            if (this._webGLCache.positionBuffer === null) this.bindPositionBuffer(gl);
            if (this._webGLCache.cacheData.uResolution === null) {
                this._webGLCache.cacheData.uResolution = new Float32Array([gl.canvas.clientWidth, gl.canvas.clientHeight]);
            }

            if(scene._data.program === undefined || scene._data.program !== 'RECTANGLE') {
                gl.useProgram(Rectangle._shaderProgram);
                scene._data.program = 'RECTANGLE';
            }

            gl.enableVertexAttribArray(this._webGLCache.attributes.aPosition);
            gl.bindBuffer(gl.ARRAY_BUFFER, this._webGLCache.positionBuffer);
            gl.vertexAttribPointer(this._webGLCache.attributes.aPosition, 2, gl.FLOAT, false, 0, 0);

            gl.uniform2fv(this._webGLCache.attributes.uResolution, this._webGLCache.cacheData.uResolution);
            gl.uniform2fv(this._webGLCache.attributes.uPosition, this._webGLCache.cacheData.uPosition);
            gl.uniform1f(this._webGLCache.attributes.uAngle, this._data.angle);
            gl.uniform2fv(this._webGLCache.attributes.uScale, this._webGLCache.cacheData.uScale);
            gl.uniform2fv(this._webGLCache.attributes.uCenter, this._webGLCache.cacheData.uCenter);

            gl.uniform4fv(this._webGLCache.attributes.uColor, this._webGLCache.cacheData.uColor);

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

    render(context, viewport, data) {
        this.draw(context, viewport, data);
    }

    static _vertextShader = null;
    static _fragmentShader = null;
    static _shaderProgram = null;

    // language=GLSL
    static VertexShader = `
        precision mediump float;

        attribute vec2 aPosition;
        uniform vec2 uResolution;
        uniform vec2 uPosition;
        uniform float uAngle;
        uniform vec2 uScale;
        uniform vec2 uCenter;
        
        attribute vec2 aTexture;
        varying vec2 vTexture;
        
        mat3 projection () {
            return mat3(
                2.0 / uResolution[0], 0.0, 0.0,
                0.0, -2.0 / uResolution[1], 0.0,
                -1.0, 1.0, 1.0
            );
        }
        
        mat3 translate (mat3 m) {
            return m * mat3(
                1.0, 0.0, 0.0,
                0.0, 1.0, 0.0,
                uPosition[0], uPosition[1], 1.0
            );
        }
        
         mat3 rotate (mat3 m) {
            float s = sin(uAngle);
            float c = cos(uAngle);
            return m * mat3(
                c, s, 0.0,
                -s, c, 0.0,
                0.0, 0.0, 1.0
            );
        }
        
        mat3 scale (mat3 m) {
            return m * mat3(
                uScale[0], 0.0, 0.0,
                0.0, uScale[1], 0.0,
                0.0, 0.0, 1.0
            );
        }
        
        mat3 center (mat3 m) {
            return m * mat3(
                1.0, 0.0, 0.0,
                0.0, 1.0, 0.0,
                uCenter[0], uCenter[1], 1.0
            );
        }

        void main() {
            gl_Position = vec4((center(scale(rotate(translate(projection())))) * vec3(aPosition, 1)).xy, 0, 1);
            vTexture = aTexture;
        }
    `;

    // language=GLSL
    static FragmentShader = `
        precision mediump float;
        
        uniform vec4 uColor;
        
        void main() {
            gl_FragColor = uColor;
        }
    `;
};
