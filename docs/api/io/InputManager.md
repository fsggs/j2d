<img src="https://github.com/fsggs/j2d/blob/0.2.0-dev/src/img/logo.png?raw=true" align="left" width="80"/>
<h1 align="left">j2D <a href="https://www.versioneye.com/user/projects/56afa5f63d82b9003761dfc8">
    <img src="https://www.versioneye.com/user/projects/56afa5f63d82b9003761dfc8/badge.svg?style=flat"/></a></h1>


## API Reference

<a name="io/InputManager"></a>

## io/InputManager : <code>InputManager.key</code>
InputManager

**Kind**: global class  

* [io/InputManager](#io/InputManager) : <code>InputManager.key</code>
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
        * [.key](#io/InputManager.key) : <code>enum</code>
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
key


| Param | Type |
| --- | --- |
| j2d | <code>EngineJ2D</code> | 

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

### io/InputManager.key : <code>enum</code>
Static keys arrayList

**Kind**: static enum property of <code>[io/InputManager](#io/InputManager)</code>  
**Read only**: true  
**Properties**

| Name | Type | Default |
| --- | --- | --- |
| KEY_MOUSE_LEFT | <code>number</code> | <code>1</code> | 
| KEY_MOUSE_MIDDLE | <code>number</code> | <code>2</code> | 
| KEY_MOUSE_RIGHT | <code>number</code> | <code>3</code> | 
| SCROLL_MOUSE_UP | <code>number</code> | <code>4</code> | 
| SCROLL_MOUSE_DOWN | <code>number</code> | <code>5</code> | 
| KEY_BACKSPACE | <code>number</code> | <code>8</code> | 
| KEY_TAB | <code>number</code> | <code>9</code> | 
| KEY_ENTER | <code>number</code> | <code>13</code> | 
| KEY_SHIFT | <code>number</code> | <code>16</code> | 
| KEY_CTRL | <code>number</code> | <code>17</code> | 
| KEY_ALT | <code>number</code> | <code>18</code> | 
| KEY_PAUSE | <code>number</code> | <code>19</code> | 
| KEY_BREAK | <code>number</code> | <code>19</code> | 
| KEY_CAPS_LOCK | <code>number</code> | <code>20</code> | 
| KEY_ESCAPE | <code>number</code> | <code>27</code> | 
| KEY_SPACE_BAR | <code>number</code> | <code>32</code> | 
| KEY_PAGE_UP | <code>number</code> | <code>33</code> | 
| KEY_PAGE_DOWN | <code>number</code> | <code>34</code> | 
| KEY_END | <code>number</code> | <code>35</code> | 
| KEY_HOME | <code>number</code> | <code>36</code> | 
| KEY_LEFT_ARROW | <code>number</code> | <code>37</code> | 
| KEY_UP_ARROW | <code>number</code> | <code>38</code> | 
| KEY_RIGHT_ARROW | <code>number</code> | <code>39</code> | 
| KEY_DOWN_ARROW | <code>number</code> | <code>40</code> | 
| KEY_INSERT | <code>number</code> | <code>45</code> | 
| KEY_DELETE | <code>number</code> | <code>46</code> | 
| KEY_0 | <code>number</code> | <code>48</code> | 
| KEY_1 | <code>number</code> | <code>49</code> | 
| KEY_2 | <code>number</code> | <code>50</code> | 
| KEY_3 | <code>number</code> | <code>51</code> | 
| KEY_4 | <code>number</code> | <code>52</code> | 
| KEY_5 | <code>number</code> | <code>53</code> | 
| KEY_6 | <code>number</code> | <code>54</code> | 
| KEY_7 | <code>number</code> | <code>55</code> | 
| KEY_8 | <code>number</code> | <code>56</code> | 
| KEY_9 | <code>number</code> | <code>57</code> | 
| KEY_A | <code>number</code> | <code>65</code> | 
| KEY_B | <code>number</code> | <code>66</code> | 
| KEY_C | <code>number</code> | <code>67</code> | 
| KEY_D | <code>number</code> | <code>68</code> | 
| KEY_E | <code>number</code> | <code>69</code> | 
| KEY_F | <code>number</code> | <code>70</code> | 
| KEY_G | <code>number</code> | <code>71</code> | 
| KEY_H | <code>number</code> | <code>72</code> | 
| KEY_I | <code>number</code> | <code>73</code> | 
| KEY_J | <code>number</code> | <code>74</code> | 
| KEY_K | <code>number</code> | <code>75</code> | 
| KEY_L | <code>number</code> | <code>76</code> | 
| KEY_M | <code>number</code> | <code>77</code> | 
| KEY_N | <code>number</code> | <code>78</code> | 
| KEY_O | <code>number</code> | <code>79</code> | 
| KEY_P | <code>number</code> | <code>80</code> | 
| KEY_Q | <code>number</code> | <code>81</code> | 
| KEY_R | <code>number</code> | <code>82</code> | 
| KEY_S | <code>number</code> | <code>83</code> | 
| KEY_T | <code>number</code> | <code>84</code> | 
| KEY_U | <code>number</code> | <code>85</code> | 
| KEY_V | <code>number</code> | <code>86</code> | 
| KEY_W | <code>number</code> | <code>87</code> | 
| KEY_X | <code>number</code> | <code>88</code> | 
| KEY_Y | <code>number</code> | <code>89</code> | 
| KEY_Z | <code>number</code> | <code>90</code> | 
| KEY_LEFT_WINDOW_KEY | <code>number</code> | <code>91</code> | 
| KEY_RIGHT_WINDOW_KEY | <code>number</code> | <code>92</code> | 
| KEY_SELECT_KEY | <code>number</code> | <code>93</code> | 
| KEY_NUMPAD_0 | <code>number</code> | <code>96</code> | 
| KEY_NUMPAD_1 | <code>number</code> | <code>97</code> | 
| KEY_NUMPAD_2 | <code>number</code> | <code>98</code> | 
| KEY_NUMPAD_3 | <code>number</code> | <code>99</code> | 
| KEY_NUMPAD_4 | <code>number</code> | <code>100</code> | 
| KEY_NUMPAD_5 | <code>number</code> | <code>101</code> | 
| KEY_NUMPAD_6 | <code>number</code> | <code>102</code> | 
| KEY_NUMPAD_7 | <code>number</code> | <code>103</code> | 
| KEY_NUMPAD_8 | <code>number</code> | <code>104</code> | 
| KEY_NUMPAD_9 | <code>number</code> | <code>105</code> | 
| KEY_MULTIPLY | <code>number</code> | <code>106</code> | 
| KEY_ADD | <code>number</code> | <code>107</code> | 
| KEY_SUBTRACT | <code>number</code> | <code>109</code> | 
| KEY_DECIMAL_POINT | <code>number</code> | <code>110</code> | 
| KEY_DIVIDE | <code>number</code> | <code>111</code> | 
| KEY_F1 | <code>number</code> | <code>112</code> | 
| KEY_F2 | <code>number</code> | <code>113</code> | 
| KEY_F3 | <code>number</code> | <code>114</code> | 
| KEY_F4 | <code>number</code> | <code>115</code> | 
| KEY_F5 | <code>number</code> | <code>116</code> | 
| KEY_F6 | <code>number</code> | <code>117</code> | 
| KEY_F7 | <code>number</code> | <code>118</code> | 
| KEY_F8 | <code>number</code> | <code>119</code> | 
| KEY_F9 | <code>number</code> | <code>120</code> | 
| KEY_F10 | <code>number</code> | <code>121</code> | 
| KEY_F11 | <code>number</code> | <code>122</code> | 
| KEY_F12 | <code>number</code> | <code>123</code> | 
| KEY_NUM_LOCK | <code>number</code> | <code>144</code> | 
| KEY_SCROLL_LOCK | <code>number</code> | <code>145</code> | 
| KEY_SEMI_COLON | <code>number</code> | <code>186</code> | 
| KEY_EQUAL_SIGN | <code>number</code> | <code>187</code> | 
| KEY_COMMA | <code>number</code> | <code>188</code> | 
| KEY_DASH | <code>number</code> | <code>189</code> | 
| KEY_PERIOD | <code>number</code> | <code>190</code> | 
| KEY_FORWARD_SLASH | <code>number</code> | <code>191</code> | 
| KEY_GRAVE_ACCENT | <code>number</code> | <code>192</code> | 
| KEY_OPEN_BRACKET | <code>number</code> | <code>219</code> | 
| KEY_BACK_SLASH | <code>number</code> | <code>220</code> | 
| KEY_CLOSE_BRACKET | <code>number</code> | <code>221</code> | 
| KEY_SINGLE_QUOTE | <code>number</code> | <code>222</code> | 
| KEY_LEFT_COMMAND | <code>number</code> | <code>224</code> | 
| KEY_RIGHT_COMMAND | <code>number</code> | <code>224</code> | 

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

BSD. © 2015-2016 Dimitriy Kalugin, Zlib. © 2015-2016 Нагель Петр

