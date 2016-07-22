<img src="https://github.com/fsggs/j2d/blob/0.2.0-dev/src/img/logo.png?raw=true" align="left" width="80"/>
<h1 align="left">j2D <a href="https://www.versioneye.com/user/projects/56afa5f63d82b9003761dfc8">
    <img src="https://www.versioneye.com/user/projects/56afa5f63d82b9003761dfc8/badge.svg?style=flat"/></a></h1>


## API Reference

<a name="nodes/CollectionNode"></a>

## nodes/CollectionNode ⇐ <code>nodes/AnimatedNode</code>
CollectionNode

**Kind**: global class  
**Extends:** <code>nodes/AnimatedNode</code>  
**Properties**

| Name | Type |
| --- | --- |
| data | <code>BaseNode.defaults</code> &#124; <code>AnimatedNode.defaults</code> &#124; <code>CollectionNode.defaults</code> | 


* [nodes/CollectionNode](#nodes/CollectionNode) ⇐ <code>nodes/AnimatedNode</code>
    * [new CollectionNode([data])](#new_nodes/CollectionNode_new)
    * [.add(node, key)](#nodes/CollectionNode+add) ⇒ <code>CollectionNode</code>
    * [.flush()](#nodes/CollectionNode+flush) ⇒ <code>CollectionNode</code>
    * [.get(key)](#nodes/CollectionNode+get) ⇒ <code>BaseNode</code> &#124; <code>CollectionNode</code> &#124; <code>boolean</code>
    * [.has(key)](#nodes/CollectionNode+has) ⇒ <code>boolean</code>
    * [.remove(node, key)](#nodes/CollectionNode+remove) ⇒ <code>CollectionNode</code>
    * [.render(context, viewport, collection, data)](#nodes/CollectionNode+render) ⇒ <code>CollectionNode</code>

<a name="new_nodes/CollectionNode_new"></a>

### new CollectionNode([data])

| Param | Type |
| --- | --- |
| [data] | <code>BaseNode.defaults</code> &#124; <code>AnimatedNode.defaults</code> &#124; <code>CollectionNode.defaults</code> &#124; <code>Object</code> | 

<a name="nodes/CollectionNode+add"></a>

### nodes/CollectionNode.add(node, key) ⇒ <code>CollectionNode</code>
**Kind**: instance method of <code>[nodes/CollectionNode](#nodes/CollectionNode)</code>  

| Param | Type |
| --- | --- |
| node | <code>BaseNode</code> &#124; <code>CollectionNode</code> | 
| key | <code>string</code> | 

<a name="nodes/CollectionNode+flush"></a>

### nodes/CollectionNode.flush() ⇒ <code>CollectionNode</code>
**Kind**: instance method of <code>[nodes/CollectionNode](#nodes/CollectionNode)</code>  
<a name="nodes/CollectionNode+get"></a>

### nodes/CollectionNode.get(key) ⇒ <code>BaseNode</code> &#124; <code>CollectionNode</code> &#124; <code>boolean</code>
**Kind**: instance method of <code>[nodes/CollectionNode](#nodes/CollectionNode)</code>  

| Param | Type |
| --- | --- |
| key | <code>string</code> | 

<a name="nodes/CollectionNode+has"></a>

### nodes/CollectionNode.has(key) ⇒ <code>boolean</code>
**Kind**: instance method of <code>[nodes/CollectionNode](#nodes/CollectionNode)</code>  

| Param | Type |
| --- | --- |
| key | <code>string</code> | 

<a name="nodes/CollectionNode+remove"></a>

### nodes/CollectionNode.remove(node, key) ⇒ <code>CollectionNode</code>
**Kind**: instance method of <code>[nodes/CollectionNode](#nodes/CollectionNode)</code>  

| Param | Type |
| --- | --- |
| node | <code>BaseNode</code> &#124; <code>CollectionNode</code> &#124; <code>null</code> | 
| key | <code>string</code> | 

<a name="nodes/CollectionNode+render"></a>

### nodes/CollectionNode.render(context, viewport, collection, data) ⇒ <code>CollectionNode</code>
**Kind**: instance method of <code>[nodes/CollectionNode](#nodes/CollectionNode)</code>  

| Param | Type |
| --- | --- |
| context | <code>CanvasRenderingContext2D</code> | 
| viewport | <code>Object</code> | 
| collection | <code>CollectionNode</code> | 
| data | <code>object</code> | 


## License

BSD. © 2015-2016 Dimitriy Kalugin, Zlib. © 2015-2016 Нагель Петр

