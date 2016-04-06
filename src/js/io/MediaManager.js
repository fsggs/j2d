/**
 * J2D (jQuery Canvas Graphic Engine plugin)
 *
 * @authors DeVinterX
 * @license BSD
 * @version 0.2.0-dev
 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('io/MediaManager', [
            'jquery',
            'utils/ArrayMap',
            'utils/Events',
            'media/Audio',
            'media/Sound'
        ], factory);
    } else if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = factory(
            require('jquery'),
            require('utils/ArrayMap'),
            require('utils/Events'),
            require('media/Audio'),
            require('media/Sound')
        );
    } else {
        factory(
            root.jQuery,
            root.ArrayMap,
            root.Events,
            root.Audio,
            root.Sound
        );
    }
}(typeof window !== 'undefined' ? window : global, function ($, ArrayMap, Events, Audio, Sound) {
    "use strict";

    var AudioNode = global.Audio;
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
     * @param {J2D} j2d
     * @param {MediaManager.defaults|Object|undefined} [data]
     * @constructor
     */
    var MediaManager = function (j2d, data) {
        if (data === undefined) data = {};
        var soundManager = this;
        this.j2d = j2d;
        this.data = $.extend(true, {}, MediaManager.defaults, data);
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

        Object.defineProperty(this, 'isSupportAudio', {
            get: function () {
                return !audioContext && !html5Audio;
            }
        });
    };

    MediaManager.defaults = {
        volume: 1,
        muted: false,
        codecs: {},
        iOSAutoEnable: true
    };

    MediaManager.prototype.getAudioContext = function () {
        return audioContext;
    };

    MediaManager.prototype.getMasterGain = function () {
        return masterGain;
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
        new Sound(data, this);
        return this;
    };

    MediaManager.prototype.addAudio = function (data) {
        new Audio(data, this);
        return this;
    };

    MediaManager.prototype.addVideo = function (data) {
        //new Video(this, data);
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
        return this.media.get('audios').get(id);
    };

    MediaManager.prototype.video = function (id) {
        return this.media.get('videos').get(id);
    };

    MediaManager.prototype.removeSound = function (id) {
        if (this.media.get('sounds').contains(id)) {
            this.media.get('sounds').get(id).stop();
            this.media.get('sounds').remove(id);
        }
        return this;
    };

    MediaManager.prototype.removeAudio = function (id) {
        if (this.media.get('audios').contains(id)) {
            this.media.get('audios').get(id).stop();
            this.media.get('audios').remove(id);
        }
        return this;
    };

    MediaManager.prototype.removeVideo = function (id) {
        if (this.media.get('videos').contains(id)) {
            this.media.get('videos').get(id).stop();
            this.media.get('videos').remove(id);
        }
        return this;
    };

    if (typeof module === 'object' && typeof module.exports === 'object') module.exports.MediaManager = MediaManager;
    if (global.J2D !== undefined) global.MediaManager = MediaManager;
    return MediaManager;
}));
