/**
 * J2D (jQuery Canvas Graphic Engine plugin)
 *
 * @authors DeVinterX, Skaner(j2Ds)
 * @license BSD
 * @version 0.2.0-dev
 */

/* ------------------------------------------ Utils ------------------------------------------ */

interface Vector2d {
    x : number
    y : number

    constructor(x:number, y:number) : Vector2d
    toArray() : Array<number>
    fromArray(array:Array<number>) : Vector2d
    toString() : string

    getX() : number
    getY() : number
    getVector() : Vector2d
}

interface Vector2dInteger extends Vector2d {
    constructor(x:number, y:number) : Vector2dInteger
}

interface DeviceUtil {
    constructor() : DeviceUtil
    onResize() : DeviceUtil

    getWidth(): number
    getHeight(): number
    getSize(): Vector2dInteger
}

interface MathUtil {
    number2Integer(number:number):number

    randomColor(min:number, max:number, opacity:number):string

    random(min:number, max:number, omitZero:boolean):number

    degree2Radian(degree:number):number

    radian2Degree(radian:number):number
}

/* ------------------------------------------ Nodes ------------------------------------------ */

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

    render(debug:number) : BaseNode
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


/* ------------------------------------------ Exceptions ------------------------------------------ */

/**
 * Default Exception
 */
interface Exception extends Error {
    /**
     * Create custom exception with message.
     * @param {string} message
     */
    constructor(message) : Exception

    /**
     * Convert exception to String
     * @returns {string|}
     */
    toString() : String
}
/**
 * RuntimeException
 */
interface RuntimeException extends Exception {
    /**
     * Create RuntimeException exception with message.
     * @param {string} message
     */
    constructor(message) : RuntimeException
}

/**
 * InvalidArgumentException
 */
interface InvalidArgumentException extends Exception {
    /**
     * Create InvalidArgumentException exception with message.
     * @param {string} message
     */
    constructor(message) : InvalidArgumentException
}

/**
 * BadFunctionCallException
 */
interface BadFunctionCallException extends Exception {
    /**
     * Create BadFunctionCallException exception with message.
     * @param {string} message
     */
    constructor(message) : BadFunctionCallException
}

/**
 * BadMethodCallException
 */
interface BadMethodCallException extends Exception {
    /**
     * Create BadMethodCallException exception with message.
     * @param {string} message
     */
    constructor(message) : BadMethodCallException
}

/**
 * LengthException
 */
interface LengthException extends Exception {
    /**
     * Create LengthException exception with message.
     * @param {string} message
     */
    constructor(message) : LengthException
}

/**
 * LogicException
 */
interface LogicException extends Exception {
    /**
     * Create LogicException exception with message.
     * @param {string} message
     */
    constructor(message) : LogicException
}

/**
 * OutOfBoundsException
 */
interface OutOfBoundsException extends Exception {
    /**
     * Create OutOfBoundsException exception with message.
     * @param {string} message
     */
    constructor(message) : OutOfBoundsException
}

/**
 * OutOfRangeException
 */
interface OutOfRangeException extends Exception {
    /**
     * Create OutOfRangeException exception with message.
     * @param {string} message
     */
    constructor(message) : OutOfRangeException
}

/**
 * RangeException
 */
interface RangeException extends Exception {
    /**
     * Create RangeException exception with message.
     * @param {string} message
     */
    constructor(message) : RangeException
}

/**
 * UnexpectedValueException
 */
interface UnexpectedValueException extends Exception {
    /**
     * Create UnexpectedValueException exception with message.
     * @param {string} message
     */
    constructor(message) : UnexpectedValueException
}
