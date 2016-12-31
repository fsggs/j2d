import ObjectUtil from "../utils/ObjectUtil";
import Events from "../utils/Events";
import ArrayMap from "../utils/ArrayMap";
/**
 * j2D (JavaScript 2D Engine)
 *
 * @authors DeVinterX, James Simpson of GoldFire Studios(howler.js)
 * @original_source https://github.com/goldfire/howler.js/blob/master/howler.js
 * @license BSD, MIT(howler.js)
 * @version 0.2.0-dev
 */

var AudioNode = window.Audio;
var audioContext = false;
var html5Audio = false;

try {
    //noinspection JSUnresolvedVariable
    var AudioContext = window.AudioContext || window.webkitAudioContext;
    audioContext = new AudioContext();
} catch (e) {
    console.warn('Web Audio API is not supported in your browser');
}

try {
    //noinspection JSUnresolvedFunction
    html5Audio = !!new AudioNode();
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

/* MediaManager */

/**
 * @class MediaManager
 * @exports module:io/MediaManager
 *
 * @param {EngineJ2D} j2d
 * @param {MediaManager.defaults|Object|undefined} [data]
 * @constructor
 */
export default class MediaManager {
    static defaults = {
        volume: 1,
        muted: false,
        codecs: {},
        iOSAutoEnable: true
    };

    constructor(j2d, data) {
        if (data === undefined) data = {};
        this.j2d = j2d;
        this.data = ObjectUtil.extend(true, {}, MediaManager.defaults, data);
        this.events = new Events();
        this.media = new ArrayMap();

        this.media.add('sounds', new ArrayMap());
        this.media.add('audios', new ArrayMap());
        this.media.add('videos', new ArrayMap());

        this.volume = this.data.volume * 100;
        this.iOSEnabled = false;

        if (audioContext || html5Audio) {
            var test = new AudioNode();
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
    }

    get volume() {
        return this.data.volume * 100;
    }

    set volume(value) {
        this.data.volume = parseFloat(value / 100);

        if (value >= 0 && value <= 1) {
            if (audioContext) {
                masterGain.gain.value = this.data.volume;
            } else {
                var sounds = this.media.get('sounds');
                for (var key in sounds) {
                    if (sounds.hasOwnProperty(key) && !sounds[key].webAudio) {
                        for (var i = 0; i < sounds[key].audioNode.length; i++) {
                            sounds[key].audioNode[i].volume = sounds[key].volume * this.data.volume;
                        }
                    }
                }
                sounds = null;
            }
        }
    }

    get muted() {
        return !!this.data.muted;
    }

    set muted(value) {
        this.data.muted = !!value;

        if (audioContext) {
            masterGain.gain.value = this.data.muted ? 0 : this.data.volume;
        } else {
            var sounds = this.media.get('sounds');
            for (var key in sounds) {
                if (sounds.hasOwnProperty(key) && sounds[key].webAudio === false) {
                    for (var i = 0; i < sounds[key].audioNode.length; i++) {
                        sounds[key].audioNode[i].muted = this.data.muted;
                    }
                }
            }
            sounds = null;
        }
    }

    get iOSEnable() {
        return !!this.data.iOSAutoEnable;
    }

    set iOSEnable(value) {
        if (audioContext && (this.iOSEnabled || !/iPhone|iPad|iPod/i.test(navigator.userAgent))) {
            return value;
        }
        this.iOSEnabled = false;

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
                    this.iOSEnabled = true;
                    this.data.iOSAutoEnable = false;

                    window.removeEventListener('touchend', unlock, false);
                }
            }, 0);
        };
        window.addEventListener('touchend', unlock, false);
    }

    get isSupportAudio() {
        return !audioContext && !html5Audio;
    }


    getAudioContext() {
        return audioContext;
    }

    getMasterGain() {
        return masterGain;
    }

    mute() {
        this.muted = true;
        return this;
    }

    unMute() {
        this.muted = false;
        return this;
    }

    isSupportCodec(fileExtension) {
        return !!this.data.codecs[fileExtension];
    }

    addSound(data) {
        new Sound(data, this);
        return this;
    }

    addAudio(data) {
        new Audio(data, this);
        return this;
    }

    addVideo(data) {
        //new Video(this, data);
        return this;
    }

    /**
     * @param {string} id
     * @returns {Sound}
     */
    sound(id) {
        return this.media.get('sounds').get(id);
    }

    audio(id) {
        return this.media.get('audios').get(id);
    }

    video(id) {
        return this.media.get('videos').get(id);
    }

    removeSound(id) {
        if (this.media.get('sounds').contains(id)) {
            this.media.get('sounds').get(id).stop();
            this.media.get('sounds').remove(id);
        }
        return this;
    }

    removeAudio(id) {
        if (this.media.get('audios').contains(id)) {
            this.media.get('audios').get(id).stop();
            this.media.get('audios').remove(id);
        }
        return this;
    }

    removeVideo(id) {
        if (this.media.get('videos').contains(id)) {
            this.media.get('videos').get(id).stop();
            this.media.get('videos').remove(id);
        }
        return this;
    }
}
