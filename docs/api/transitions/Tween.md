<img src="https://github.com/fsggs/jquery.j2d/blob/0.2.0-dev/src/img/logo.png?raw=true" align="left" width="80"/>
<h1 align="left">jQuery.j2d <a href="https://www.versioneye.com/user/projects/56afa5f63d82b9003761dfc8">
    <img src="https://www.versioneye.com/user/projects/56afa5f63d82b9003761dfc8/badge.svg?style=flat"/></a></h1>


## API Reference

<a name="transitions/Tween"></a>

## transitions/Tween
Tween

**Kind**: global class  
**Properties**

| Name | Type |
| --- | --- |
| data | <code>Tween.defaults</code> | 


* [transitions/Tween](#transitions/Tween)
    * [new Tween(tweenNode, [data])](#new_transitions/Tween_new)
    * _static_
        * [.add(tween)](#transitions/Tween.add) ⇒ <code>Tween</code>
    * _instance_
        * [.delay(delay)](#transitions/Tween+delay) ⇒ <code>Tween</code>
        * [.delayAll(delay)](#transitions/Tween+delayAll) ⇒ <code>Tween</code>
        * [.flush(event)](#transitions/Tween+flush) ⇒ <code>boolean</code>
    * _static_
        * [.flush()](#transitions/Tween.flush) ⇒ <code>void</code>
        * [.get(index)](#transitions/Tween.get) ⇒ <code>Array.&lt;Tween&gt;</code> &#124; <code>Tween</code>
    * _instance_
        * [.getStateTimeDuration([position], [withPrevious])](#transitions/Tween+getStateTimeDuration) ⇒ <code>number</code>
        * [.off(event, callback)](#transitions/Tween+off) ⇒ <code>boolean</code>
        * [.on(event, callback)](#transitions/Tween+on) ⇒ <code>boolean</code>
        * [.once(event, callback)](#transitions/Tween+once) ⇒ <code>boolean</code>
    * _static_
        * [.remove(tween)](#transitions/Tween.remove) ⇒ <code>Tween</code>
    * _instance_
        * [.repeat([count])](#transitions/Tween+repeat) ⇒ <code>Tween</code>
        * [.repeatAll([count])](#transitions/Tween+repeatAll) ⇒ <code>Tween</code>
        * [.reverse([count])](#transitions/Tween+reverse) ⇒ <code>Tween</code>
        * [.reverseAll([count])](#transitions/Tween+reverseAll) ⇒ <code>Tween</code>
        * [.start(time)](#transitions/Tween+start) ⇒ <code>Tween</code>
        * [.stop()](#transitions/Tween+stop) ⇒ <code>Tween</code>
        * [.stopChainedTweens()](#transitions/Tween+stopChainedTweens) ⇒ <code>Tween</code>
        * [.to(properties, [data])](#transitions/Tween+to) ⇒ <code>Tween</code>
        * [.trigger(event, data)](#transitions/Tween+trigger) ⇒ <code>boolean</code>
        * [.update(time)](#transitions/Tween+update) ⇒ <code>boolean</code>
    * _static_
        * [.update(time)](#transitions/Tween.update) ⇒ <code>boolean</code>
    * _instance_
        * [.yoyo([count])](#transitions/Tween+yoyo) ⇒ <code>Tween</code>
        * [.yoyoAll([count])](#transitions/Tween+yoyoAll) ⇒ <code>Tween</code>

<a name="new_transitions/Tween_new"></a>

### new Tween(tweenNode, [data])

| Param | Type |
| --- | --- |
| tweenNode | <code>BaseNode</code> &#124; <code>Object</code> | 
| [data] | <code>Tween.defaults</code> &#124; <code>Object</code> | 

<a name="transitions/Tween.add"></a>

### transitions/Tween.add(tween) ⇒ <code>Tween</code>
**Kind**: static method of <code>[transitions/Tween](#transitions/Tween)</code>  

| Param | Type |
| --- | --- |
| tween | <code>Tween</code> | 

<a name="transitions/Tween+delay"></a>

### transitions/Tween.delay(delay) ⇒ <code>Tween</code>
**Kind**: instance method of <code>[transitions/Tween](#transitions/Tween)</code>  

| Param | Type |
| --- | --- |
| delay | <code>number</code> | 

<a name="transitions/Tween+delayAll"></a>

### transitions/Tween.delayAll(delay) ⇒ <code>Tween</code>
**Kind**: instance method of <code>[transitions/Tween](#transitions/Tween)</code>  

| Param | Type |
| --- | --- |
| delay | <code>number</code> | 

<a name="transitions/Tween+flush"></a>

### transitions/Tween.flush(event) ⇒ <code>boolean</code>
**Kind**: instance method of <code>[transitions/Tween](#transitions/Tween)</code>  

| Param | Type |
| --- | --- |
| event | <code>string</code> | 

<a name="transitions/Tween.flush"></a>

### transitions/Tween.flush() ⇒ <code>void</code>
**Kind**: static method of <code>[transitions/Tween](#transitions/Tween)</code>  
<a name="transitions/Tween.get"></a>

### transitions/Tween.get(index) ⇒ <code>Array.&lt;Tween&gt;</code> &#124; <code>Tween</code>
**Kind**: static method of <code>[transitions/Tween](#transitions/Tween)</code>  

| Param | Type |
| --- | --- |
| index | <code>number</code> | 

<a name="transitions/Tween+getStateTimeDuration"></a>

### transitions/Tween.getStateTimeDuration([position], [withPrevious]) ⇒ <code>number</code>
**Kind**: instance method of <code>[transitions/Tween](#transitions/Tween)</code>  

| Param | Type |
| --- | --- |
| [position] | <code>number</code> | 
| [withPrevious] | <code>boolean</code> | 

<a name="transitions/Tween+off"></a>

### transitions/Tween.off(event, callback) ⇒ <code>boolean</code>
**Kind**: instance method of <code>[transitions/Tween](#transitions/Tween)</code>  

| Param | Type |
| --- | --- |
| event | <code>string</code> | 
| callback | <code>function</code> | 

<a name="transitions/Tween+on"></a>

### transitions/Tween.on(event, callback) ⇒ <code>boolean</code>
**Kind**: instance method of <code>[transitions/Tween](#transitions/Tween)</code>  

| Param | Type |
| --- | --- |
| event | <code>string</code> | 
| callback | <code>function</code> | 

<a name="transitions/Tween+once"></a>

### transitions/Tween.once(event, callback) ⇒ <code>boolean</code>
**Kind**: instance method of <code>[transitions/Tween](#transitions/Tween)</code>  

| Param | Type |
| --- | --- |
| event | <code>string</code> | 
| callback | <code>function</code> | 

<a name="transitions/Tween.remove"></a>

### transitions/Tween.remove(tween) ⇒ <code>Tween</code>
**Kind**: static method of <code>[transitions/Tween](#transitions/Tween)</code>  

| Param | Type |
| --- | --- |
| tween | <code>Tween</code> | 

<a name="transitions/Tween+repeat"></a>

### transitions/Tween.repeat([count]) ⇒ <code>Tween</code>
**Kind**: instance method of <code>[transitions/Tween](#transitions/Tween)</code>  

| Param | Type |
| --- | --- |
| [count] | <code>number</code> | 

<a name="transitions/Tween+repeatAll"></a>

### transitions/Tween.repeatAll([count]) ⇒ <code>Tween</code>
**Kind**: instance method of <code>[transitions/Tween](#transitions/Tween)</code>  

| Param | Type |
| --- | --- |
| [count] | <code>number</code> | 

<a name="transitions/Tween+reverse"></a>

### transitions/Tween.reverse([count]) ⇒ <code>Tween</code>
**Kind**: instance method of <code>[transitions/Tween](#transitions/Tween)</code>  

| Param | Type |
| --- | --- |
| [count] | <code>number</code> | 

<a name="transitions/Tween+reverseAll"></a>

### transitions/Tween.reverseAll([count]) ⇒ <code>Tween</code>
**Kind**: instance method of <code>[transitions/Tween](#transitions/Tween)</code>  

| Param | Type |
| --- | --- |
| [count] | <code>number</code> | 

<a name="transitions/Tween+start"></a>

### transitions/Tween.start(time) ⇒ <code>Tween</code>
**Kind**: instance method of <code>[transitions/Tween](#transitions/Tween)</code>  

| Param | Type |
| --- | --- |
| time | <code>number</code> | 

<a name="transitions/Tween+stop"></a>

### transitions/Tween.stop() ⇒ <code>Tween</code>
**Kind**: instance method of <code>[transitions/Tween](#transitions/Tween)</code>  
<a name="transitions/Tween+stopChainedTweens"></a>

### transitions/Tween.stopChainedTweens() ⇒ <code>Tween</code>
**Kind**: instance method of <code>[transitions/Tween](#transitions/Tween)</code>  
<a name="transitions/Tween+to"></a>

### transitions/Tween.to(properties, [data]) ⇒ <code>Tween</code>
**Kind**: instance method of <code>[transitions/Tween](#transitions/Tween)</code>  

| Param | Type |
| --- | --- |
| properties | <code>Object</code> | 
| [data] | <code>Tween.defaults</code> &#124; <code>Object</code> | 

<a name="transitions/Tween+trigger"></a>

### transitions/Tween.trigger(event, data) ⇒ <code>boolean</code>
**Kind**: instance method of <code>[transitions/Tween](#transitions/Tween)</code>  

| Param | Type |
| --- | --- |
| event | <code>string</code> | 
| data | <code>Array.&lt;\*&gt;</code> | 

<a name="transitions/Tween+update"></a>

### transitions/Tween.update(time) ⇒ <code>boolean</code>
**Kind**: instance method of <code>[transitions/Tween](#transitions/Tween)</code>  

| Param | Type |
| --- | --- |
| time | <code>number</code> | 

<a name="transitions/Tween.update"></a>

### transitions/Tween.update(time) ⇒ <code>boolean</code>
**Kind**: static method of <code>[transitions/Tween](#transitions/Tween)</code>  

| Param | Type |
| --- | --- |
| time | <code>number</code> | 

<a name="transitions/Tween+yoyo"></a>

### transitions/Tween.yoyo([count]) ⇒ <code>Tween</code>
**Kind**: instance method of <code>[transitions/Tween](#transitions/Tween)</code>  

| Param | Type |
| --- | --- |
| [count] | <code>number</code> | 

<a name="transitions/Tween+yoyoAll"></a>

### transitions/Tween.yoyoAll([count]) ⇒ <code>Tween</code>
**Kind**: instance method of <code>[transitions/Tween](#transitions/Tween)</code>  

| Param | Type |
| --- | --- |
| [count] | <code>number</code> | 


## License

BSD. © 2015 Dimitriy Kalugin, Zlib. © 2015 Нагель Петр

