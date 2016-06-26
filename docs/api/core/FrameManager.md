<img src="https://github.com/fsggs/jquery.j2d/blob/0.2.0-dev/src/img/logo.png?raw=true" align="left" width="80"/>
<h1 align="left">jQuery.j2d <a href="https://www.versioneye.com/user/projects/56afa5f63d82b9003761dfc8">
    <img src="https://www.versioneye.com/user/projects/56afa5f63d82b9003761dfc8/badge.svg?style=flat"/></a></h1>


## API Reference

<a name="core/FrameManager"></a>

## core/FrameManager
FrameManager

**Kind**: global class  

* [core/FrameManager](#core/FrameManager)
    * _static_
        * [.Init()](#core/FrameManager.Init) ⇒ <code>FrameManager</code>
    * _instance_
        * [.pulse()](#core/FrameManager+pulse) ⇒ <code>FrameManager</code>
        * [.runMainLoop(timestamp, [frameManager])](#core/FrameManager+runMainLoop)
        * [.setDefaultFrameLimit(frameLimit)](#core/FrameManager+setDefaultFrameLimit) ⇒ <code>FrameManager</code>
        * [.start(name, engine, [params])](#core/FrameManager+start) ⇒ <code>FrameManager</code>
        * [.stop(name)](#core/FrameManager+stop) ⇒ <code>FrameManager</code>

<a name="core/FrameManager.Init"></a>

### core/FrameManager.Init() ⇒ <code>FrameManager</code>
**Kind**: static method of <code>[core/FrameManager](#core/FrameManager)</code>  
**Singleton**:   
<a name="core/FrameManager+pulse"></a>

### core/FrameManager.pulse() ⇒ <code>FrameManager</code>
**Kind**: instance method of <code>[core/FrameManager](#core/FrameManager)</code>  
<a name="core/FrameManager+runMainLoop"></a>

### core/FrameManager.runMainLoop(timestamp, [frameManager])
**Kind**: instance method of <code>[core/FrameManager](#core/FrameManager)</code>  

| Param | Type |
| --- | --- |
| timestamp | <code>number</code> | 
| [frameManager] | <code>FrameManager</code> | 

<a name="core/FrameManager+setDefaultFrameLimit"></a>

### core/FrameManager.setDefaultFrameLimit(frameLimit) ⇒ <code>FrameManager</code>
**Kind**: instance method of <code>[core/FrameManager](#core/FrameManager)</code>  

| Param | Type |
| --- | --- |
| frameLimit | <code>number</code> | 

<a name="core/FrameManager+start"></a>

### core/FrameManager.start(name, engine, [params]) ⇒ <code>FrameManager</code>
**Kind**: instance method of <code>[core/FrameManager](#core/FrameManager)</code>  

| Param | Type |
| --- | --- |
| name | <code>string</code> | 
| engine | <code>BaseState</code> | 
| [params] | <code>Object</code> | 

<a name="core/FrameManager+stop"></a>

### core/FrameManager.stop(name) ⇒ <code>FrameManager</code>
**Kind**: instance method of <code>[core/FrameManager](#core/FrameManager)</code>  

| Param | Type |
| --- | --- |
| name | <code>string</code> | 


## License

BSD. © 2015 Dimitriy Kalugin, Zlib. © 2015 Нагель Петр

