<img src="https://github.com/fsggs/jquery.j2d/blob/0.2.0-dev/src/img/logo.png?raw=true" align="left" width="80"/>
<h1 align="left">jQuery.j2d <a href="https://www.versioneye.com/user/projects/56afa5f63d82b9003761dfc8">
    <img src="https://www.versioneye.com/user/projects/56afa5f63d82b9003761dfc8/badge.svg?style=flat"/></a></h1>


## API Reference

<a name="module_jquery.j2d"></a>

## jquery.j2d

* [jquery.j2d](#module_jquery.j2d)
    * [J2D](#exp_module_jquery.j2d--J2D) ⏏
        * [new J2D(element, data)](#new_module_jquery.j2d--J2D_new)
        * _instance_
            * [.Log](#module_jquery.j2d--J2D+Log) : <code>SystemConsole</code>
            * [.data](#module_jquery.j2d--J2D+data) : <code>J2D.defaults</code>
            * [.device](#module_jquery.j2d--J2D+device) : <code>DeviceUtil</code>
            * [.element](#module_jquery.j2d--J2D+element) : <code>Element</code> &#124; <code>jQuery</code>
            * [.getFrameManager()](#module_jquery.j2d--J2D+getFrameManager) ⇒ <code>FrameManager</code>
            * [.getGameStatesManager()](#module_jquery.j2d--J2D+getGameStatesManager) ⇒ <code>GameStatesManager</code>
            * [.getLayersManager()](#module_jquery.j2d--J2D+getLayersManager) ⇒ <code>LayersManager</code>
            * [.getSceneManager()](#module_jquery.j2d--J2D+getSceneManager) ⇒ <code>SceneManager</code>
            * [.getViewportManager()](#module_jquery.j2d--J2D+getViewportManager) ⇒ <code>ViewportManager</code>
            * [.scene](#module_jquery.j2d--J2D+scene) : <code>SceneManager</code>
            * [.start()](#module_jquery.j2d--J2D+start)
        * _static_
            * [.util](#module_jquery.j2d--J2D.util)
                * [.disableSmoothing(context)](#module_jquery.j2d--J2D.util.disableSmoothing)

<a name="exp_module_jquery.j2d--J2D"></a>

### J2D ⏏
J2D

**Kind**: Exported class  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| WebGL | <code>boolean</code> | // TODO:: To scene |
| smoothing | <code>boolean</code> | // TODO:: To scene |
| io | <code>InputManager</code> &#124; <code>null</code> |  |
| media | <code>MediaManager</code> &#124; <code>null</code> |  |
| isPlay | <code>boolean</code> |  |

<a name="new_module_jquery.j2d--J2D_new"></a>

#### new J2D(element, data)

| Param | Type |
| --- | --- |
| element | <code>Element</code> &#124; <code>jQuery</code> | 
| data | <code>J2D.defaults</code> | 

<a name="module_jquery.j2d--J2D+Log"></a>

#### j2D.Log : <code>SystemConsole</code>
**Kind**: instance property of <code>[J2D](#exp_module_jquery.j2d--J2D)</code>  
<a name="module_jquery.j2d--J2D+data"></a>

#### j2D.data : <code>J2D.defaults</code>
**Kind**: instance property of <code>[J2D](#exp_module_jquery.j2d--J2D)</code>  
<a name="module_jquery.j2d--J2D+device"></a>

#### j2D.device : <code>DeviceUtil</code>
**Kind**: instance property of <code>[J2D](#exp_module_jquery.j2d--J2D)</code>  
<a name="module_jquery.j2d--J2D+element"></a>

#### j2D.element : <code>Element</code> &#124; <code>jQuery</code>
**Kind**: instance property of <code>[J2D](#exp_module_jquery.j2d--J2D)</code>  
<a name="module_jquery.j2d--J2D+getFrameManager"></a>

#### j2D.getFrameManager() ⇒ <code>FrameManager</code>
**Kind**: instance method of <code>[J2D](#exp_module_jquery.j2d--J2D)</code>  
<a name="module_jquery.j2d--J2D+getGameStatesManager"></a>

#### j2D.getGameStatesManager() ⇒ <code>GameStatesManager</code>
**Kind**: instance method of <code>[J2D](#exp_module_jquery.j2d--J2D)</code>  
<a name="module_jquery.j2d--J2D+getLayersManager"></a>

#### j2D.getLayersManager() ⇒ <code>LayersManager</code>
**Kind**: instance method of <code>[J2D](#exp_module_jquery.j2d--J2D)</code>  
<a name="module_jquery.j2d--J2D+getSceneManager"></a>

#### j2D.getSceneManager() ⇒ <code>SceneManager</code>
**Kind**: instance method of <code>[J2D](#exp_module_jquery.j2d--J2D)</code>  
<a name="module_jquery.j2d--J2D+getViewportManager"></a>

#### j2D.getViewportManager() ⇒ <code>ViewportManager</code>
**Kind**: instance method of <code>[J2D](#exp_module_jquery.j2d--J2D)</code>  
<a name="module_jquery.j2d--J2D+scene"></a>

#### j2D.scene : <code>SceneManager</code>
**Kind**: instance property of <code>[J2D](#exp_module_jquery.j2d--J2D)</code>  
<a name="module_jquery.j2d--J2D+start"></a>

#### j2D.start()
+GameEngine

**Kind**: instance method of <code>[J2D](#exp_module_jquery.j2d--J2D)</code>  
<a name="module_jquery.j2d--J2D.util"></a>

#### J2D.util
Utils

**Kind**: static property of <code>[J2D](#exp_module_jquery.j2d--J2D)</code>  
<a name="module_jquery.j2d--J2D.util.disableSmoothing"></a>

##### util.disableSmoothing(context)
**Kind**: static method of <code>[util](#module_jquery.j2d--J2D.util)</code>  

| Param | Type |
| --- | --- |
| context | <code>CanvasRenderingContext2D</code> | 


## License

BSD. © 2015 Dimitriy Kalugin, Zlib. © 2015 Нагель Петр

