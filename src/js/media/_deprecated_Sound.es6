import ObjectUtil from "utils/ObjectUtil";
import UUID from "utils/UUID";
import Events from "utils/Events";
import Audio from "media/Audio";

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
export default class Sound extends Audio {
    static defaults = {
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

    constructor(data, manager) {
        super(data, manager);

        this.manager = manager;
        this.events = !!this.manager ? this.manager.events : new Events();
        this.data = ObjectUtil.extend(true, {}, Sound.defaults, data);
        this.audioNode = [];
        audioContext = manager
            ? manager.getAudioContext()
            : new (window.AudioContext || window.webkitAudioContext);

        masterGain = manager
            ? manager.getMasterGain()
            : createMasterGain();

        if (this.data.id === null) {
            this.data.id = UUID.generate();
        }

        if (audioContext && this.data.buffer) {
            this._setupAudioNode(this);
        }

        if (this.manager && audioContext && this.manager.data.iOSAutoEnable) {
            this.manager.iOSEnable = true;
        }

        if (this.manager) this.manager.media.get('sounds').add(this.data.id, this);

        this.load();
    }

    _load(sound) {
        loadBuffer(sound, sound.data.src);
        return sound;
    }

    _unload(soundNode) {
        soundNode.disconnect(0);
    }

    play(sprite, callback) {
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
    }

    _pause(activeNode) {
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
    }

    _stop(activeNode) {
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
    }

    _mute(activeNode) {
        activeNode.gain.value = 0;
    }

    _unMute(activeNode) {
        activeNode.gain.value = this.data.volume;
    }

    _volume(activeNode, vol) {
        activeNode.gain.value = vol;
    }

    _position(activeNode, v) {
        if (v !== undefined && v == true) return activeNode.pos;
        return activeNode.pos + (audioContext.currentTime - this.data.playStart);
    }

    _pos3d(activeNode, x, y, z) {
        if (activeNode) {
            this.data.pos3d = [x, y, z];
            activeNode.panner.setPosition(x, y, z);
            activeNode.panner.panningModel = this.data.model || 'HRTF';
        }
    }

    _setupAudioNode() {
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
    }

    /* Private */
    _inactiveNode(sound, callback) {
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
    }

    _drainPool(sound) {
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
    }
}


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
