/**
 * J2D (jQuery Canvas Graphic Engine plugin)
 *
 * @authors DeVinterX, Skaner(j2Ds)
 * @license BSD
 * @version 0.2.0-dev
 */


/* Utils */
interface Vector2d {
    x : number
    y : number

    constructor(x:number, y:number) : Vector2d

    getCoordinateX() : number
    getCoordinateY() : number
    getCoordinates() : Vector2d
}

interface Vector2dInteger extends Vector2d {

}

interface DeviceUtil {
    resize(width ?:number, height ?:number) : DeviceUtil

    getWidth(): number
    getHeight(): number
    getSize(): Object
}

declare module MathUtil {
    function number2Integer(number:number):number

    function randomColor(min:number, max:number, opacity:number):string

    function random(min:number, max:number, omitZero:boolean):number

    function degree2Radian(degree:number):number
}

/* Nodes */
interface BaseNode {
    constructor(data:Object) : BaseNode

    mergeData(properties:Object) : Object
    saveJSON() : string
    loadJSON(json:string) : Object

    getPosition() : Vector2d
    setPosition(position:Vector2d) : BaseNode

    getSize() : Vector2d
    setSize(size:Vector2d) : BaseNode

    getOffset() : Vector2d
    setOffset(offset:Vector2d) : BaseNode

    render(debug: number) : BaseNode
}

interface CollectionNode extends BaseNode {
    constructor(data:Object) : CollectionNode
}

interface CameraNode extends BaseNode {
    constructor(data:Object) : CameraNode
}

interface RectNode extends BaseNode {
    constructor(data:Object) : RectNode
}
