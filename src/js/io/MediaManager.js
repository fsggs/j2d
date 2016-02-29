/**
 * J2D (jQuery Canvas Graphic Engine plugin)
 *
 * @authors DeVinterX, Skaner(j2Ds)
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

        model: null
    };

    /**
     * @private
     * @returns {Object}
     */
    Sound.prototype.setupAudioNode = function () {
        var sound = this,
            node = sound.audioNode,
            index = sound.audioNode.length;

        // create gain node
        node[index] = (audioContext.createGain === undefined)
            ? audioContext.createGainNode()
            : audioContext.createGain();

        node[index].gain.value = this.data.volume;
        node[index].paused = true;
        node[index].pos = 0;
        node[index].readyState = 4;
        node[index].connect(masterGain);

        // create the panner
        node[index].panner = audioContext.createPanner();
        node[index].panner.panningModel = this.data.model || 'equalpower';
        node[index].panner.setPosition(this.data.pos3d[0], this.data.pos3d[1], this.data.pos3d[2]);
        node[index].panner.connect(node[index]);

        return node[index];
    };

    Sound.prototype.load = function () {
    };

    Sound.prototype.urls = function () {
    };
    Sound.prototype.play = function () {
    };
    Sound.prototype.pause = function () {
    };
    Sound.prototype.stop = function () {
    };
    Sound.prototype.mute = function () {
    };
    Sound.prototype.unMute = function () {
    };
    Sound.prototype.volume = function () {
    }; // TODO:: @Property
    Sound.prototype.loop = function () {
    }; // TODO:: @Property
    Sound.prototype.sprite = function () {
    }; // TODO:: @Property
    Sound.prototype.pos = function () {
    };
    Sound.prototype.pos3d = function () {
    };

    Sound.prototype.unload = function () {
    };


    /* MediaManager */

    /**
     * @param {J2D} j2d
     * @param {MediaManager.defaults|Object|undefined} data
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

        if (!audioContext && html5Audio) {
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
                if (audioContext
                    && (soundManager.iOSEnabled || !/iPhone|iPad|iPod/i.test(navigator.userAgent))) {
                    return;
                }
                soundManager.iOSEnabled = false;

                var unlock = function () {
                    var buffer = ctx.createBuffer(1, 1, 22050);
                    var source = ctx.createBufferSource();
                    source.buffer = buffer;
                    source.connect(ctx.destination);

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

    MediaManager.prototype.sound = function (id) {
    };
    MediaManager.prototype.audio = function (id) {
    };
    MediaManager.prototype.video = function (id) {
    };

    MediaManager.prototype.removeSound = function (id) {
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

