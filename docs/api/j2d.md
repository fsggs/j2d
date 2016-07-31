<img src="https://github.com/fsggs/j2d/blob/0.2.0-dev/src/img/logo.png?raw=true" align="left" width="80"/>
<h1 align="left">j2D <a href="https://www.versioneye.com/user/projects/56afa5f63d82b9003761dfc8">
    <img src="https://www.versioneye.com/user/projects/56afa5f63d82b9003761dfc8/badge.svg?style=flat"/></a></h1>


## API Reference

<a name="module_j2d"></a>

## j2d

* [j2d](#module_j2d)
    * [EngineJ2D](#exp_module_j2d--EngineJ2D) ⏏
        * [new EngineJ2D(element, data)](#new_module_j2d--EngineJ2D_new)
        * _instance_
            * [.Log](#module_j2d--EngineJ2D+Log) : <code>SystemConsole</code>
            * [.data](#module_j2d--EngineJ2D+data) : <code>EngineJ2D.defaults</code>
            * [.device](#module_j2d--EngineJ2D+device) : <code>DeviceUtil</code>
            * [.element](#module_j2d--EngineJ2D+element) : <code>Element</code> &#124; <code>jQuery</code>
            * [.getFrameManager()](#module_j2d--EngineJ2D+getFrameManager) ⇒ <code>FrameManager</code>
            * [.getGameStatesManager()](#module_j2d--EngineJ2D+getGameStatesManager) ⇒ <code>GameStatesManager</code>
            * [.getLayersManager()](#module_j2d--EngineJ2D+getLayersManager) ⇒ <code>LayersManager</code>
            * [.getSceneManager()](#module_j2d--EngineJ2D+getSceneManager) ⇒ <code>SceneManager</code>
            * [.getViewportManager()](#module_j2d--EngineJ2D+getViewportManager) ⇒ <code>ViewportManager</code>
        * _static_
            * [.initEngine(selected, options)](#module_j2d--EngineJ2D.initEngine) ⇒ <code>EngineJ2D</code> &#124; <code>Array.&lt;EngineJ2D&gt;</code> &#124; <code>Array.&lt;EngineJ2D&gt;</code>
        * _instance_
            * [.scene](#module_j2d--EngineJ2D+scene) : <code>SceneManager</code>
        * _static_
            * [.stack](#module_j2d--EngineJ2D.stack) : <code>Array.&lt;EngineJ2D&gt;</code> &#124; <code>ArrayMap.&lt;EngineJ2D&gt;</code>
        * _instance_
            * [.start()](#module_j2d--EngineJ2D+start)
        * _static_
            * [.util](#module_j2d--EngineJ2D.util)
                * [.disableSmoothing(context)](#module_j2d--EngineJ2D.util.disableSmoothing)

<a name="exp_module_j2d--EngineJ2D"></a>

### EngineJ2D ⏏
EngineJ2D

**Kind**: Exported class  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| WebGL | <code>boolean</code> | // TODO:: To scene |
| smoothing | <code>boolean</code> | // TODO:: To scene |
| io | <code>InputManager</code> &#124; <code>null</code> |  |
| media | <code>MediaManager</code> &#124; <code>null</code> |  |
| isPlay | <code>boolean</code> |  |

<a name="new_module_j2d--EngineJ2D_new"></a>

#### new EngineJ2D(element, data)

| Param | Type |
| --- | --- |
| element | <code>Element</code> &#124; <code>jQuery</code> | 
| data | <code>EngineJ2D.defaults</code> | 

<a name="module_j2d--EngineJ2D+Log"></a>

#### engineJ2D.Log : <code>SystemConsole</code>
**Kind**: instance property of <code>[EngineJ2D](#exp_module_j2d--EngineJ2D)</code>  
<a name="module_j2d--EngineJ2D+data"></a>

#### engineJ2D.data : <code>EngineJ2D.defaults</code>
**Kind**: instance property of <code>[EngineJ2D](#exp_module_j2d--EngineJ2D)</code>  
<a name="module_j2d--EngineJ2D+device"></a>

#### engineJ2D.device : <code>DeviceUtil</code>
**Kind**: instance property of <code>[EngineJ2D](#exp_module_j2d--EngineJ2D)</code>  
<a name="module_j2d--EngineJ2D+element"></a>

#### engineJ2D.element : <code>Element</code> &#124; <code>jQuery</code>
**Kind**: instance property of <code>[EngineJ2D](#exp_module_j2d--EngineJ2D)</code>  
<a name="module_j2d--EngineJ2D+getFrameManager"></a>

#### engineJ2D.getFrameManager() ⇒ <code>FrameManager</code>
**Kind**: instance method of <code>[EngineJ2D](#exp_module_j2d--EngineJ2D)</code>  
<a name="module_j2d--EngineJ2D+getGameStatesManager"></a>

#### engineJ2D.getGameStatesManager() ⇒ <code>GameStatesManager</code>
**Kind**: instance method of <code>[EngineJ2D](#exp_module_j2d--EngineJ2D)</code>  
<a name="module_j2d--EngineJ2D+getLayersManager"></a>

#### engineJ2D.getLayersManager() ⇒ <code>LayersManager</code>
**Kind**: instance method of <code>[EngineJ2D](#exp_module_j2d--EngineJ2D)</code>  
<a name="module_j2d--EngineJ2D+getSceneManager"></a>

#### engineJ2D.getSceneManager() ⇒ <code>SceneManager</code>
**Kind**: instance method of <code>[EngineJ2D](#exp_module_j2d--EngineJ2D)</code>  
<a name="module_j2d--EngineJ2D+getViewportManager"></a>

#### engineJ2D.getViewportManager() ⇒ <code>ViewportManager</code>
**Kind**: instance method of <code>[EngineJ2D](#exp_module_j2d--EngineJ2D)</code>  
<a name="module_j2d--EngineJ2D.initEngine"></a>

#### EngineJ2D.initEngine(selected, options) ⇒ <code>EngineJ2D</code> &#124; <code>Array.&lt;EngineJ2D&gt;</code> &#124; <code>Array.&lt;EngineJ2D&gt;</code>
**Kind**: static method of <code>[EngineJ2D](#exp_module_j2d--EngineJ2D)</code>  

| Param | Type |
| --- | --- |
| selected | <code>string</code> &#124; <code>jQuery</code> | 
| options | <code>EngineJ2D.defaults</code> &#124; <code>Object</code> | 

<a name="module_j2d--EngineJ2D+scene"></a>

#### engineJ2D.scene : <code>SceneManager</code>
**Kind**: instance property of <code>[EngineJ2D](#exp_module_j2d--EngineJ2D)</code>  
<a name="module_j2d--EngineJ2D.stack"></a>

#### EngineJ2D.stack : <code>Array.&lt;EngineJ2D&gt;</code> &#124; <code>ArrayMap.&lt;EngineJ2D&gt;</code>
**Kind**: static property of <code>[EngineJ2D](#exp_module_j2d--EngineJ2D)</code>  
<a name="module_j2d--EngineJ2D+start"></a>

#### engineJ2D.start()
+GameEngine

**Kind**: instance method of <code>[EngineJ2D](#exp_module_j2d--EngineJ2D)</code>  
<a name="module_j2d--EngineJ2D.util"></a>

#### EngineJ2D.util
Utils

**Kind**: static property of <code>[EngineJ2D](#exp_module_j2d--EngineJ2D)</code>  
<a name="module_j2d--EngineJ2D.util.disableSmoothing"></a>

##### util.disableSmoothing(context)
**Kind**: static method of <code>[util](#module_j2d--EngineJ2D.util)</code>  

| Param | Type |
| --- | --- |
| context | <code>CanvasRenderingContext2D</code> | 


## License

BSD. © 2015-2016 Dimitriy Kalugin, Zlib. © 2015-2016 Нагель Петр

