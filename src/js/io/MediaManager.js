/**
 * J2D (jQuery Canvas Graphic Engine plugin)
 *
 * @authors DeVinterX
 * @license BSD
 * @version 0.2.0-dev
 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('io/MediaManager', ['jquery', 'utils/ArrayMap'], factory);
    } else if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = factory(require('jquery'), require('utils/ArrayMap'));
    } else {
        factory(root.jQuery, root.ArrayMap);
    }
}(typeof window !== 'undefined' ? window : global, function ($, ArrayMap) {
    "use strict";
    var cache = {};

    var audioContext = false;
    var html5Audio = false;

    try {
        //noinspection JSUnresolvedVariable
        var AudioContext = global.AudioContext || global.webkitAudioContext;
        audioContext = new AudioContext();
    } catch (e) {
        console.warn('Web Audio API is not supported in your browser');
    }

    try {
        //noinspection JSUnresolvedFunction
        html5Audio = !!new Audio();
    } catch (e) {
        console.warn('HTML5 Audio is not supported in your browser');
    }

    if (audioContext) {
        var masterGain = (audioContext.createGain === undefined)
            ? audioContext.createGainNode()
            : audioContext.createGain();
        masterGain.gain.value = 1;
        masterGain.connect(audioContext.destination);
    }


    /* Sound */

    var Sound = function (mediaManager, data) {
        var sound = this;
        this.mediaManager = mediaManager;
        this.data = $.extend(true, {}, Sound.defaults, data);
        this.webAudio = audioContext && this.data.buffer;
        this.audioNode = [];

        if (this.data.id === null) {
            this.data.id = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        }

        if (this.webAudio) {
            this.setupAudioNode()
        }

        if (audioContext !== undefined
            && audioContext && mediaManager.data.iOSAutoEnable) {
            mediaManager.iOSEnable = true;
        }

        mediaManager.media.get('sounds').add(this.data.id, this);

        this.load();
    };

    Sound.defaults = {
        id: null,
        autoPlay: false,
        buffer: false,
        duration: 0,
        format: null,
        loop: false,
        loaded: false,
        sprite: {},
        src: '',
        pos3d: [0, 0, -0.5],
        volume: 1,
        urls: [],
        rate: 1,

        model: null,
        onload: [function () {
        }],
        onloaderror: [function (error) {
            console.log(error);
        }],
        onend: [function () {
        }],
        onpause: [function () {
        }],
        onplay: [function () {
        }],
        onendTimer: []
    };

    /**
     * @private
     */
    Sound.prototype.setupAudioNode = function () {
        var sound = this,
            node = sound.audioNode,
            index = sound.audioNode.length;

        node[index] = (audioContext.createGain === undefined)
            ? audioContext.createGainNode()
            : audioContext.createGain();

        node[index].gain.value = this.data.volume;
        node[index].paused = true;
        node[index].pos = 0;
        node[index].readyState = 4;
        node[index].connect(masterGain);

        node[index].panner = audioContext.createPanner();
        node[index].panner.panningModel = this.data.model || 'equalpower';
        node[index].panner.setPosition(this.data.pos3d[0], this.data.pos3d[1], this.data.pos3d[2]);
        node[index].panner.connect(node[index]);

        return node[index];
    };

    Sound.prototype.load = function () {
        var sound = this,
            url = null;

        if (!audioContext && !html5Audio) {
            console.error('No audio support.');
            return;
        }

        for (var i = 0; i < sound.data.urls.length; i++) {
            var extension, urlItem;

            if (sound.data.format) {
                extension = sound.data.format;
            } else {
                urlItem = sound.data.urls[i];
                extension = /^data:audio\/([^;,]+);/i.exec(urlItem);
                if (!extension) {
                    extension = /\.([^.]+)$/.exec(urlItem.split('?', 1)[0]);
                }

                if (extension) {
                    extension = extension[1].toLowerCase();
                } else {
                    console.error('Could not extract format from passed URLs, please add format parameter.');
                    return;
                }
            }

            if (sound.mediaManager.data.codecs[extension]) {
                url = sound.data.urls[i];
                break;
            }
        }

        if (!url) {
            console.error('No codecs support for selected audio sources.');
            return;
        }

        sound.data.src = url;

        if (audioContext) {
            loadBuffer(sound, url);
        } else {
            var audioNode = new Audio();

            audioNode.addEventListener('error', function () {
                if (audioNode.error && audioNode.error.code === 4) {
                    html5Audio = false; //TODO:: Check this to local
                }
                console.error({type: audioNode.error ? audioNode.error.code : 0});
            }, false);

            sound.audioNode.push(audioNode);

            audioNode.src = url;
            audioNode.pos = 0;
            audioNode.preload = 'auto';
            audioNode.volume = (sound.mediaManager.muted) ? 0 : sound.data.volume * (sound.mediaManager.volume / 100);

            var listener = function () {
                sound.data.duration = Math.ceil(audioNode.duration * 10) / 10;

                if (Object.getOwnPropertyNames(sound.data.sprite).length === 0) {
                    sound.data.sprite = {default: [0, sound.data.duration * 1000]};
                }

                if (!sound.data.loaded) {
                    sound.data.loaded = true;
                    sound.on('load');
                }

                if (sound.data.autoplay) {
                    sound.play();
                }

                audioNode.removeEventListener('canplaythrough', listener, false);
            };
            audioNode.addEventListener('canplaythrough', listener, false);
            audioNode.load();
        }

        return sound;
    };

    Sound.prototype.urls = function (urls) {
        var sound = this;

        if (urls) {
            sound.stop();
            sound.data.urls = (typeof urls === 'string') ? [urls] : urls;
            sound.data.loaded = false;
            sound.load();
            return sound;
        } else {
            return sound.data.urls;
        }
    };

    Sound.prototype.play = function (sprite, callback) {
        var sound = this;

        if (typeof sprite === 'function') {
            callback = sprite;
        }

        if (!sprite || typeof sprite === 'function') {
            sprite = 'default';
        }

        if (!sound.data.loaded) {
            sound.on('load', function () {
                sound.play(sprite, callback);
            });
            return sound;
        }

        if (!sound.data.sprite[sprite]) {
            if (typeof callback === 'function') callback();
            return sound;
        }

        sound.inactiveNode(function (node) {
            node.sprite = sprite;

            var pos = (node.pos > 0) ? node.pos : sound.data.sprite[sprite][0] / 1000;

            var duration = 0;
            if (audioContext) {
                duration = sound.data.sprite[sprite][1] / 1000 - node.pos;
                if (node.pos > 0) {
                    pos = sound.data.sprite[sprite][0] / 1000 + pos;
                }
            } else {
                duration = sound.data.sprite[sprite][1] / 1000 - (pos - sound.data.sprite[sprite][0] / 1000);
            }

            var loop = !!(sound.data.loop || sound.data.sprite[sprite][2]);

            var soundId = (typeof callback === 'string')
                ? callback
                : Math.round(Date.now() * Math.random()) + '', timerId;
            (function () {
                var data = {
                    id: soundId,
                    sprite: sprite,
                    loop: loop
                };
                timerId = setTimeout(function () {
                    if (!audioContext && loop) {
                        sound.stop(data.id).play(sprite, data.id);
                    }

                    if (audioContext && !loop) {
                        sound.nodeById(data.id).paused = true;
                        sound.nodeById(data.id).pos = 0;
                        sound.clearEndTimer(data.id);
                    }

                    if (!audioContext && !loop) {
                        sound.stop(data.id);
                    }

                    sound.on('end', soundId);
                }, (duration / sound.data.rate) * 1000);

                sound.data.onendTimer.push({timer: timerId, id: data.id});
            })();

            if (audioContext) {
                var loopStart = sound.data.sprite[sprite][0] / 1000,
                    loopEnd = sound.data.sprite[sprite][1] / 1000;

                node.id = soundId;
                node.paused = false;
                refreshBuffer(sound, [loop, loopStart, loopEnd], soundId);
                sound.data.playStart = audioContext.currentTime;
                node.gain.value = sound.data.volume;

                if (typeof node.bufferSource.start === 'undefined') {
                    loop ? node.bufferSource.noteGrainOn(0, pos, 86400) : node.bufferSource.noteGrainOn(0, pos, duration);
                } else {
                    loop ? node.bufferSource.start(0, pos, 86400) : node.bufferSource.start(0, pos, duration);
                }
            } else {
                if (node.readyState === 4 || !node.readyState && navigator.isCocoonJS) {
                    node.id = soundId;
                    node.currentTime = pos;
                    node.muted = sound.mediaManager.muted || node.muted;
                    node.volume = sound.data.volume * (sound.mediaManager.volume / 100);
                    setTimeout(function () {
                        node.play();
                    }, 0);
                } else {
                    sound.clearEndTimer(soundId);

                    (function () {
                        var sound = sound,
                            playSprite = sprite,
                            fn = callback,
                            newNode = node;
                        var listener = function () {
                            sound.play(playSprite, fn);

                            newNode.removeEventListener('canplaythrough', listener, false);
                        };
                        newNode.addEventListener('canplaythrough', listener, false);
                    })();

                    return sound;
                }
            }

            sound.on('play');
            if (typeof callback === 'function') callback(soundId);

            return sound;
        });

        return sound;
    };

    Sound.prototype.pause = function (id) {
        var sound = this;

        if (!sound.data.loaded) {
            sound.on('play', function () {
                sound.pause(id);
            });
            return sound;
        }

        sound.clearEndTimer(id);

        var activeNode = (id) ? sound.nodeById(id) : sound.activeNode();
        if (activeNode) {
            activeNode.pos = sound.pos(null, id);

            if (audioContext) {
                if (!activeNode.bufferSource || activeNode.paused) {
                    return sound;
                }

                activeNode.paused = true;
                if (activeNode.bufferSource.stop == undefined) {
                    activeNode.bufferSource.noteOff(0);
                } else {
                    activeNode.bufferSource.stop(0);
                }
            } else {
                activeNode.pause();
            }
        }

        sound.on('pause');

        return sound;
    };

    Sound.prototype.stop = function (id) {
        var sound = this;

        if (!sound.data.loaded) {
            sound.on('play', function () {
                sound.stop(id);
            });
            return sound;
        }

        sound.clearEndTimer(id);

        var activeNode = (id) ? sound.nodeById(id) : sound.activeNode();
        if (activeNode) {
            activeNode.pos = 0;

            if (audioContext) {
                if (!activeNode.bufferSource || activeNode.paused) {
                    return sound;
                }

                activeNode.paused = true;

                if (typeof activeNode.bufferSource.stop === 'undefined') {
                    activeNode.bufferSource.noteOff(0);
                } else {
                    activeNode.bufferSource.stop(0);
                }
            } else if (!isNaN(activeNode.duration)) {
                activeNode.pause();
                activeNode.currentTime = 0;
            }
        }

        return sound;
    };

    Sound.prototype.mute = function (id) {
        var sound = this;

        if (!sound.data.loaded) {
            sound.on('play', function () {
                sound.mute(id);
            });
            return sound;
        }

        var activeNode = (id) ? sound.nodeById(id) : sound.activeNode();
        if (activeNode) {
            if (audioContext) {
                activeNode.gain.value = 0;
            } else {
                activeNode.muted = true;
            }
        }

        return sound;
    };

    Sound.prototype.unMute = function (id) {
        var sound = this;

        if (!sound.data.loaded) {
            sound.on('play', function () {
                sound.unmute(id);
            });
            return sound;
        }

        var activeNode = (id) ? sound.nodeById(id) : sound.activeNode();
        if (activeNode) {
            if (audioContext) {
                activeNode.gain.value = sound.data.volume;
            } else {
                activeNode.muted = false;
            }
        }

        return sound;
    };

    Sound.prototype.volume = function (vol, id) {
        var sound = this;

        vol = parseFloat(vol);

        if (vol >= 0 && vol <= 1) {
            sound.data.volume = vol;

            if (!sound.data.loaded) {
                sound.on('play', function () {
                    sound.volume(vol, id);
                });
                return sound;
            }

            var activeNode = (id) ? sound.nodeById(id) : sound.activeNode();
            if (activeNode) {
                if (audioContext) {
                    activeNode.gain.value = vol;
                } else {
                    activeNode.volume = vol * (sound.mediaManager.volume / 100);
                }
            }

            return sound;
        }
        return sound.data.volume;
    }; // TODO:: @Property

    Sound.prototype.loop = function (loop) {
        var sound = this;

        if (typeof loop === 'boolean') {
            sound.data.loop = loop;
            return sound;
        }
        return sound.data.loop;
    }; // TODO:: @Property

    Sound.prototype.sprite = function (sprite) {
        var sound = this;

        if (typeof sprite === 'object') {
            sound.data.sprite = sprite;
            return sound;
        }
        return sound.data.sprite;
    }; // TODO:: @Property

    Sound.prototype.pos = function (pos, id) {
        var sound = this;

        if (!sound.data.loaded) {
            sound.on('load', function () {
                sound.pos(pos);
            });
            return typeof pos === 'number' ? sound : sound.data.pos || 0;
        }

        pos = parseFloat(pos);

        var activeNode = (id) ? sound.nodeById(id) : sound.activeNode();
        if (activeNode) {
            if (pos >= 0) {
                sound.pause(id);
                activeNode.pos = pos;
                sound.play(activeNode.sprite, id);
                return sound;
            } else {
                return audioContext ? activeNode.pos + (audioContext.currentTime - sound.data.playStart) : activeNode.currentTime;
            }
        } else if (pos >= 0) {
            return sound;
        } else {
            for (var i = 0; i < sound.audioNode.length; i++) {
                if (sound.audioNode[i].paused && sound.audioNode[i].readyState === 4) {
                    return (audioContext) ? sound.audioNode[i].pos : sound.audioNode[i].currentTime;
                }
            }
        }
    };

    Sound.prototype.pos3d = function (x, y, z, id) {
        var sound = this;

        y = (typeof y === 'undefined' || !y) ? 0 : y;
        z = (typeof z === 'undefined' || !z) ? -0.5 : z;

        if (!sound.data.loaded) {
            sound.on('play', function () {
                sound.pos3d(x, y, z, id);
            });
            return sound;
        }

        if (x >= 0 || x < 0) {
            if (audioContext) {
                var activeNode = (id) ? sound.nodeById(id) : sound.activeNode();
                if (activeNode) {
                    sound.data.pos3d = [x, y, z];
                    activeNode.panner.setPosition(x, y, z);
                    activeNode.panner.panningModel = sound.data.model || 'HRTF';
                }
            }
        } else {
            return sound.data.pos3d;
        }

        return sound;
    };

    Sound.prototype.unload = function () {
        var sound = this;

        var nodes = sound.audioNode;
        for (var i = 0; i < sound.audioNode.length; i++) {
            if (!nodes[i].paused) {
                sound.stop(nodes[i].id);
                sound.on('end', nodes[i].id);
            }
            if (!audioContext) {
                nodes[i].src = '';
            } else {
                nodes[i].disconnect(0);
            }
        }

        for (i = 0; i < sound.data.onendTimer.length; i++) {
            clearTimeout(sound.data.onendTimer[i].timer);
        }

        var sounds = this.mediaManager.get('sounds');
        var index = sounds.indexOf(sound);
        if (index !== null && index >= 0) {
            sounds.splice(index, 1);
        }

        delete cache[sound.data.src];
        sound = null;
    };

    /**
     * @private
     */
    Sound.prototype.nodeById = function (id) {
        var sound = this,
            node = sound.audioNode[0];

        for (var i = 0; i < sound.audioNode.length; i++) {
            if (sound.audioNode[i].id === id) {
                node = sound.audioNode[i];
                break;
            }
        }

        return node;
    };

    /**
     * @private
     */
    Sound.prototype.activeNode = function () {
        var sound = this,
            node = null;

        for (var i = 0; i < sound.audioNode.length; i++) {
            if (!sound.audioNode[i].paused) {
                node = sound.audioNode[i];
                break;
            }
        }

        sound.drainPool();

        return node;
    };

    /**
     * @private
     */
    Sound.prototype.inactiveNode = function (callback) {
        var sound = this,
            node = null;

        for (var i = 0; i < sound.audioNode.length; i++) {
            if (sound.audioNode[i].paused && sound.audioNode[i].readyState === 4) {
                callback(sound.audioNode[i]);
                node = true;
                break;
            }
        }

        sound.drainPool();

        if (node) return;

        var newNode;
        if (audioContext) {
            newNode = sound.setupAudioNode();
            callback(newNode);
        } else {
            sound.load();
            newNode = sound.audioNode[sound.audioNode.length - 1];

            var listenerEvent = navigator.isCocoonJS ? 'canplaythrough' : 'loadedmetadata';
            var listener = function () {
                newNode.removeEventListener(listenerEvent, listener, false);
                callback(newNode);
            };
            newNode.addEventListener(listenerEvent, listener, false);
        }
    };

    /**
     * @private
     */
    Sound.prototype.drainPool = function () {
        var sound = this,
            inactive = 0,
            i;

        for (i = 0; i < sound.audioNode.length; i++) {
            if (sound.audioNode[i].paused) inactive++;
        }

        for (i = sound.audioNode.length - 1; i >= 0; i--) {
            if (inactive <= 5) break;

            if (sound.audioNode[i].paused) {
                if (audioContext) sound.audioNode[i].disconnect(0);
                sound.audioNode.splice(i, 1);
                inactive--;
            }
        }
    };

    /**
     * @private
     */
    Sound.prototype.clearEndTimer = function (soundId) {
        var sound = this,
            index = -1;

        for (var i = 0; i < sound.data.onendTimer.length; i++) {
            if (sound.data.onendTimer[i].id === soundId) {
                index = i;
                break;
            }
        }

        var timer = sound.data.onendTimer[index];
        if (timer) {
            clearTimeout(timer.timer);
            sound.data.onendTimer.splice(index, 1);
        }
    };

    Sound.prototype.on = function (event, callback) {
        var sound = this,
            events = sound.data['on' + event];

        if (typeof callback === 'function') {
            events.push(callback);
        } else {
            for (var i = 0; i < events.length; i++) {
                if (callback) {
                    events[i].call(sound, callback);
                } else {
                    events[i].call(sound);
                }
            }
        }

        return sound;
    };

    /**
     * Remove a custom event.
     * @param  {String}   event Event type.
     * @param  {Function} callback    Listener to remove.
     * @return {Sound}
     */
    Sound.prototype.off = function (event, callback) {
        var sound = this,
            events = sound.data['on' + event];

        if (callback) {
            for (var i = 0; i < events.length; i++) {
                if (callback === events[i]) {
                    events.splice(i, 1);
                    break;
                }
            }
        } else {
            sound['on' + event] = [];
        }

        return sound;
    };


    /* WebAudioAPI Helpers */
    if (!audioContext) {
    } else {

        /**
         * Buffer a sound from URL (or from cache) and decode to audio source (Web Audio API).
         * @param  {Object} sound The Sound object for the sound to load.
         * @param  {String} url The path to the sound file.
         */
        var loadBuffer = function (sound, url) {
            if (url in cache) {
                sound.data.duration = cache[url].duration;

                loadSound(sound);
                return;
            }

            if (/^data:[^;]+;base64,/.test(url)) {
                var data = atob(url.split(',')[1]);
                var dataView = new Uint8Array(data.length);
                for (var i = 0; i < data.length; ++i) {
                    dataView[i] = data.charCodeAt(i);
                }

                decodeAudioData(dataView.buffer, sound, url);
            } else {
                var xhr = new XMLHttpRequest();
                xhr.open('GET', url, true);
                xhr.responseType = 'arraybuffer';
                xhr.onload = function () {
                    decodeAudioData(xhr.response, sound, url);
                };
                xhr.onerror = function () {
                    if (audioContext) {
                        sound.data.buffer = true;
                        sound.audioNode = [];
                        delete sound.gainNode;
                        delete cache[url];
                        sound.load();
                    }
                };
                try {
                    xhr.send();
                } catch (e) {
                    xhr.onerror();
                }
            }
        };

        /**
         * Decode audio data from an array buffer.
         * @param  {ArrayBuffer} arraybuffer The audio data.
         * @param  {Object} sound The Sound object for the sound to load.
         * @param  {String} url The path to the sound file.
         */
        var decodeAudioData = function (arraybuffer, sound, url) {
            audioContext.decodeAudioData(
                arraybuffer,
                function (buffer) {
                    if (buffer) {
                        cache[url] = buffer;
                        loadSound(sound, buffer);
                    }
                },
                function (error) {
                    sound.on('loaderror', error);
                }
            );
        };

        /**
         * Finishes loading the Web Audio API sound and fires the loaded event
         * @param  {Object}  sound    The Sound object for the sound to load.
         * @param  {Object} buffer The decoded buffer sound source.
         */
        var loadSound = function (sound, buffer) {
            sound.data.duration = (buffer) ? buffer.duration : sound.data.duration;

            if (Object.getOwnPropertyNames(sound.data.sprite).length === 0) {
                sound.data.sprite = {default: [0, sound.data.duration * 1000]};
            }

            if (!sound.data.loaded) {
                sound.data.loaded = true;
                sound.on('load');
            }

            if (sound.data.autoplay) {
                sound.play();
            }
        };

        /**
         * Load the sound back into the buffer source.
         * @param  {Object} sound   The sound to load.
         * @param  {Array}  loop  Loop boolean, pos, and duration.
         * @param  {String} id    (optional) The play instance ID.
         */
        var refreshBuffer = function (sound, loop, id) {
            var node = sound.nodeById(id);

            node.bufferSource = audioContext.createBufferSource();
            node.bufferSource.buffer = cache[sound.data.src];
            node.bufferSource.connect(node.panner);
            node.bufferSource.loop = loop[0];
            if (loop[0]) {
                node.bufferSource.loopStart = loop[1];
                node.bufferSource.loopEnd = loop[1] + loop[2];
            }
            //noinspection JSPrimitiveTypeWrapperUsage
            node.bufferSource.playbackRate.value = sound.data.rate;
        };
    }


    /* MediaManager */

    /**
     * @param {J2D} j2d
     * @param {MediaManager.defaults|Object|undefined} [data]
     * @constructor
     */
    var MediaManager = function (j2d, data) {
        if (data === undefined) data = {};
        var soundManager = this;
        this.j2d = j2d;
        this.data = $.extend(true, {}, MediaManager.defaults, data);
        this.media = new ArrayMap();

        this.media.add('sounds', new ArrayMap());
        this.media.add('audios', new ArrayMap());
        this.media.add('videos', new ArrayMap());

        this.volume = this.data.volume * 100;
        this.iOSEnabled = false;

        if (audioContext || html5Audio) {
            var test = new Audio();
            this.data.codecs = {
                mp3: !!test.canPlayType('audio/mpeg;').replace(/^no$/, ''),
                opus: !!test.canPlayType('audio/ogg; codecs="opus"').replace(/^no$/, ''),
                ogg: !!test.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/, ''),
                wav: !!test.canPlayType('audio/wav; codecs="1"').replace(/^no$/, ''),
                aac: !!test.canPlayType('audio/aac;').replace(/^no$/, ''),
                m4a: !!(test.canPlayType('audio/x-m4a;') || test.canPlayType('audio/m4a;') || test.canPlayType('audio/aac;')).replace(/^no$/, ''),
                mp4: !!(test.canPlayType('audio/x-mp4;') || test.canPlayType('audio/mp4;') || test.canPlayType('audio/aac;')).replace(/^no$/, ''),
                weba: !!test.canPlayType('audio/webm; codecs="vorbis"').replace(/^no$/, '')
            };
            test = null;
        }

        Object.defineProperty(this, 'volume', {
            get: function () {
                return soundManager.data.volume * 100;
            },
            set: function (value) {
                soundManager.data.volume = parseFloat(value / 100);

                if (value >= 0 && value <= 1) {
                    if (audioContext) {
                        masterGain.gain.value = soundManager.data.volume;
                    } else {
                        var sounds = soundManager.media.get('sounds');
                        for (var key in sounds) {
                            if (sounds.hasOwnProperty(key) && !sounds[key].webAudio) {
                                for (var i = 0; i < sounds[key].audioNode.length; i++) {
                                    sounds[key].audioNode[i].volume = sounds[key].volume * soundManager.data.volume;
                                }
                            }
                        }
                        sounds = null;
                    }
                }
            }
        });

        Object.defineProperty(this, 'muted', {
            get: function () {
                return !!soundManager.data.muted;
            },
            set: function (value) {
                soundManager.data.muted = !!value;

                if (audioContext) {
                    masterGain.gain.value = soundManager.data.muted ? 0 : soundManager.data.volume;
                } else {
                    var sounds = soundManager.media.get('sounds');
                    for (var key in sounds) {
                        if (sounds.hasOwnProperty(key) && sounds[key].webAudio === false) {
                            for (var i = 0; i < sounds[key].audioNode.length; i++) {
                                sounds[key].audioNode[i].muted = soundManager.data.muted;
                            }
                        }
                    }
                    sounds = null;
                }
            }
        });

        Object.defineProperty(this, 'iOSEnable', {
            get: function () {
                return !!soundManager.data.iOSAutoEnable;
            },
            set: function (value) {
                if (audioContext && (soundManager.iOSEnabled || !/iPhone|iPad|iPod/i.test(navigator.userAgent))) {
                    return value;
                }
                soundManager.iOSEnabled = false;

                var unlock = function () {
                    var buffer = audioContext.createBuffer(1, 1, 22050);
                    var source = audioContext.createBufferSource();
                    source.buffer = buffer;
                    source.connect(audioContext.destination);

                    if (source.start === undefined) {
                        source.noteOn(0);
                    } else {
                        source.start(0);
                    }

                    setTimeout(function () {
                        if ((source.playbackState === source.PLAYING_STATE
                            || source.playbackState === source.FINISHED_STATE)) {
                            soundManager.iOSEnabled = true;
                            soundManager.data.iOSAutoEnable = false;

                            global.removeEventListener('touchend', unlock, false);
                        }
                    }, 0);
                };
                global.addEventListener('touchend', unlock, false);
            }
        });
    };

    MediaManager.defaults = {
        volume: 1,
        muted: false,
        codecs: {},
        iOSAutoEnable: true
    };

    MediaManager.prototype.mute = function () {
        this.muted = true;
        return this;
    };

    MediaManager.prototype.unMute = function () {
        this.muted = false;
        return this;
    };

    MediaManager.prototype.isSupportCodec = function (fileExtension) {
        return !!this.data.codecs[fileExtension];
    };

    MediaManager.prototype.addSound = function (data) {
        new Sound(this, data);
        return this;
    };

    MediaManager.prototype.addAudio = function (data) {
        return this;
    };

    MediaManager.prototype.addVideo = function (data) {
        return this;
    };

    /**
     * @param {string} id
     * @returns {Sound}
     */
    MediaManager.prototype.sound = function (id) {
        return this.media.get('sounds').get(id);
    };

    MediaManager.prototype.audio = function (id) {
    };

    MediaManager.prototype.video = function (id) {
    };

    MediaManager.prototype.removeSound = function (id) {
        if (this.media.get('sounds').contains(id)) {
            this.media.get('sounds').get(id).stop();
            this.media.get('sounds').remove(id);
        }
        return this;
    };

    MediaManager.prototype.removeAudio = function (id) {
        return this;
    };

    MediaManager.prototype.removeVideo = function (id) {
        return this;
    };

    if (global.exports !== undefined) global.exports.MediaManager = MediaManager;
    if (global.J2D !== undefined) global.MediaManager = MediaManager;
    return MediaManager;
}));

