<img src="https://github.com/fsggs/j2d/blob/0.2.0-dev/src/img/logo.png?raw=true" align="left" width="80"/>
<h1 align="left">j2D <a href="https://www.versioneye.com/user/projects/56afa5f63d82b9003761dfc8">
    <img src="https://www.versioneye.com/user/projects/56afa5f63d82b9003761dfc8/badge.svg?style=flat"/></a></h1>


## API Reference

<a name="nodes/BaseNode"></a>

## *nodes/BaseNode*
BaseNode

**Kind**: global abstract class  
**Properties**

| Name | Type |
| --- | --- |
| data | <code>BaseNode.defaults</code> | 


* *[nodes/BaseNode](#nodes/BaseNode)*
    * *[new BaseNode([data])](#new_nodes/BaseNode_new)*
    * *[.export()](#nodes/BaseNode+export) ⇒ <code>BaseNode.defaults</code>*
    * *[.getOffset()](#nodes/BaseNode+getOffset) ⇒ <code>Vector2d</code>*
    * *[.getPosition()](#nodes/BaseNode+getPosition) ⇒ <code>Vector2d</code>*
    * *[.getSize()](#nodes/BaseNode+getSize) ⇒ <code>Vector2d</code>*
    * *[.import(data)](#nodes/BaseNode+import)*
    * *[.inViewport(viewport)](#nodes/BaseNode+inViewport) ⇒ <code>boolean</code>*
    * *~~[.render(context, viewport, collection, data)](#nodes/BaseNode+render) ⇒ <code>BaseNode</code>~~*
    * *[.setOffset(offset)](#nodes/BaseNode+setOffset) ⇒ <code>BaseNode</code>*
    * *[.setPosition(position)](#nodes/BaseNode+setPosition) ⇒ <code>BaseNode</code>*
    * *[.setSize(size)](#nodes/BaseNode+setSize) ⇒ <code>BaseNode</code>*

<a name="new_nodes/BaseNode_new"></a>

### *new BaseNode([data])*

| Param | Type |
| --- | --- |
| [data] | <code>BaseNode.defaults</code> &#124; <code>Object</code> | 

<a name="nodes/BaseNode+export"></a>

### *nodes/BaseNode.export() ⇒ <code>BaseNode.defaults</code>*
**Kind**: instance method of <code>[nodes/BaseNode](#nodes/BaseNode)</code>  
<a name="nodes/BaseNode+getOffset"></a>

### *nodes/BaseNode.getOffset() ⇒ <code>Vector2d</code>*
**Kind**: instance method of <code>[nodes/BaseNode](#nodes/BaseNode)</code>  
<a name="nodes/BaseNode+getPosition"></a>

### *nodes/BaseNode.getPosition() ⇒ <code>Vector2d</code>*
**Kind**: instance method of <code>[nodes/BaseNode](#nodes/BaseNode)</code>  
<a name="nodes/BaseNode+getSize"></a>

### *nodes/BaseNode.getSize() ⇒ <code>Vector2d</code>*
**Kind**: instance method of <code>[nodes/BaseNode](#nodes/BaseNode)</code>  
<a name="nodes/BaseNode+import"></a>

### *nodes/BaseNode.import(data)*
**Kind**: instance method of <code>[nodes/BaseNode](#nodes/BaseNode)</code>  

| Param | Type |
| --- | --- |
| data | <code>BaseNode.defaults</code> &#124; <code>Object</code> | 

<a name="nodes/BaseNode+inViewport"></a>

### *nodes/BaseNode.inViewport(viewport) ⇒ <code>boolean</code>*
**Kind**: instance method of <code>[nodes/BaseNode](#nodes/BaseNode)</code>  

| Param | Type |
| --- | --- |
| viewport | <code>Object</code> | 

<a name="nodes/BaseNode+render"></a>

### *~~nodes/BaseNode.render(context, viewport, collection, data) ⇒ <code>BaseNode</code>~~*
***Deprecated***

Must be override this in child!

**Kind**: instance method of <code>[nodes/BaseNode](#nodes/BaseNode)</code>  
**Overridable**:   

| Param | Type |
| --- | --- |
| context | <code>CanvasRenderingContext2D</code> | 
| viewport | <code>Object</code> | 
| collection | <code>CollectionNode</code> | 
| data | <code>object</code> | 

<a name="nodes/BaseNode+setOffset"></a>

### *nodes/BaseNode.setOffset(offset) ⇒ <code>BaseNode</code>*
**Kind**: instance method of <code>[nodes/BaseNode](#nodes/BaseNode)</code>  

| Param | Type |
| --- | --- |
| offset | <code>Vector2d</code> &#124; <code>BaseNode</code> | 

<a name="nodes/BaseNode+setPosition"></a>

### *nodes/BaseNode.setPosition(position) ⇒ <code>BaseNode</code>*
**Kind**: instance method of <code>[nodes/BaseNode](#nodes/BaseNode)</code>  

| Param | Type |
| --- | --- |
| position | <code>Vector2d</code> &#124; <code>BaseNode</code> | 

<a name="nodes/BaseNode+setSize"></a>

### *nodes/BaseNode.setSize(size) ⇒ <code>BaseNode</code>*
**Kind**: instance method of <code>[nodes/BaseNode](#nodes/BaseNode)</code>  

| Param | Type |
| --- | --- |
| size | <code>Vector2d</code> &#124; <code>BaseNode</code> | 


## License

BSD. © 2015-2016 Dimitriy Kalugin, Zlib. © 2015-2016 Нагель Петр

