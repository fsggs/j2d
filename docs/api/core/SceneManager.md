<img src="https://github.com/fsggs/jquery.j2d/blob/0.2.0-dev/src/img/logo.png?raw=true" align="left" width="80"/>
<h1 align="left">jQuery.j2d <a href="https://www.versioneye.com/user/projects/56afa5f63d82b9003761dfc8">
    <img src="https://www.versioneye.com/user/projects/56afa5f63d82b9003761dfc8/badge.svg?style=flat"/></a></h1>


## API Reference

<a name="core/SceneManager"></a>

## core/SceneManager
SceneManager

**Kind**: global class  
**Properties**

| Name | Type |
| --- | --- |
| data | <code>SceneManager.defaults</code> | 
| backgroundColor | <code>string</code> | 
| opacity | <code>number</code> | 
| visible | <code>boolean</code> | 
| zIndex | <code>number</code> | 
| viewport | <code>Object</code> | 


* [core/SceneManager](#core/SceneManager)
    * [new SceneManager(j2d)](#new_core/SceneManager_new)
    * [.add(node, [key])](#core/SceneManager+add) ⇒ <code>SceneManager</code>
    * [.async(callback, data)](#core/SceneManager+async) ⇒ <code>SceneManager</code>
    * [.canvas](#core/SceneManager+canvas) : <code>HTMLCanvasElement</code>
    * [.clear([pos], [size])](#core/SceneManager+clear) ⇒ <code>SceneManager</code>
    * [.context](#core/SceneManager+context) : <code>CanvasRenderingContext2D</code>
    * [.fillBackground()](#core/SceneManager+fillBackground) ⇒ <code>SceneManager</code>
    * [.fixGameStateRender()](#core/SceneManager+fixGameStateRender) ⇒ <code>SceneManager</code>
    * [.frameManager](#core/SceneManager+frameManager) : <code>FrameManager</code>
    * [.fullScreen([fullscreen])](#core/SceneManager+fullScreen) ⇒ <code>SceneManager</code>
    * [.getSceneLayer()](#core/SceneManager+getSceneLayer) ⇒ <code>CollectionNode</code> &#124; <code>null</code>
    * [.init(options)](#core/SceneManager+init) ⇒ <code>SceneManager</code>
    * [.initCanvas()](#core/SceneManager+initCanvas) ⇒ <code>SceneManager</code>
    * [.initLayers()](#core/SceneManager+initLayers) ⇒ <code>SceneManager</code>
    * [.j2d](#core/SceneManager+j2d) : <code>J2D</code>
    * [.layersManager](#core/SceneManager+layersManager) : <code>LayersManager</code>
    * [.registerCamera(node)](#core/SceneManager+registerCamera) ⇒ <code>SceneManager</code>
    * [.remove([node], [key])](#core/SceneManager+remove) ⇒ <code>SceneManager</code>
    * [.render(data)](#core/SceneManager+render) ⇒ <code>SceneManager</code>
    * [.resize(width, height)](#core/SceneManager+resize) ⇒ <code>SceneManager</code>
    * [.resizeToFullPage([fullscreen])](#core/SceneManager+resizeToFullPage) ⇒ <code>SceneManager</code>
    * [.setGameState(gameState)](#core/SceneManager+setGameState) ⇒ <code>SceneManager</code>
    * [.start()](#core/SceneManager+start) ⇒ <code>SceneManager</code>
    * [.stop()](#core/SceneManager+stop) ⇒ <code>SceneManager</code>
    * [.toggleFullScreen(j2d, data)](#core/SceneManager+toggleFullScreen) ⇒ <code>SceneManager</code>
    * [.updateViewport([node])](#core/SceneManager+updateViewport) ⇒ <code>SceneManager</code>
    * [.viewportManager](#core/SceneManager+viewportManager) : <code>ViewportManager</code>

<a name="new_core/SceneManager_new"></a>

### new SceneManager(j2d)

| Param | Type |
| --- | --- |
| j2d | <code>J2D</code> | 

<a name="core/SceneManager+add"></a>

### core/SceneManager.add(node, [key]) ⇒ <code>SceneManager</code>
**Kind**: instance method of <code>[core/SceneManager](#core/SceneManager)</code>  

| Param | Type |
| --- | --- |
| node | <code>BaseNode</code> | 
| [key] | <code>string</code> | 

<a name="core/SceneManager+async"></a>

### core/SceneManager.async(callback, data) ⇒ <code>SceneManager</code>
**Kind**: instance method of <code>[core/SceneManager](#core/SceneManager)</code>  

| Param | Type |
| --- | --- |
| callback | <code>function</code> &#124; <code>callback</code> | 
| data | <code>\*</code> | 

<a name="core/SceneManager+canvas"></a>

### core/SceneManager.canvas : <code>HTMLCanvasElement</code>
**Kind**: instance property of <code>[core/SceneManager](#core/SceneManager)</code>  
<a name="core/SceneManager+clear"></a>

### core/SceneManager.clear([pos], [size]) ⇒ <code>SceneManager</code>
**Kind**: instance method of <code>[core/SceneManager](#core/SceneManager)</code>  

| Param | Type |
| --- | --- |
| [pos] | <code>Object</code> &#124; <code>Vector2d</code> | 
| [size] | <code>Object</code> &#124; <code>Vector2d</code> | 

<a name="core/SceneManager+context"></a>

### core/SceneManager.context : <code>CanvasRenderingContext2D</code>
**Kind**: instance property of <code>[core/SceneManager](#core/SceneManager)</code>  
<a name="core/SceneManager+fillBackground"></a>

### core/SceneManager.fillBackground() ⇒ <code>SceneManager</code>
**Kind**: instance method of <code>[core/SceneManager](#core/SceneManager)</code>  
<a name="core/SceneManager+fixGameStateRender"></a>

### core/SceneManager.fixGameStateRender() ⇒ <code>SceneManager</code>
**Kind**: instance method of <code>[core/SceneManager](#core/SceneManager)</code>  
<a name="core/SceneManager+frameManager"></a>

### core/SceneManager.frameManager : <code>FrameManager</code>
**Kind**: instance property of <code>[core/SceneManager](#core/SceneManager)</code>  
<a name="core/SceneManager+fullScreen"></a>

### core/SceneManager.fullScreen([fullscreen]) ⇒ <code>SceneManager</code>
**Kind**: instance method of <code>[core/SceneManager](#core/SceneManager)</code>  

| Param | Type |
| --- | --- |
| [fullscreen] | <code>boolean</code> | 

<a name="core/SceneManager+getSceneLayer"></a>

### core/SceneManager.getSceneLayer() ⇒ <code>CollectionNode</code> &#124; <code>null</code>
**Kind**: instance method of <code>[core/SceneManager](#core/SceneManager)</code>  
<a name="core/SceneManager+init"></a>

### core/SceneManager.init(options) ⇒ <code>SceneManager</code>
**Kind**: instance method of <code>[core/SceneManager](#core/SceneManager)</code>  

| Param | Type |
| --- | --- |
| options | <code>SceneManager.defaults</code> &#124; <code>Object</code> &#124; <code>undefined</code> | 

<a name="core/SceneManager+initCanvas"></a>

### core/SceneManager.initCanvas() ⇒ <code>SceneManager</code>
**Kind**: instance method of <code>[core/SceneManager](#core/SceneManager)</code>  
<a name="core/SceneManager+initLayers"></a>

### core/SceneManager.initLayers() ⇒ <code>SceneManager</code>
**Kind**: instance method of <code>[core/SceneManager](#core/SceneManager)</code>  
<a name="core/SceneManager+j2d"></a>

### core/SceneManager.j2d : <code>J2D</code>
**Kind**: instance property of <code>[core/SceneManager](#core/SceneManager)</code>  
<a name="core/SceneManager+layersManager"></a>

### core/SceneManager.layersManager : <code>LayersManager</code>
**Kind**: instance property of <code>[core/SceneManager](#core/SceneManager)</code>  
<a name="core/SceneManager+registerCamera"></a>

### core/SceneManager.registerCamera(node) ⇒ <code>SceneManager</code>
**Kind**: instance method of <code>[core/SceneManager](#core/SceneManager)</code>  

| Param | Type |
| --- | --- |
| node | <code>CameraNode</code> | 

<a name="core/SceneManager+remove"></a>

### core/SceneManager.remove([node], [key]) ⇒ <code>SceneManager</code>
**Kind**: instance method of <code>[core/SceneManager](#core/SceneManager)</code>  

| Param | Type |
| --- | --- |
| [node] | <code>BaseNode</code> | 
| [key] | <code>string</code> | 

<a name="core/SceneManager+render"></a>

### core/SceneManager.render(data) ⇒ <code>SceneManager</code>
**Kind**: instance method of <code>[core/SceneManager](#core/SceneManager)</code>  

| Param | Type |
| --- | --- |
| data | <code>Object</code> | 

<a name="core/SceneManager+resize"></a>

### core/SceneManager.resize(width, height) ⇒ <code>SceneManager</code>
**Kind**: instance method of <code>[core/SceneManager](#core/SceneManager)</code>  

| Param | Type |
| --- | --- |
| width | <code>number</code> | 
| height | <code>number</code> | 

<a name="core/SceneManager+resizeToFullPage"></a>

### core/SceneManager.resizeToFullPage([fullscreen]) ⇒ <code>SceneManager</code>
**Kind**: instance method of <code>[core/SceneManager](#core/SceneManager)</code>  

| Param | Type |
| --- | --- |
| [fullscreen] | <code>boolean</code> | 

<a name="core/SceneManager+setGameState"></a>

### core/SceneManager.setGameState(gameState) ⇒ <code>SceneManager</code>
**Kind**: instance method of <code>[core/SceneManager](#core/SceneManager)</code>  

| Param | Type |
| --- | --- |
| gameState | <code>function</code> &#124; <code>callback</code> | 

<a name="core/SceneManager+start"></a>

### core/SceneManager.start() ⇒ <code>SceneManager</code>
**Kind**: instance method of <code>[core/SceneManager](#core/SceneManager)</code>  
<a name="core/SceneManager+stop"></a>

### core/SceneManager.stop() ⇒ <code>SceneManager</code>
**Kind**: instance method of <code>[core/SceneManager](#core/SceneManager)</code>  
<a name="core/SceneManager+toggleFullScreen"></a>

### core/SceneManager.toggleFullScreen(j2d, data) ⇒ <code>SceneManager</code>
**Kind**: instance method of <code>[core/SceneManager](#core/SceneManager)</code>  

| Param | Type |
| --- | --- |
| j2d | <code>J2D</code> | 
| data | <code>Object</code> | 

<a name="core/SceneManager+updateViewport"></a>

### core/SceneManager.updateViewport([node]) ⇒ <code>SceneManager</code>
**Kind**: instance method of <code>[core/SceneManager](#core/SceneManager)</code>  

| Param | Type |
| --- | --- |
| [node] | <code>CameraNode</code> | 

<a name="core/SceneManager+viewportManager"></a>

### core/SceneManager.viewportManager : <code>ViewportManager</code>
**Kind**: instance property of <code>[core/SceneManager](#core/SceneManager)</code>  

## License

BSD. © 2015 Dimitriy Kalugin, Zlib. © 2015 Нагель Петр

