/**
 * J2D (jQuery Canvas Graphic Engine plugin)
 *
 * @authors DeVinterX, Skaner(j2Ds)
 * @license BSD
 * @version 0.2.0-dev
 */

declare var global:Window;
declare var j2dPlugin:{pluginInit:boolean}|boolean;

/* ------------------------------------------ Utils ------------------------------------------ */

interface Vector2d {
    x:number;
    y:number;

    constructor(x:number, y:number):Vector2d;
    toArray():Array<number>;
    fromArray(array:Array<number>):Vector2d;
    toString():string;

    getX():number;
    getY():number;
    getVector():{x:number, y:number};
}

interface Vector2dInteger extends Vector2d {
    constructor(x:number, y:number):Vector2dInteger;
}

interface DeviceUtil {
    width:number;
    height:number;

    constructor():DeviceUtil;
    onResize():DeviceUtil;

    getWidth():number;
    getHeight():number;
    getSize():Vector2dInteger;
}

interface MathUtil {
    number2Integer(number:number):number;
    isInteger(number:number):boolean;
    randomColor(min:number, max:number, opacity:number):string;
    random(min:number, max:number, omitZero:boolean):number;
    degree2Radian(degree:number):number;
    radian2Degree(radian:number):number;
}

interface ArrayMap<T> {
    length:number;
    toString():string;
    toLocaleString():string;
    push(...items:T[]):number;
    pop():T;
    concat(...items:(T | T[])[]):T[];
    join(separator?:string):string;
    reverse():T[];
    shift():T;
    slice(start?:number, end?:number):T[];
    sort(compareFn?:(a:T, b:T) => number):T[];
    splice(start:number):T[];
    splice(start:number, deleteCount:number, ...items:T[]):T[];
    unshift(...items:T[]):number;
    indexOf(searchElement:T, fromIndex?:number):number;
    lastIndexOf(searchElement:T, fromIndex?:number):number;
    every(callback:(value:T, index:number, array:T[]) => boolean, thisArg?:any):boolean;
    some(callback:(value:T, index:number, array:T[]) => boolean, thisArg?:any):boolean;
    forEach(callback:(value:T, index:number, array:T[]) => void, thisArg?:any):void;
    map<U>(callback:(value:T, index:number, array:T[]) => U, thisArg?:any):U[];
    filter(callback:(value:T, index:number, array:T[]) => boolean, thisArg?:any):T[];
    reduce(callback:(previousValue:T, currentValue:T, currentIndex:number, array:T[]) => T, initialValue?:T):T;
    reduce<U>(callback:(previousValue:U, currentValue:T, currentIndex:number, array:T[]) => U, initialValue:U):U;
    reduceRight(callback:(previousValue:T, currentValue:T, currentIndex:number, array:T[]) => T, initialValue?:T):T;
    reduceRight<U>(callback:(previousValue:U, currentValue:T, currentIndex:number, array:T[]) => U, initialValue:U):U;

    [n:number]:T;

    /* Custom extended methods */
    last():T;
    equals(array:ArrayMap<any>):boolean;
    contains(object:string|Object):boolean;
    each(callback:Function):boolean;
    add(key:string|Object, value:any):ArrayMap<any>;
    remove(key:string|Object):ArrayMap<any>;
}

/* ------------------------------------------ J2D ------------------------------------------ */

interface J2D {
    element:Element|JQuery;
    data: {
        id:string,
        io:InputManager|undefined,
        deltaTime:number,
        pause:boolean,
        ready:boolean,
        frameLimit:number,
        smoothing:boolean,
        webGL:boolean
    }
    device:DeviceUtil;
    scene:SceneManager;

    WebGL:boolean;
    smoothing:boolean;
    io:InputManager;
    isPlay:boolean;

    start():void;
    start():void;
    pause():void;
    resume():void;
    getSceneManager():SceneManager;
    getLayersManager():LayersManager;
    getFrameManager():FrameManager;

    on():void;
    once():void;
    off():void;
    trigger():void;

    util:{
        disableSmoothing(context:Element|Object):void;
    };
}

interface JQuery {
    /**
     * Init plugin
     * @param {J2D.options} options
     */
    j2d(options:Object): J2D|Array<J2D>;
}

/* ------------------------------------------ Core ------------------------------------------ */

interface IGameStateManager {
    init():void;
    update():void;
    render():void;

    stop():void;
}

interface FrameManager {
    start(name:string, engine:IGameStateManager, params:{
        j2d:J2D|undefined,
        frameLimit:number|undefined,
        now:number|undefined,
        deltaTime:number|undefined,
        lastTime:number|undefined,
        sceneStartTime:number|undefined,
        sceneSkipTime:number|undefined,

        asyncUpdate:boolean|undefined,
        asyncRender:boolean|undefined
    }):void;
    stop(name):void;
    pulse():void;

    runMainLoop(timestamp, frameManager):void;
    setDefaultFrameLimit(frameLimit):void;

    Init():FrameManager;
}

interface SceneManager {
    j2d:J2D;
    canvas:HTMLCanvasElement;
    context:CanvasRenderingContext2D;

    frameManager:FrameManager;
    layersManager:LayersManager;

    backgroundColor:string|CanvasGradient|CanvasPattern;
    opacity:number;
    visible:boolean;
    zIndex:number;
    viewport:{offset:{x:number, y:number}, size:{x:number, y:number}, scale:number, angle:number};

    init(options:{
        width:number|undefined,
        height:number|undefined,

        visible:boolean|undefined,
        position:string|undefined,
        top:number|undefined,
        left:number|undefined,
        zIndex:number|undefined,
        opacity:number|undefined,
        backgroundColor:boolean|string|CanvasGradient|CanvasPattern|undefined,

        frameLimit:number|undefined,
        enableFullScreen:boolean|undefined,

        viewport:{x:number, y:number}|undefined,
        gameState:IGameStateManager|undefined
    }):SceneManager;

    initCanvas():void;
    clear(pos:number, size:number):SceneManager;
    resize(width:number, height:number):SceneManager;
    setGameState(gameState:IGameStateManager):SceneManager;
    async(callback:Function, data:any):SceneManager;
    start():SceneManager;
    stop():SceneManager;

    fullScreen(fullscreen:boolean):SceneManager;
    resizeToFullPage(fullscreen:boolean):SceneManager;
    toggleFullScreen(j2d:J2D, data:{fullscreen:boolean}):SceneManager;
}

interface LayersManager {
    j2d:J2D;
    layers:ArrayMap;

    addLayer(name:string|undefined, node:CollectionNode|undefined):LayersManager
    removeLayer(name:string):LayersManager
    getLayer(name:string):CollectionNode|null
}

interface ViewportManager {
    cameras:ArrayMap<CameraNode>;
    camera:string;
    screen:{x:number, y:number};

    data:{
        offset:{x:number, y:number},
        size:{x:number, y:number},
        scale:number,
        angle:number
    };

    setScreen(data:{x: number|undefined, y: number|undefined}|Array<number>):ViewportManager;
    addCamera(key:string, node:CameraNode):ViewportManager;
    removeCamera(key:string):ViewportManager;
    updateViewport(key:string):ViewportManager;
    setViewport(offset:Vector2d, size:Vector2d):ViewportManager;
    getViewport():{offset: {x: number, y: number}, size: {x: number, y: number}, scale: number, angle: number};
}

/* ------------------------------------------ IO ------------------------------------------ */
interface IInputManager {
    init():void;
    update():void;
    flush():void;
    clear():void;

    enable():void;
    disable():void;
}

interface InputManager extends IInputManager {
    j2d:J2D;
    id:string;
    element:Element|JQuery;
    keyMap:ArrayMap<Array<any>>;

    data:{
        mouse:{
            startPosition:{x:number, y:number},
            currentPosition:{x:number, y:number},
            previousDistance:number,
            distance:number
        },
        viewport:{
            position:{x:number, y:number}
        },
        enabled:boolean,
        enableAdditionalData:boolean,
        keysPressed:ArrayMap<number>,
        writeMode:boolean,
        timePressed:number,
        preventAll:boolean,

        cursor: {
            enabled:boolean,
            image:string
        }
    };

    update():void|boolean;
    fixMouseWheel():void;
    load(newKeyMap:string):any;
    save():string;
    setKeys(mapObject:ArrayMap<Array<any>>):void;
    getMouseMoveDistance():{current:number, previous:number};
    checkPressedKeyList(keyList:Array<number>):boolean|{keyList:Array<number>, time:number};
    checkPressedKeyMap(key:string):boolean|{keyList:Array<number>, time:number};
    getPosition():Vector2d;
    onNode(id):boolean;
    setWriteMode(mode:boolean):void;
    isWriteMode():boolean;
    setCursorImage(image:string):void;
    toggleCursor(enable:boolean):void;
    isCursorVisible():boolean;

    key:{
        KEY_MOUSE_LEFT:number,
        KEY_MOUSE_MIDDLE:number,
        KEY_MOUSE_RIGHT:number,

        SCROLL_MOUSE_UP:number,
        SCROLL_MOUSE_DOWN:number,

        KEY_BACKSPACE:number,
        KEY_TAB:number,
        KEY_ENTER:number,
        KEY_SHIFT:number,
        KEY_CTRL:number,
        KEY_ALT:number,
        KEY_PAUSE:number,
        KEY_BREAK:number,
        KEY_CAPS_LOCK:number,
        KEY_ESCAPE:number,
        KEY_SPACE_BAR:number,
        KEY_PAGE_UP:number,
        KEY_PAGE_DOWN:number,
        KEY_END:number,
        KEY_HOME:number,
        KEY_LEFT_ARROW:number,
        KEY_UP_ARROW:number,
        KEY_RIGHT_ARROW:number,
        KEY_DOWN_ARROW:number,
        KEY_INSERT:number,
        KEY_DELETE:number,
        KEY_0:number,
        KEY_1:number,
        KEY_2:number,
        KEY_3:number,
        KEY_4:number,
        KEY_5:number,
        KEY_6:number,
        KEY_7:number,
        KEY_8:number,
        KEY_9:number,
        KEY_A:number,
        KEY_B:number,
        KEY_C:number,
        KEY_D:number,
        KEY_E:number,
        KEY_F:number,
        KEY_G:number,
        KEY_H:number,
        KEY_I:number,
        KEY_J:number,
        KEY_K:number,
        KEY_L:number,
        KEY_M:number,
        KEY_N:number,
        KEY_O:number,
        KEY_P:number,
        KEY_Q:number,
        KEY_R:number,
        KEY_S:number,
        KEY_T:number,
        KEY_U:number,
        KEY_V:number,
        KEY_W:number,
        KEY_X:number,
        KEY_Y:number,
        KEY_Z:number,
        KEY_LEFT_WINDOW_KEY:number,
        KEY_RIGHT_WINDOW_KEY:number,
        KEY_SELECT_KEY:number,
        KEY_NUMPAD_0:number,
        KEY_NUMPAD_1:number,
        KEY_NUMPAD_2:number,
        KEY_NUMPAD_3:number,
        KEY_NUMPAD_4:number,
        KEY_NUMPAD_5:number,
        KEY_NUMPAD_6:number,
        KEY_NUMPAD_7:number,
        KEY_NUMPAD_8:number,
        KEY_NUMPAD_9:number,
        KEY_MULTIPLY:number,
        KEY_ADD:number,
        KEY_SUBTRACT:number,
        KEY_DECIMAL_POINT:number,
        KEY_DIVIDE:number,
        KEY_F1:number,
        KEY_F2:number,
        KEY_F3:number,
        KEY_F4:number,
        KEY_F5:number,
        KEY_F6:number,
        KEY_F7:number,
        KEY_F8:number,
        KEY_F9:number,
        KEY_F10:number,
        KEY_F11:number,
        KEY_F12:number,
        KEY_NUM_LOCK:number,
        KEY_SCROLL_LOCK:number,
        KEY_SEMI_COLON:number,
        KEY_EQUAL_SIGN:number,
        KEY_COMMA:number,
        KEY_DASH:number,
        KEY_PERIOD:number,
        KEY_FORWARD_SLASH:number,
        KEY_GRAVE_ACCENT:number,
        KEY_OPEN_BRACKET:number,
        KEY_BACK_SLASH:number,
        KEY_CLOSE_BRACKET:number,
        KEY_SINGLE_QUOTE:number,
        KEY_LEFT_COMMAND:number,
        KEY_RIGHT_COMMAND:number
    };
}

/* ------------------------------------------ Nodes ------------------------------------------ */

interface IDataBaseNode {
    id:string,
    type:string,

    position:{x:number,y:number},
    size:{x:number,y:number},
    offset:{x:number,y:number},

    visible:boolean,
    angle:number,
    opacity:number,

    cache:Object,
    enabledCache:boolean
}

interface BaseNode {
    opacity:number;
    visible:boolean;
    angle:number;
    cache:boolean;

    constructor(data:IDataBaseNode):BaseNode

    getPosition():Vector2d
    setPosition(position:Vector2d):BaseNode

    getSize():Vector2d
    setSize(size:Vector2d):BaseNode

    getOffset():Vector2d
    setOffset(offset:Vector2d):BaseNode

    render(context:CanvasRenderingContext2D,
           viewport:{offset:{x:number, y:number}, size:{x:number, y:number}, scale:number, angle:number},
           collection:CollectionNode,
           data:Object):BaseNode
}

interface CollectionNode extends BaseNode {
    constructor(data:IDataBaseNode):CollectionNode
}

interface CameraNode extends BaseNode {
    constructor(data:IDataBaseNode):CameraNode
    getCameraViewport(screen:{x:number, y:number},
                      calculate:Function):{offset:{x:number, y:number}, size:{x:number, y:number}, scale:number, angle:number}
}

interface RectNode extends BaseNode {
    constructor(data:IDataBaseNode):RectNode
}


/* ------------------------------------------ Exceptions ------------------------------------------ */

interface Exception extends Error {
    constructor(message:string):Exception
    toString():String
}

interface RuntimeException extends Exception {
    constructor(message:string):RuntimeException
}

interface InvalidArgumentException extends Exception {
    constructor(message:string):InvalidArgumentException
}

interface BadFunctionCallException extends Exception {
    constructor(message:string):BadFunctionCallException
}

interface BadMethodCallException extends Exception {
    constructor(message:string):BadMethodCallException
}

interface LengthException extends Exception {
    constructor(message:string):LengthException
}

interface LogicException extends Exception {
    constructor(message:string):LogicException
}

interface OutOfBoundsException extends Exception {
    constructor(message:string):OutOfBoundsException
}

interface OutOfRangeException extends Exception {
    constructor(message:string):OutOfRangeException
}

interface RangeException extends Exception {

    constructor(message:string):RangeException
}

interface UnexpectedValueException extends Exception {
    constructor(message:string):UnexpectedValueException
}
