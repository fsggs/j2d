<img src="https://github.com/fsggs/j2d/blob/0.2.0-dev/src/img/logo.png?raw=true" align="left" width="80"/>
<h1 align="left">j2D <a href="https://www.versioneye.com/user/projects/56afa5f63d82b9003761dfc8">
    <img src="https://www.versioneye.com/user/projects/56afa5f63d82b9003761dfc8/badge.svg?style=flat"/></a></h1>


## API Reference

<a name="core/LayersManager"></a>

## core/LayersManager
LayersManager

**Kind**: global class  

* [core/LayersManager](#core/LayersManager)
    * [.addLayer(name, [zIndex], [node])](#core/LayersManager+addLayer) ⇒ <code>LayersManager</code>
    * [.getLayer(name)](#core/LayersManager+getLayer) ⇒ <code>CollectionNode</code> &#124; <code>null</code>
    * [.globalCollection](#core/LayersManager+globalCollection) : <code>CollectionNode</code>
    * [.index](#core/LayersManager+index) : <code>number</code>
    * [.layers](#core/LayersManager+layers) : <code>Array.&lt;CollectionNode&gt;</code> &#124; <code>Array.&lt;CollectionNode&gt;</code>
    * [.removeLayer(name)](#core/LayersManager+removeLayer) ⇒ <code>LayersManager</code>
    * [.setZIndex(name, zIndex)](#core/LayersManager+setZIndex) ⇒ <code>LayersManager</code>

<a name="core/LayersManager+addLayer"></a>

### core/LayersManager.addLayer(name, [zIndex], [node]) ⇒ <code>LayersManager</code>
**Kind**: instance method of <code>[core/LayersManager](#core/LayersManager)</code>  

| Param | Type |
| --- | --- |
| name | <code>string</code> | 
| [zIndex] | <code>number</code> | 
| [node] | <code>CollectionNode</code> &#124; <code>undefined</code> | 

<a name="core/LayersManager+getLayer"></a>

### core/LayersManager.getLayer(name) ⇒ <code>CollectionNode</code> &#124; <code>null</code>
**Kind**: instance method of <code>[core/LayersManager](#core/LayersManager)</code>  

| Param | Type |
| --- | --- |
| name | <code>string</code> | 

<a name="core/LayersManager+globalCollection"></a>

### core/LayersManager.globalCollection : <code>CollectionNode</code>
**Kind**: instance property of <code>[core/LayersManager](#core/LayersManager)</code>  
<a name="core/LayersManager+index"></a>

### core/LayersManager.index : <code>number</code>
**Kind**: instance property of <code>[core/LayersManager](#core/LayersManager)</code>  
<a name="core/LayersManager+layers"></a>

### core/LayersManager.layers : <code>Array.&lt;CollectionNode&gt;</code> &#124; <code>Array.&lt;CollectionNode&gt;</code>
**Kind**: instance property of <code>[core/LayersManager](#core/LayersManager)</code>  
<a name="core/LayersManager+removeLayer"></a>

### core/LayersManager.removeLayer(name) ⇒ <code>LayersManager</code>
**Kind**: instance method of <code>[core/LayersManager](#core/LayersManager)</code>  

| Param | Type |
| --- | --- |
| name | <code>string</code> | 

<a name="core/LayersManager+setZIndex"></a>

### core/LayersManager.setZIndex(name, zIndex) ⇒ <code>LayersManager</code>
**Kind**: instance method of <code>[core/LayersManager](#core/LayersManager)</code>  

| Param | Type |
| --- | --- |
| name | <code>string</code> | 
| zIndex | <code>number</code> | 


## License

BSD. © 2015-2016 Dimitriy Kalugin, Zlib. © 2015-2016 Нагель Петр

