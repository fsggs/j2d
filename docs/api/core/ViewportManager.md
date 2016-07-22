<img src="https://github.com/fsggs/j2d/blob/0.2.0-dev/src/img/logo.png?raw=true" align="left" width="80"/>
<h1 align="left">j2D <a href="https://www.versioneye.com/user/projects/56afa5f63d82b9003761dfc8">
    <img src="https://www.versioneye.com/user/projects/56afa5f63d82b9003761dfc8/badge.svg?style=flat"/></a></h1>


## API Reference

<a name="core/ViewportManager"></a>

## core/ViewportManager
ViewportManager

**Kind**: global class  
**Properties**

| Name | Type |
| --- | --- |
| cameras | <code>ArrayMap.&lt;CameraNode&gt;</code> &#124; <code>Array.&lt;CameraNode&gt;</code> | 
| camera | <code>string</code> | 
| screen | <code>Object</code> | 
| init | <code>boolean</code> | 
| data | <code>Object</code> | 


* [core/ViewportManager](#core/ViewportManager)
    * [.addCamera(key, node)](#core/ViewportManager+addCamera) ⇒ <code>ViewportManager</code>
    * [.camera](#core/ViewportManager+camera) : <code>string</code>
    * [.cameras](#core/ViewportManager+cameras) : <code>ArrayMap.&lt;CameraNode&gt;</code> &#124; <code>Array.&lt;CameraNode&gt;</code>
    * [.getViewport()](#core/ViewportManager+getViewport) ⇒ <code>Object</code>
    * [.removeCamera(key)](#core/ViewportManager+removeCamera) ⇒ <code>ViewportManager</code>
    * [.screen](#core/ViewportManager+screen) : <code>Object</code>
    * [.setDefaultViewport(viewport)](#core/ViewportManager+setDefaultViewport) ⇒ <code>ViewportManager</code>
    * [.setOffset(data)](#core/ViewportManager+setOffset) ⇒ <code>ViewportManager</code>
    * [.setScreen(data)](#core/ViewportManager+setScreen) ⇒ <code>ViewportManager</code>
    * ~~[.setViewport([offset], [size])](#core/ViewportManager+setViewport) ⇒ <code>ViewportManager</code>~~
    * [.updateViewport(key)](#core/ViewportManager+updateViewport) ⇒ <code>ViewportManager</code>

<a name="core/ViewportManager+addCamera"></a>

### core/ViewportManager.addCamera(key, node) ⇒ <code>ViewportManager</code>
**Kind**: instance method of <code>[core/ViewportManager](#core/ViewportManager)</code>  

| Param | Type |
| --- | --- |
| key | <code>string</code> | 
| node | <code>CameraNode</code> | 

<a name="core/ViewportManager+camera"></a>

### core/ViewportManager.camera : <code>string</code>
**Kind**: instance property of <code>[core/ViewportManager](#core/ViewportManager)</code>  
<a name="core/ViewportManager+cameras"></a>

### core/ViewportManager.cameras : <code>ArrayMap.&lt;CameraNode&gt;</code> &#124; <code>Array.&lt;CameraNode&gt;</code>
**Kind**: instance property of <code>[core/ViewportManager](#core/ViewportManager)</code>  
<a name="core/ViewportManager+getViewport"></a>

### core/ViewportManager.getViewport() ⇒ <code>Object</code>
**Kind**: instance method of <code>[core/ViewportManager](#core/ViewportManager)</code>  
<a name="core/ViewportManager+removeCamera"></a>

### core/ViewportManager.removeCamera(key) ⇒ <code>ViewportManager</code>
**Kind**: instance method of <code>[core/ViewportManager](#core/ViewportManager)</code>  

| Param | Type |
| --- | --- |
| key | <code>string</code> | 

<a name="core/ViewportManager+screen"></a>

### core/ViewportManager.screen : <code>Object</code>
**Kind**: instance property of <code>[core/ViewportManager](#core/ViewportManager)</code>  
<a name="core/ViewportManager+setDefaultViewport"></a>

### core/ViewportManager.setDefaultViewport(viewport) ⇒ <code>ViewportManager</code>
**Kind**: instance method of <code>[core/ViewportManager](#core/ViewportManager)</code>  

| Param | Type |
| --- | --- |
| viewport | <code>Object</code> | 

<a name="core/ViewportManager+setOffset"></a>

### core/ViewportManager.setOffset(data) ⇒ <code>ViewportManager</code>
**Kind**: instance method of <code>[core/ViewportManager](#core/ViewportManager)</code>  

| Param | Type |
| --- | --- |
| data | <code>Object</code> &#124; <code>Array.&lt;number&gt;</code> | 

<a name="core/ViewportManager+setScreen"></a>

### core/ViewportManager.setScreen(data) ⇒ <code>ViewportManager</code>
**Kind**: instance method of <code>[core/ViewportManager](#core/ViewportManager)</code>  

| Param | Type |
| --- | --- |
| data | <code>Object</code> &#124; <code>Array.&lt;number&gt;</code> | 

<a name="core/ViewportManager+setViewport"></a>

### ~~core/ViewportManager.setViewport([offset], [size]) ⇒ <code>ViewportManager</code>~~
***Deprecated***

**Kind**: instance method of <code>[core/ViewportManager](#core/ViewportManager)</code>  

| Param | Type |
| --- | --- |
| [offset] | <code>Vector2d</code> &#124; <code>null</code> | 
| [size] | <code>Vector2d</code> &#124; <code>null</code> | 

<a name="core/ViewportManager+updateViewport"></a>

### core/ViewportManager.updateViewport(key) ⇒ <code>ViewportManager</code>
**Kind**: instance method of <code>[core/ViewportManager](#core/ViewportManager)</code>  

| Param | Type |
| --- | --- |
| key | <code>string</code> | 


## License

BSD. © 2015-2016 Dimitriy Kalugin, Zlib. © 2015-2016 Нагель Петр

