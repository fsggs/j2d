<img src="https://github.com/fsggs/jquery.j2d/blob/0.2.0-dev/src/img/logo.png?raw=true" align="left" width="80"/>
<h1 align="left">jQuery.j2d <a href="https://www.versioneye.com/user/projects/56afa5f63d82b9003761dfc8">
    <img src="https://www.versioneye.com/user/projects/56afa5f63d82b9003761dfc8/badge.svg?style=flat"/></a></h1>


## API Reference

<a name="io/InputManager"></a>

## io/InputManager
InputManager

**Kind**: global class  

* [io/InputManager](#io/InputManager)
    * [new InputManager(j2d)](#new_io/InputManager_new)
    * _instance_
        * [.checkPressedKeyList(keyList)](#io/InputManager+checkPressedKeyList) ⇒ <code>boolean</code>
        * [.checkPressedKeyMap(key)](#io/InputManager+checkPressedKeyMap) ⇒ <code>boolean</code>
        * [.clear()](#io/InputManager+clear) ⇒ <code>InputManager</code>
        * [.disable()](#io/InputManager+disable) ⇒ <code>InputManager</code>
        * [.element](#io/InputManager+element) : <code>Element</code> &#124; <code>jQuery</code>
        * [.enable()](#io/InputManager+enable) ⇒ <code>InputManager</code>
        * [.fixMouseWheel()](#io/InputManager+fixMouseWheel) ⇒ <code>InputManager</code>
        * [.flush()](#io/InputManager+flush) ⇒ <code>InputManager</code>
        * [.getMouseMoveDistance()](#io/InputManager+getMouseMoveDistance) ⇒ <code>Object</code>
        * [.id](#io/InputManager+id) : <code>string</code>
        * [.init()](#io/InputManager+init) ⇒ <code>InputManager</code>
        * [.isCursorVisible()](#io/InputManager+isCursorVisible) ⇒ <code>boolean</code>
        * [.isWriteMode()](#io/InputManager+isWriteMode) ⇒ <code>boolean</code>
    * _static_
        * [.key](#io/InputManager.key)
    * _instance_
        * [.load(newKeyMap)](#io/InputManager+load) ⇒ <code>string</code>
        * [.save()](#io/InputManager+save) ⇒ <code>string</code>
        * [.setCursorImage(image)](#io/InputManager+setCursorImage) ⇒ <code>InputManager</code>
        * [.setKeys(mapObject)](#io/InputManager+setKeys) ⇒ <code>InputManager</code>
        * [.setWriteMode(mode)](#io/InputManager+setWriteMode) ⇒ <code>InputManager</code>
        * [.toggleCursor(enable)](#io/InputManager+toggleCursor) ⇒ <code>InputManager</code>
        * [.update()](#io/InputManager+update) ⇒ <code>boolean</code>

<a name="new_io/InputManager_new"></a>

### new InputManager(j2d)

| Param | Type |
| --- | --- |
| j2d | <code>J2D</code> | 

<a name="io/InputManager+checkPressedKeyList"></a>

### io/InputManager.checkPressedKeyList(keyList) ⇒ <code>boolean</code>
**Kind**: instance method of <code>[io/InputManager](#io/InputManager)</code>  

| Param | Type |
| --- | --- |
| keyList | <code>Array.&lt;number&gt;</code> &#124; <code>Array.&lt;number&gt;</code> &#124; <code>number</code> | 

<a name="io/InputManager+checkPressedKeyMap"></a>

### io/InputManager.checkPressedKeyMap(key) ⇒ <code>boolean</code>
**Kind**: instance method of <code>[io/InputManager](#io/InputManager)</code>  

| Param | Type |
| --- | --- |
| key | <code>string</code> | 

<a name="io/InputManager+clear"></a>

### io/InputManager.clear() ⇒ <code>InputManager</code>
**Kind**: instance method of <code>[io/InputManager](#io/InputManager)</code>  
<a name="io/InputManager+disable"></a>

### io/InputManager.disable() ⇒ <code>InputManager</code>
**Kind**: instance method of <code>[io/InputManager](#io/InputManager)</code>  
<a name="io/InputManager+element"></a>

### io/InputManager.element : <code>Element</code> &#124; <code>jQuery</code>
**Kind**: instance property of <code>[io/InputManager](#io/InputManager)</code>  
<a name="io/InputManager+enable"></a>

### io/InputManager.enable() ⇒ <code>InputManager</code>
**Kind**: instance method of <code>[io/InputManager](#io/InputManager)</code>  
<a name="io/InputManager+fixMouseWheel"></a>

### io/InputManager.fixMouseWheel() ⇒ <code>InputManager</code>
**Kind**: instance method of <code>[io/InputManager](#io/InputManager)</code>  
<a name="io/InputManager+flush"></a>

### io/InputManager.flush() ⇒ <code>InputManager</code>
**Kind**: instance method of <code>[io/InputManager](#io/InputManager)</code>  
<a name="io/InputManager+getMouseMoveDistance"></a>

### io/InputManager.getMouseMoveDistance() ⇒ <code>Object</code>
**Kind**: instance method of <code>[io/InputManager](#io/InputManager)</code>  
<a name="io/InputManager+id"></a>

### io/InputManager.id : <code>string</code>
**Kind**: instance property of <code>[io/InputManager](#io/InputManager)</code>  
<a name="io/InputManager+init"></a>

### io/InputManager.init() ⇒ <code>InputManager</code>
**Kind**: instance method of <code>[io/InputManager](#io/InputManager)</code>  
<a name="io/InputManager+isCursorVisible"></a>

### io/InputManager.isCursorVisible() ⇒ <code>boolean</code>
**Kind**: instance method of <code>[io/InputManager](#io/InputManager)</code>  
<a name="io/InputManager+isWriteMode"></a>

### io/InputManager.isWriteMode() ⇒ <code>boolean</code>
**Kind**: instance method of <code>[io/InputManager](#io/InputManager)</code>  
<a name="io/InputManager.key"></a>

### io/InputManager.key
static keys arrayList

**Kind**: static property of <code>[io/InputManager](#io/InputManager)</code>  
<a name="io/InputManager+load"></a>

### io/InputManager.load(newKeyMap) ⇒ <code>string</code>
**Kind**: instance method of <code>[io/InputManager](#io/InputManager)</code>  

| Param | Type |
| --- | --- |
| newKeyMap | <code>string</code> | 

<a name="io/InputManager+save"></a>

### io/InputManager.save() ⇒ <code>string</code>
**Kind**: instance method of <code>[io/InputManager](#io/InputManager)</code>  
<a name="io/InputManager+setCursorImage"></a>

### io/InputManager.setCursorImage(image) ⇒ <code>InputManager</code>
**Kind**: instance method of <code>[io/InputManager](#io/InputManager)</code>  

| Param | Type |
| --- | --- |
| image | <code>string</code> | 

<a name="io/InputManager+setKeys"></a>

### io/InputManager.setKeys(mapObject) ⇒ <code>InputManager</code>
KeyMap Manager

**Kind**: instance method of <code>[io/InputManager](#io/InputManager)</code>  

| Param |
| --- |
| mapObject | 

<a name="io/InputManager+setWriteMode"></a>

### io/InputManager.setWriteMode(mode) ⇒ <code>InputManager</code>
**Kind**: instance method of <code>[io/InputManager](#io/InputManager)</code>  

| Param | Type |
| --- | --- |
| mode | <code>boolean</code> | 

<a name="io/InputManager+toggleCursor"></a>

### io/InputManager.toggleCursor(enable) ⇒ <code>InputManager</code>
**Kind**: instance method of <code>[io/InputManager](#io/InputManager)</code>  

| Param | Type |
| --- | --- |
| enable | <code>boolean</code> | 

<a name="io/InputManager+update"></a>

### io/InputManager.update() ⇒ <code>boolean</code>
**Kind**: instance method of <code>[io/InputManager](#io/InputManager)</code>  

## License

BSD. © 2015 Dimitriy Kalugin, Zlib. © 2015 Нагель Петр

