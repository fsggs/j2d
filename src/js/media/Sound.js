/**
 * J2D (jQuery Canvas Graphic Engine plugin)
 *
 * @authors DeVinterX, James Simpson of GoldFire Studios(howler.js)
 * @original_source https://github.com/goldfire/howler.js/blob/master/howler.js
 * @license BSD, MIT(howler.js)
 * @version 0.2.0-dev
 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('media/Sound', ['utils/UUID', 'utils/Events', 'media/Audio'], factory);
    } else if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = factory(require('utils/UUID'), require('utils/Events'), require('media/Audio'));
    } else {
        factory(root.UUID, root.Events, root.Audio);
    }
}(typeof window !== 'undefined' ? window : global, function (UUID, Events, Audio) {
    "use strict";

    var cache = {};
    var audioContext;
    var masterGain;

    function createMasterGain() {
        if (audioContext) {
            masterGain = (audioContext.createGain === undefined)
                ? audioContext.createGainNode()
                : audioContext.createGain();
            masterGain.gain.value = 1;
            masterGain.connect(audioContext.destination);
            return masterGain;
        }
        return null;
    }

    /**
     * @class Sound
     * @exports module:media/Sound
     *
     * @constructor
     * @extends media/Audio
     * @param {Audio.defaults|Object} [data]
     * @param {MediaManager} [manager]
     */
    var Sound = function (data, manager) {
        var sound = this;
        Audio.call(this, data, manager);

        sound.manager = manager;
        sound.events = !!sound.manager ? sound.manager.events : new Events();
        sound.data = $.extend(true, {}, Sound.defaults, data);
        sound.audioNode = [];
        audioContext = manager
            ? manager.getAudioContext()
            : new (global.AudioContext || global.webkitAudioContext);

        masterGain = manager
            ? manager.getMasterGain()
            : createMasterGain();

        if (sound.data.id === null) {
            sound.data.id = UUID.generate();
        }

        if (audioContext && sound.data.buffer) {
            _setupAudioNode(sound);
        }

        if (sound.manager && audioContext && sound.manager.data.iOSAutoEnable) {
            sound.manager.iOSEnable = true;
        }

        if (sound.manager) sound.manager.media.get('sounds').add(sound.data.id, sound);

        sound.load();
    };

    Sound.defaults = {
        id: null,
        src: [],
        format: null,
        autoPlay: false,

        duration: 0,
        loop: false,
        sprite: {},
        volume: 1,
        muted: false,
        pos3d: [0, 0, -0.5],
        rate: 1,

        loaded: false,
        buffer: false,
        model: null,
        onEndTimer: []
    };

    Sound.prototype = Object.create(Audio.prototype);
    Sound.prototype.constructor = Sound;

    Sound.prototype._load = function (sound) {
        loadBuffer(sound, sound.data.src);
        return sound;
    };

    Sound.prototype._unload = function (soundNode) {
        soundNode.disconnect(0);
    };

    Sound.prototype.play = function (sprite, callback) {
        var sound = this;

        if (typeof sprite === 'function')  callback = sprite;

        if (!sprite || typeof sprite === 'function') sprite = 'default';

        if (!sound.data.loaded) {
            sound.events.on('load', function () {
                sound.play(sprite, callback);
            });

            return sound;
        }

        if (!sound.data.sprite[sprite]) {
            if (typeof callback === 'function') callback();
            return sound;
        }

        sound._inactiveNode(sound, function (node) {
            node.sprite = sprite;

            var pos = (node.pos > 0) ? node.pos : sound.data.sprite[sprite][0] / 1000;
            var duration = sound.data.sprite[sprite][1] / 1000 - node.pos;
            if (node.pos > 0) pos = sound.data.sprite[sprite][0] / 1000 + pos;
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
                    if (audioContext && !loop) {
                        sound._nodeById(sound, data.id).paused = true;
                        sound._nodeById(sound, data.id).pos = 0;
                        sound._clearEndTimer(sound, data.id);
                    }
                    sound.events.trigger('unload', soundId);
                }, (duration / sound.data.rate) * 1000);

                sound.data.onEndTimer.push({timer: timerId, id: data.id});
            })();

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

            sound.events.trigger('play');
            if (typeof callback === 'function') callback(soundId);

            return sound;
        });

        return sound;
    };

    Sound.prototype._pause = function (activeNode) {
        if (!activeNode.bufferSource || activeNode.paused) {
            return true;
        }

        activeNode.paused = true;
        if (activeNode.bufferSource.stop == undefined) {
            activeNode.bufferSource.noteOff(0);
        } else {
            activeNode.bufferSource.stop(0);
        }
        return false;
    };

    Sound.prototype._stop = function (activeNode) {
        if (!activeNode.bufferSource || activeNode.paused) {
            return true;
        }

        activeNode.paused = true;

        if (typeof activeNode.bufferSource.stop === 'undefined') {
            activeNode.bufferSource.noteOff(0);
        } else {
            activeNode.bufferSource.stop(0);
        }
        return false;
    };

    Sound.prototype._mute = function (activeNode) {
        activeNode.gain.value = 0;
    };

    Sound.prototype._unMute = function (activeNode) {
        activeNode.gain.value = this.data.volume;
    };

    Sound.prototype._volume = function (activeNode, vol) {
        activeNode.gain.value = vol;
    };

    Sound.prototype._position = function (activeNode, v) {
        if (v !== undefined && v == true) return activeNode.pos;
        return activeNode.pos + (audioContext.currentTime - this.data.playStart);
    };

    Sound.prototype._pos3d = function (activeNode, x, y, z) {
        if (activeNode) {
            this.data.pos3d = [x, y, z];
            activeNode.panner.setPosition(x, y, z);
            activeNode.panner.panningModel = this.data.model || 'HRTF';
        }
    };

    Sound.prototype._setupAudioNode = function () {
        var sound = this,
            node = sound.audioNode,
            index = sound.audioNode.length;

        node[index] = (audioContext.createGain === undefined)
            ? audioContext.createGainNode()
            : audioContext.createGain();

        node[index].gain.value = sound.data.volume;
        node[index].paused = true;
        node[index].pos = 0;
        node[index].readyState = 4;
        node[index].connect(masterGain);

        node[index].panner = audioContext.createPanner();
        node[index].panner.panningModel = sound.data.model || 'equalpower';
        node[index].panner.setPosition(sound.data.pos3d[0], sound.data.pos3d[1], sound.data.pos3d[2]);
        node[index].panner.connect(node[index]);

        return node[index];
    };


    /* Private */

    Sound.prototype._inactiveNode = function (sound, callback) {
        var node = null;

        for (var i = 0; i < sound.audioNode.length; i++) {
            if (sound.audioNode[i].paused && sound.audioNode[i].readyState === 4) {
                callback(sound.audioNode[i]);
                node = true;
                break;
            }
        }

        sound._drainPool(sound);

        if (node) return;

        var newNode = sound._setupAudioNode();
        callback(newNode);
    };

    Sound.prototype._drainPool = function (sound) {
        var inactive = 0;

        for (var i = 0; i < sound.audioNode.length; i++) {
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


    /* WebAudioAPI Helpers */
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
                sound.events.trigger('loaderror', error);
            }
        );
    };

    /**
     * Finishes loading the Web Audio API sound and fires the loaded event
     * @param  {Object}  sound    The Sound object for the sound to load.
     * @param  {Object} [buffer] The decoded buffer sound source.
     */
    var loadSound = function (sound, buffer) {
        sound.data.duration = (buffer) ? buffer.duration : sound.data.duration;

        if (Object.getOwnPropertyNames(sound.data.sprite).length === 0) {
            sound.data.sprite = {default: [0, sound.data.duration * 1000]};
        }

        if (!sound.data.loaded) {
            sound.data.loaded = true;
            sound.events.trigger('load');
        }

        if (sound.data.autoPlay) {
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
        var node = sound._nodeById(sound, id);

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

    if (typeof module === 'object' && typeof module.exports === 'object') module.exports.Sound = Sound;
    if (global.j2d === undefined) global.j2d.media.Sound = Sound;
    return Sound;
}));
