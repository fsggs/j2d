(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('media/Audio', ['utils/UUID', 'utils/Events'], factory);
    } else if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = factory(require('utils/UUID'), require('utils/Events'));
    } else {
        factory(root.j2d.utils.UUID, root.j2d.utils.Events);
    }
}(typeof window !== 'undefined' ? window : global, function (UUID, Events) {
    "use strict";

    var cache = {};
    var AudioNode = global.Audio;

    /**
     * @param {Audio.defaults|Object} [data]
     * @param {MediaManager} [manager]
     * @constructor
     */
    var Audio = function (data, manager) {
        var audio = this;
        audio.manager = manager !== undefined ? manager : null;
        audio.events = !!audio.manager ? audio.manager.events : new Events();
        audio.data = $.extend(true, {}, Audio.defaults, data);

        audio.audioNode = [];

        if (audio.data.id === null) {
            audio.data.id = UUID.generate();
        }

        if (audio.manager) audio.manager.media.get('audios').add(audio.data.id, audio);

        audio.load();
    };

    Audio.defaults = {
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

        loaded: false,
        onEndTimer: []
    };

    Audio.prototype._load = function (audio) {
        var audioNode = new AudioNode();

        audioNode.addEventListener('error', function () {
            console.error({type: audioNode.error ? audioNode.error.code : 0});
        }, false);

        audio.audioNode.push(audioNode);

        audioNode.src = audio.data.src;
        audioNode.pos = 0;
        audioNode.preload = 'auto';
        audioNode.volume = (!!audio.manager)
            ? (audio.manager.muted) ? 0 : audio.data.volume * (audio.manager.volume / 100)
            : (audio.data.muted) ? 0 : audio.data.volume;

        var listener = function () {
            audio.data.duration = Math.ceil(audioNode.duration * 10) / 10;

            if (Object.getOwnPropertyNames(audio.data.sprite).length === 0) {
                audio.data.sprite = {default: [0, audio.data.duration * 1000]};
            }

            if (!audio.data.loaded) {
                audio.data.loaded = true;
                audio.events.trigger('load');
            }

            if (audio.data.autoPlay) {
                audio.play();
            }

            audioNode.removeEventListener('canplaythrough', listener, false);
        };
        audioNode.addEventListener('canplaythrough', listener, false);
        audioNode.load();

        return audio;
    };

    Audio.prototype.load = function () {
        var audio = this;
        var url = '', extension = '';

        if (audio.manager && (!!audio.manager.isSupportAudio)) {
            console.warn('No audio support.');
            return false;
        }

        var extractFormat = function (source, format) {
            if (format) return format;

            var extension = /^data:audio\/([^;,]+);/i.exec(source);
            if (!extension) {
                extension = /\.([^.]+)$/.exec(source.split('?', 1)[0]);
            }

            if (extension) {
                return extension[1].toLowerCase();
            } else {
                console.warn('Could not extract format from passed URLs, please add format');
            }
            return null;
        };

        if (audio.data.src instanceof Array) {
            for (var i = 0; i < audio.data.src.length; i++) {
                url = audio.data.src[i];
                extension = extractFormat(audio.data.src[i], audio.data.format);
                if (null !== extension) break;
            }
            audio.data.src = url;
        } else if (typeof audio.data.src === 'string') {
            extension = extractFormat(audio.data.src, audio.data.format);
        } else {
            console.warn('Unknown audio source');
            return false;
        }

        if (audio.manager && audio.manager.isSupportCodec[extension]) {
            console.warn('Codec not support');
            return false;
        }

        return audio._load(audio);
    };

    Audio.prototype._unload = function (audioNode) {
        audioNode.src = '';
    };

    Audio.prototype.unload = function () {
        var audio = this;

        var nodes = audio.audioNode;
        for (var i = 0; i < audio.audioNode.length; i++) {
            if (!nodes[i].paused) {
                audio.stop(nodes[i].id);
                audio.events.trigger('end', nodes[i].id); // TODO:: unload
            }
            audio._unload(nodes[i]);
        }

        for (i = 0; i < audio.data.onEndTimer.length; i++) {
            clearTimeout(audio.data.onEndTimer[i].timer);
        }

        if (audio.manager) {
            var audios = this.manager.get('audios');
            var index = audios.indexOf(audio);
            if (index !== null && index >= 0) {
                audios.splice(index, 1);
            }
        }

        delete cache[audio.data.src];
        audio = null;
    };

    Audio.prototype.src = function (source) {
        var audio = this;

        if (source) {
            audio.stop();
            audio.data.src = source;
            audio.data.loaded = false;
            audio.load();
        } //TODO:: else throw

        return null;
    };

    Audio.prototype.play = function (sprite, callback) {
        var audio = this;

        if (typeof sprite === 'function') callback = sprite;
        if (!sprite || typeof sprite === 'function') sprite = 'default';

        if (!audio.data.loaded) {
            audio.events.on('load', function () {
                audio.play(sprite, callback);
            });

            return audio;
        }

        if (!audio.data.sprite[sprite]) {
            if (typeof callback === 'function') callback();
            return audio;
        }

        audio._inactiveNode(audio, function (node) {
            node.sprite = sprite;

            var pos = (node.pos > 0) ? node.pos : audio.data.sprite[sprite][0] / 1000;
            var duration = audio.data.sprite[sprite][1] / 1000 - (pos - audio.data.sprite[sprite][0] / 1000);
            var loop = !!(audio.data.loop || audio.data.sprite[sprite][2]);

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
                    if (loop) {
                        audio.stop(data.id).play(sprite, data.id);
                    } else {
                        audio.stop(data.id);
                    }

                    audio.events.trigger('end', soundId);
                }, (duration / audio.data.rate) * 1000);

                audio.data.onEndTimer.push({timer: timerId, id: data.id});
            })();


            if (node.readyState === 4 || !node.readyState && navigator.isCocoonJS) {
                node.id = soundId;
                node.currentTime = pos;

                node.muted = audio.manager
                    ? (audio.manager.muted || node.muted)
                    : (audio.data.muted || node.muted);

                node.volume = audio.manager
                    ? audio.data.volume * (audio.manager.volume / 100)
                    : audio.data.volume;

                setTimeout(function () {
                    node.play();
                }, 0);
            } else {
                audio._clearEndTimer(soundId);

                (function () {
                    var audio = audio,
                        playSprite = sprite,
                        fn = callback,
                        newNode = node;

                    var listener = function () {
                        audio.play(playSprite, fn);
                        newNode.removeEventListener('canplaythrough', listener, false);
                    };

                    newNode.addEventListener('canplaythrough', listener, false);
                })();

                return audio;
            }

            audio.events.trigger('play');
            if (typeof callback === 'function') callback(soundId);

            return audio;
        });

        return audio;
    };

    Audio.prototype._pause = function (activeNode) {
        activeNode.pause();
        return false;
    };

    Audio.prototype.pause = function (id) {
        var audio = this;

        if (!audio.data.loaded) {
            audio.events.on('play', function () {
                audio.pause(id);
            });
            return audio;
        }

        audio._clearEndTimer(audio, id);

        var activeNode = (id) ? audio._nodeById(id) : audio._activeNode(audio);
        if (activeNode) {
            activeNode.pos = audio.pos(null, id);
            var result = audio._pause(activeNode);
            if (result) return audio;
        }

        audio.events.trigger('pause');

        return audio;
    };

    Audio.prototype._stop = function (activeNode) {
        if (!isNaN(activeNode.duration)) {
            activeNode.pause();
            activeNode.currentTime = 0;
        }
        return false;
    };

    Audio.prototype.stop = function (id) {
        var audio = this;

        if (!audio.data.loaded) {
            audio.events.on('play', function () {
                audio.stop(id);
            });

            return audio;
        }

        audio._clearEndTimer(audio, id);

        var activeNode = (id) ? audio._nodeById(audio, id) : audio._activeNode(audio);
        if (activeNode) {
            activeNode.pos = 0;
            var result = audio._stop(activeNode);
            if (result) return audio;
        }

        return audio;
    };

    Audio.prototype._mute = function (activeNode) {
        activeNode.muted = true;
    };

    Audio.prototype.mute = function (id) {
        var audio = this;

        if (!audio.data.loaded) {
            audio.events.on('play', function () {
                audio.mute(id);
            });
            return audio;
        }

        var activeNode = (id) ? audio._nodeById(id) : audio._activeNode(audio);
        if (activeNode) audio._mute();

        return audio;
    };

    Audio.prototype._unMute = function (activeNode) {
        activeNode.muted = false;
    };

    Audio.prototype.unMute = function (id) {
        var audio = this;

        if (!audio.data.loaded) {
            audio.events.on('play', function () {
                audio.unMute(id);
            });
            return audio;
        }

        var activeNode = (id) ? audio._nodeById(id) : audio._activeNode(audio);
        if (activeNode) audio._unMute();

        return audio;
    };

    Audio.prototype._volume = function (activeNode, vol) {
        activeNode.volume = vol;
    };

    Audio.prototype.volume = function (vol, id) {
        var audio = this;

        vol = parseFloat(vol);

        if (vol >= 0 && vol <= 1) {
            audio.data.volume = vol;

            if (!audio.data.loaded) {
                audio.events.on('play', function () {
                    audio.volume(vol, id);
                });
                return audio;
            }

            var activeNode = (id) ? audio._nodeById(id) : audio._activeNode(audio);
            if (activeNode) {
                vol = audio.manager
                    ? vol * (audio.manager.volume / 100)
                    : audio.data.volume;
                audio._volume(vol);
            }

            return audio;
        }
        return audio.data.volume;
    };

    Audio.prototype.loop = function (loop) {
        var audio = this;

        if (typeof loop === 'boolean') {
            audio.data.loop = loop;
            return audio;
        }
        return audio.data.loop;
    };

    Audio.prototype.sprite = function (sprite) {
        var audio = this;

        if (typeof sprite === 'object') {
            audio.data.sprite = sprite;
            return audio;
        }
        return audio.data.sprite;
    };

    Audio.prototype._position = function (activeNode, v) {
        return activeNode.currentTime;
    };

    Audio.prototype.pos = function (pos, id) {
        var audio = this;

        if (!audio.data.loaded) {
            audio.events.on('load', function () {
                audio.pos(pos);
            });
            return typeof pos === 'number' ? audio : audio.data.pos || 0;
        }

        pos = parseFloat(pos);

        var activeNode = (id) ? audio._nodeById(id) : audio._activeNode(audio);
        if (activeNode) {
            if (pos >= 0) {
                audio.pause(id);
                activeNode.pos = pos;
                audio.play(activeNode.sprite, id);
                return audio;
            } else {
                return audio._position(activeNode, false);
            }
        } else if (pos >= 0) {
            return audio;
        } else {
            for (var i = 0; i < audio.audioNode.length; i++) {
                if (audio.audioNode[i].paused && audio.audioNode[i].readyState === 4) {
                    return audio._position(audio.audioNode[i], true);
                }
            }
        }
    };

    Audio.prototype._pos3d = function (activeNode, x, y, zsaz) {
        return null;
    };

    Audio.prototype.pos3d = function (x, y, z, id) {
        var audio = this;

        y = (typeof y === 'undefined' || !y) ? 0 : y;
        z = (typeof z === 'undefined' || !z) ? -0.5 : z;

        if (!audio.data.loaded) {
            audio.events.on('play', function () {
                audio.pos3d(x, y, z, id);
            });
            return audio;
        }

        if (x >= 0 || x < 0) {
            var activeNode = (id) ? audio._nodeById(id) : audio._activeNode(audio);
            audio._pos3d(activeNode, x, y, z);
        } else {
            return audio.data.pos3d;
        }

        return audio;
    };

    /* Private */

    Audio.prototype._nodeById = function (audio, id) {
        var node = audio.audioNode[0];

        for (var i = 0; i < audio.audioNode.length; i++) {
            if (audio.audioNode[i].id === id) {
                node = audio.audioNode[i];
                break;
            }
        }

        return node;
    };

    Audio.prototype._clearEndTimer = function (audio, id) {
        var index = -1;

        for (var i = 0; i < audio.data.onEndTimer.length; i++) {
            if (audio.data.onEndTimer[i].id === id) {
                index = i;
                break;
            }
        }

        var timer = audio.data.onEndTimer[index];
        if (timer) {
            clearTimeout(timer.timer);
            audio.data.onEndTimer.splice(index, 1);
        }
    };

    Audio.prototype._activeNode = function (audio) {
        var node = null;

        for (var i = 0; i < audio.audioNode.length; i++) {
            if (!audio.audioNode[i].paused) {
                node = audio.audioNode[i];
                break;
            }
        }

        audio._drainPool(audio);

        return node;
    };

    Audio.prototype._inactiveNode = function (audio, callback) {
        var node = null;

        for (var i = 0; i < audio.audioNode.length; i++) {
            if (audio.audioNode[i].paused && audio.audioNode[i].readyState === 4) {
                callback(audio.audioNode[i]);
                node = true;
                break;
            }
        }

        audio._drainPool(audio);

        if (node) return;

        audio.load();
        var newNode = audio.audioNode[audio.audioNode.length - 1];
        var listenerEvent = navigator.isCocoonJS ? 'canplaythrough' : 'loadedmetadata';
        var listener = function () {
            newNode.removeEventListener(listenerEvent, listener, false);
            callback(newNode);
        };
        newNode.addEventListener(listenerEvent, listener, false);
    };

    Audio.prototype._drainPool = function (audio) {
        var inactive = 0;

        for (var i = 0; i < audio.audioNode.length; i++) {
            if (audio.audioNode[i].paused) inactive++;
        }

        for (i = audio.audioNode.length - 1; i >= 0; i--) {
            if (inactive <= 5) break;

            if (audio.audioNode[i].paused) {
                audio.audioNode.splice(i, 1);
                inactive--;
            }
        }
    };

    if (typeof module === 'object' && typeof module.exports === 'object') module.exports.Audio = Audio;
    if (global.j2d === undefined) global.j2d.media.Audio = Audio;
    return Audio;
}));
