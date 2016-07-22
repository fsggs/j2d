<img src="https://github.com/fsggs/j2d/blob/0.2.0-dev/src/img/logo.png?raw=true" align="left" width="80"/>
<h1 align="left">j2D <a href="https://www.versioneye.com/user/projects/56afa5f63d82b9003761dfc8">
    <img src="https://www.versioneye.com/user/projects/56afa5f63d82b9003761dfc8/badge.svg?style=flat"/></a></h1>


## API Reference

<a name="nodes/AnimatedNode"></a>

## *nodes/AnimatedNode ⇐ <code>nodes/BaseNode</code>*
AnimatedNode

**Kind**: global abstract class  
**Extends:** <code>nodes/BaseNode</code>  
**Properties**

| Name | Type |
| --- | --- |
| data | <code>BaseNode.defaults</code> &#124; <code>AnimatedNode.defaults</code> | 


* *[nodes/AnimatedNode](#nodes/AnimatedNode) ⇐ <code>nodes/BaseNode</code>*
    * *[new AnimatedNode([data])](#new_nodes/AnimatedNode_new)*
    * *[.moveTo(position, [duration], [durationAsSpeed])](#nodes/AnimatedNode+moveTo)*
    * *[.resizeTo(size, [duration], [durationAsSpeed])](#nodes/AnimatedNode+resizeTo)*
    * *[.rotateTo(angle, [duration])](#nodes/AnimatedNode+rotateTo)*
    * *[.turn([velocity])](#nodes/AnimatedNode+turn)*

<a name="new_nodes/AnimatedNode_new"></a>

### *new AnimatedNode([data])*

| Param | Type |
| --- | --- |
| [data] | <code>BaseNode.defaults</code> &#124; <code>AnimatedNode.defaults</code> &#124; <code>Object</code> | 

<a name="nodes/AnimatedNode+moveTo"></a>

### *nodes/AnimatedNode.moveTo(position, [duration], [durationAsSpeed])*
**Kind**: instance method of <code>[nodes/AnimatedNode](#nodes/AnimatedNode)</code>  

| Param | Type |
| --- | --- |
| position | <code>Vector2d</code> &#124; <code>BaseNode</code> | 
| [duration] | <code>number</code> | 
| [durationAsSpeed] | <code>boolean</code> | 

<a name="nodes/AnimatedNode+resizeTo"></a>

### *nodes/AnimatedNode.resizeTo(size, [duration], [durationAsSpeed])*
**Kind**: instance method of <code>[nodes/AnimatedNode](#nodes/AnimatedNode)</code>  

| Param | Type |
| --- | --- |
| size | <code>Vector2d</code> &#124; <code>BaseNode</code> | 
| [duration] | <code>number</code> | 
| [durationAsSpeed] | <code>boolean</code> | 

<a name="nodes/AnimatedNode+rotateTo"></a>

### *nodes/AnimatedNode.rotateTo(angle, [duration])*
**Kind**: instance method of <code>[nodes/AnimatedNode](#nodes/AnimatedNode)</code>  

| Param | Type |
| --- | --- |
| angle | <code>number</code> &#124; <code>BaseNode</code> | 
| [duration] | <code>number</code> | 

<a name="nodes/AnimatedNode+turn"></a>

### *nodes/AnimatedNode.turn([velocity])*
**Kind**: instance method of <code>[nodes/AnimatedNode](#nodes/AnimatedNode)</code>  

| Param | Type |
| --- | --- |
| [velocity] | <code>number</code> | 


## License

BSD. © 2015-2016 Dimitriy Kalugin, Zlib. © 2015-2016 Нагель Петр

