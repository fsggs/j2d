<img src="https://github.com/fsggs/jquery.j2d/blob/0.2.0-dev/src/img/logo.png?raw=true" align="left" width="80"/>
<h1 align="left">jQuery.j2d <a href="https://www.versioneye.com/user/projects/56afa5f63d82b9003761dfc8">
    <img src="https://www.versioneye.com/user/projects/56afa5f63d82b9003761dfc8/badge.svg?style=flat"/></a></h1>


## API Reference

<a name="nodes/CameraNode"></a>

## nodes/CameraNode ⇐ <code>nodes/AnimatedNode</code>
CameraNode

**Kind**: global class  
**Extends:** <code>nodes/AnimatedNode</code>  
**Properties**

| Name | Type |
| --- | --- |
| data | <code>BaseNode.defaults</code> &#124; <code>AnimatedNode.defaults</code> &#124; <code>CameraNode.defaults</code> | 


* [nodes/CameraNode](#nodes/CameraNode) ⇐ <code>nodes/AnimatedNode</code>
    * [new CameraNode([data])](#new_nodes/CameraNode_new)
    * [.getCameraViewport(screen, calculate)](#nodes/CameraNode+getCameraViewport) ⇒ <code>Object</code>
    * [.render(context, viewport, collection, data)](#nodes/CameraNode+render) ⇒ <code>CameraNode</code>

<a name="new_nodes/CameraNode_new"></a>

### new CameraNode([data])

| Param | Type |
| --- | --- |
| [data] | <code>BaseNode.defaults</code> &#124; <code>AnimatedNode.defaults</code> &#124; <code>CameraNode.defaults</code> &#124; <code>Object</code> | 

<a name="nodes/CameraNode+getCameraViewport"></a>

### nodes/CameraNode.getCameraViewport(screen, calculate) ⇒ <code>Object</code>
**Kind**: instance method of <code>[nodes/CameraNode](#nodes/CameraNode)</code>  

| Param | Type |
| --- | --- |
| screen | <code>Object</code> | 
| calculate | <code>function</code> &#124; <code>callback</code> | 

<a name="nodes/CameraNode+render"></a>

### nodes/CameraNode.render(context, viewport, collection, data) ⇒ <code>CameraNode</code>
**Kind**: instance method of <code>[nodes/CameraNode](#nodes/CameraNode)</code>  

| Param | Type |
| --- | --- |
| context | <code>CanvasRenderingContext2D</code> | 
| viewport | <code>Object</code> | 
| collection | <code>CollectionNode</code> | 
| data | <code>object</code> | 


## License

BSD. © 2015 Dimitriy Kalugin, Zlib. © 2015 Нагель Петр

