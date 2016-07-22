<img src="https://github.com/fsggs/jquery.j2d/blob/0.2.0-dev/src/img/logo.png?raw=true" align="left" width="80"/>
<h1 align="left">J2D [js2de] <a href="https://www.versioneye.com/user/projects/56afa5f63d82b9003761dfc8">
    <img src="https://www.versioneye.com/user/projects/56afa5f63d82b9003761dfc8/badge.svg?style=flat"/></a></h1>


## API Reference

<a name="module_j2d"></a>

## j2d

* [j2d](#module_j2d)
    * [Engine](#exp_module_j2d--Engine) ⏏
        * [new Engine(element, data)](#new_module_j2d--Engine_new)
        * _instance_
            * [.Log](#module_j2d--Engine+Log) : <code>SystemConsole</code>
            * [.data](#module_j2d--Engine+data) : <code>Engine.defaults</code>
            * [.device](#module_j2d--Engine+device) : <code>DeviceUtil</code>
            * [.element](#module_j2d--Engine+element) : <code>Element</code> &#124; <code>jQuery</code>
            * [.getFrameManager()](#module_j2d--Engine+getFrameManager) ⇒ <code>FrameManager</code>
            * [.getGameStatesManager()](#module_j2d--Engine+getGameStatesManager) ⇒ <code>GameStatesManager</code>
            * [.getLayersManager()](#module_j2d--Engine+getLayersManager) ⇒ <code>LayersManager</code>
            * [.getSceneManager()](#module_j2d--Engine+getSceneManager) ⇒ <code>SceneManager</code>
            * [.getViewportManager()](#module_j2d--Engine+getViewportManager) ⇒ <code>ViewportManager</code>
            * [.scene](#module_j2d--Engine+scene) : <code>SceneManager</code>
            * [.start()](#module_j2d--Engine+start)
        * _static_
            * [.util](#module_j2d--Engine.util)
                * [.disableSmoothing(context)](#module_j2d--Engine.util.disableSmoothing)

<a name="exp_module_j2d--Engine"></a>

### Engine ⏏
Engine

**Kind**: Exported class  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| WebGL | <code>boolean</code> | // TODO:: To scene |
| smoothing | <code>boolean</code> | // TODO:: To scene |
| io | <code>InputManager</code> &#124; <code>null</code> |  |
| media | <code>MediaManager</code> &#124; <code>null</code> |  |
| isPlay | <code>boolean</code> |  |

<a name="new_module_j2d--Engine_new"></a>

#### new Engine(element, data)

| Param | Type |
| --- | --- |
| element | <code>Element</code> &#124; <code>jQuery</code> | 
| data | <code>Engine.defaults</code> | 

<a name="module_j2d--Engine+Log"></a>

#### engine.Log : <code>SystemConsole</code>
**Kind**: instance property of <code>[Engine](#exp_module_j2d--Engine)</code>  
<a name="module_j2d--Engine+data"></a>

#### engine.data : <code>Engine.defaults</code>
**Kind**: instance property of <code>[Engine](#exp_module_j2d--Engine)</code>  
<a name="module_j2d--Engine+device"></a>

#### engine.device : <code>DeviceUtil</code>
**Kind**: instance property of <code>[Engine](#exp_module_j2d--Engine)</code>  
<a name="module_j2d--Engine+element"></a>

#### engine.element : <code>Element</code> &#124; <code>jQuery</code>
**Kind**: instance property of <code>[Engine](#exp_module_j2d--Engine)</code>  
<a name="module_j2d--Engine+getFrameManager"></a>

#### engine.getFrameManager() ⇒ <code>FrameManager</code>
**Kind**: instance method of <code>[Engine](#exp_module_j2d--Engine)</code>  
<a name="module_j2d--Engine+getGameStatesManager"></a>

#### engine.getGameStatesManager() ⇒ <code>GameStatesManager</code>
**Kind**: instance method of <code>[Engine](#exp_module_j2d--Engine)</code>  
<a name="module_j2d--Engine+getLayersManager"></a>

#### engine.getLayersManager() ⇒ <code>LayersManager</code>
**Kind**: instance method of <code>[Engine](#exp_module_j2d--Engine)</code>  
<a name="module_j2d--Engine+getSceneManager"></a>

#### engine.getSceneManager() ⇒ <code>SceneManager</code>
**Kind**: instance method of <code>[Engine](#exp_module_j2d--Engine)</code>  
<a name="module_j2d--Engine+getViewportManager"></a>

#### engine.getViewportManager() ⇒ <code>ViewportManager</code>
**Kind**: instance method of <code>[Engine](#exp_module_j2d--Engine)</code>  
<a name="module_j2d--Engine+scene"></a>

#### engine.scene : <code>SceneManager</code>
**Kind**: instance property of <code>[Engine](#exp_module_j2d--Engine)</code>  
<a name="module_j2d--Engine+start"></a>

#### engine.start()
+GameEngine

**Kind**: instance method of <code>[Engine](#exp_module_j2d--Engine)</code>  
<a name="module_j2d--Engine.util"></a>

#### Engine.util
Utils

**Kind**: static property of <code>[Engine](#exp_module_j2d--Engine)</code>  
<a name="module_j2d--Engine.util.disableSmoothing"></a>

##### util.disableSmoothing(context)
**Kind**: static method of <code>[util](#module_j2d--Engine.util)</code>  

| Param | Type |
| --- | --- |
| context | <code>CanvasRenderingContext2D</code> | 


## License

BSD. © 2015-2016 Dimitriy Kalugin, Zlib. © 2015-2016 Нагель Петр

