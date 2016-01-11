/**
 * J2D (jQuery Canvas Graphic Engine plugin)
 *
 * @authors DeVinterX, Skaner(j2Ds)
 * @license BSD
 * @version 0.2.0-dev
 */

interface IVector2d {
    x : number
    y : number

    constructor(x:number, y:number) : IVector2d
    toArray() : Array<number>
    fromArray(array:Array<number>) : IVector2d
    toString() : string

    getX() : number
    getY() : number
    getCoordinates() : IVector2d
}

interface IVector2dInteger extends IVector2d {

}

interface IDeviceUtil {
    resize(width ?:number, height ?:number) : IDeviceUtil

    getWidth(): number
    getHeight(): number
    getSize(): IVector2dInteger
}

interface IMathUtil {
    number2Integer(number:number):number

    randomColor(min:number, max:number, opacity:number):string

    random(min:number, max:number, omitZero:boolean):number

    degree2Radian(degree:number):number
}

/* Nodes */
interface IBaseNode {
    constructor(data:Object) : IBaseNode

    mergeData(properties:Object) : Object
    saveJSON() : string
    loadJSON(json:string) : Object

    getPosition() : IVector2d
    setPosition(position:IVector2d) : IBaseNode

    getSize() : IVector2d
    setSize(size:IVector2d) : IBaseNode

    getOffset() : IVector2d
    setOffset(offset:IVector2d) : IBaseNode

    render(debug:number) : IBaseNode
}

interface ICollectionNode extends IBaseNode {
    constructor(data:Object) : ICollectionNode
}

interface ICameraNode extends IBaseNode {
    constructor(data:Object) : ICameraNode
}

interface IRectNode extends IBaseNode {
    constructor(data:Object) : IRectNode
}
