<template>
    <div class="player"
        :class = "{
            mw: !fullWindow,
            fs: fullScreen,
            fw: fullWindow,
            ve: verticalExpand,
            sm: playerWidth < 320,
            md: playerWidth >= 320 && playerWidth <= 990,
            'ios-safari': isIOSSafari
        }"
        @mouseover="controlsVisible = true"
        @mouseleave="controlsVisible = true"
        ref="container"
    >
        <video id="video" @click="spaceClicked" class="video-tag" :class="{ fs: fullScreen, fw: fullWindow }" playsinline crossOrigin="Anonymous" controlslist="nodownload"></video>
        <div class="time" v-if="controlsVisible && videoTag && screenWidth < 480">
            <span>{{ formatTime(videoTag.currentTime) }}</span>
            /
            <span>{{ formatTime(videoTag.duration) }}</span>
        </div>
        <annotate
            :enabled="annotateMode"
            :fullScreen="fullScreen || fullWindow"
            :annotable="videoTag"
            @message="message = $event"
            @loading="loading = $event"
            @set-toolbar="setToolbar"
        />
        <div class="controls" :class="{ fs: fullScreen, 'safari-desktop': isDesktopSafari, test: true }" v-if="controlsVisible && videoTag">
            <button class="play-pause" @click="playPause"><i class="fa" :class="paused || !started ? 'fa-play' : 'fa-pause'"></i></button>
            <div class="player-progress">
                <span v-if="screenWidth >= 480">{{ formatTime(videoTag.currentTime) }}</span>
                <input type="range" @input="seek($event)" :value="progress.value" :min="progress.min" :max="progress.max">
                <span v-if="screenWidth >= 480">{{ formatTime(videoTag.duration) }}</span>
            </div>
            <div class="speed dropdown">
                <button @click="speedControlsVisible = true; dropdown($event)"><i class="fa fa-tachometer"></i></button>
                <div class="dropdown-content" v-if="speedControlsVisible">
                    <div @click="setSpeed(0.25); speedControlsVisible = false;" :class="videoTag.playbackRate == 0.25 ? 'active' : ''">0.25</div>
                    <div @click="setSpeed(0.5); speedControlsVisible = false;" :class="videoTag.playbackRate == 0.5 ? 'active' : ''">0.5</div>
                    <div @click="setSpeed(0.75); speedControlsVisible = false;" :class="videoTag.playbackRate == 0.75 ? 'active' : ''">0.75</div>
                    <div @click="setSpeed(1); speedControlsVisible = false;" :class="videoTag.playbackRate == 1 ? 'active' : ''">{{ __('Normal') }}</div>
                    <div @click="setSpeed(1.25); speedControlsVisible = false;" :class="videoTag.playbackRate == 1.25 ? 'active' : ''">1.25</div>
                    <div @click="setSpeed(1.5); speedControlsVisible = false;" :class="videoTag.playbackRate == 1.5 ? 'active' : ''">1.5</div>
                    <div @click="setSpeed(1.75); speedControlsVisible = false;" :class="videoTag.playbackRate == 1.75 ? 'active' : ''">1.75</div>
                    <div @click="setSpeed(2); speedControlsVisible = false;" :class="videoTag.playbackRate == 2 ? 'active' : ''">2</div>
                </div>
            </div>
            <div class="volume" v-if="!isIOSSafari && screenWidth >= 480">
                <button><i class="fa fa-volume-up"></i></button>
                <input type="range" @input="volume($event)" step="0.01" :value="videoTag ? videoTag.volume : 0" min="0" max="1">
            </div>
            <div class="dropdown" v-if="!isIOSSafari && screenWidth < 480">
                <button @click="verticalVolumeVisible = true;"><i class="fa fa-volume-up"></i></button>
                <div class="dropdown-content" v-if="verticalVolumeVisible"  style="transform: rotate(-90deg) translate(30px, 30px); width: 100px;">
                    <input type="range" @input="volume($event)" step="0.01" :value="videoTag ? videoTag.volume : 0" min="0" max="1">
                </div>
            </div>
            <button @click="toggleFullScreen()" class="fullscreen"><i class="fa fa-expand"></i></button>
        </div>
        <div class="main toolbar" v-if="controlsVisible && videoTag">
            <button @click="close"><i class="fa fa-close"></i></button>
            <button v-if="fullScreen || fullWindow" @click="toggleVerticalExpand"><i class="fa fa-arrows-v"></i></button>
            <button v-if="annotations && videoLoaded" @click="annotate" :class="{ active: annotateMode }"><i class="fa fa-paint-brush"></i></button>
            <button
                v-for="(item, key) in mainToolbar"
                :key="key"
                :class="{ active: item.isActive }"
                :style="item.style"
                @click="item.action"
            ><i :class="item.icon"></i></button>
        </div>
        <div class="secondary toolbar" v-if="controlsVisible && videoTag">
            <button
                v-for="(item, key) in secondaryToolbar"
                :key="key"
                :class="{ active: item.isActive }"
                :style="item.style"
                @click="item.action"
            ><i :class="item.icon"></i></button>
        </div>
        <div class="message text-center" v-if="message">
            {{ message }}
        </div>
        <div v-if="loading" class="spinner-border text-light" role="status" style="position: absolute; margin: auto; top: 0; left: 0; right: 0; bottom: 0; width: 3rem; height: 3rem; z-index: 2147483647;">
            <span class="sr-only">{{ __('Loading') }}...</span>
        </div>
    </div>
</template>

<script>
import Annotate from './Annotate.vue';
import Hls from 'hls.js';
import filters from '../mixins/filters';
import helpers from '../mixins/helpers';

export default {
    mixins: [ filters, helpers ],

    props: {
        video: {
            type: Object
        }
    },

    components: {
        Annotate
    },

    data () {
        return {
            screenWidth: window.innerWidth,
            playerWidth: null,
            videoTag: null,
            hls: null,
            qualities: null,
            quality: 2,
            progress: {
                min: 0,
                max: 0,
                value: 0
            },
            controlsVisible: true,
            qualitiesVisible: false,
            speedControlsVisible: false,
            verticalVolumeVisible: false,
            loading: false,
            videoLoaded: false,
            message: null,
            paused: false,
            started: false,
            ended: false,
            annotations: false,
            annotateMode: false,
            fullScreen: false,
            fullWindow: false,
            verticalExpand: false,
            mainToolbar: {},
            secondaryToolbar: {}
        }
    },

    computed: {
        isIOSSafari () {
            const ua = window.navigator.userAgent;
            const iOS = ua.match(/iPad/i) || ua.match(/iPhone/i);
            return iOS && ua.match(/WebKit/i) && !ua.match(/CriOS/i);
        },

        isIOS () {
            const ua = window.navigator.userAgent;
            return ua.match(/iPad/i) || ua.match(/iPhone/i);
        },

        isDesktopSafari () {
            const ua = window.navigator.userAgent;
            const iOS = !!ua.match(/iPad/i) || !!ua.match(/iPhone/i);
            return !iOS && ua.match(/WebKit/i) && ua.match(/Safari/i) && !ua.match(/Chrome/i);
        },

        isSafari () {
            const ua = window.navigator.userAgent;
            return ua.match(/WebKit/i) && ua.match(/Safari/i) && !ua.match(/Chrome/i);
        }
    },

    watch: {
        video: {
            immediate: true,
            handler () {
                setTimeout(() => this.load(this.video), 100)
            }
        }
    },

    mounted () {
        this.annotations = this.$route && this.$route.name == 'videoBooking';

        this.$nextTick(function() {
            window.addEventListener('resize', e => {
                if (this.$refs.container) {
                    this.screenWidth = window.innerWidth;
                    this.playerWidth = this.$refs.container.offsetWidth;
                }
            });
        })

        this.videoTag = document.getElementById('video')
        const _this = this

        this.videoTag.addEventListener('loadstart', () => this.loading = true);

        this.videoTag.addEventListener('canplay', () => {
            this.loading = false;
            this.videoLoaded = true;
        });

        this.videoTag.addEventListener('play', () => {
            _this.paused = false
            _this.ended = false
            _this.progress.max = null
        }, false);

        this.videoTag.addEventListener('pause', () => {
            _this.paused = true
        }, false);

        this.videoTag.addEventListener('timeupdate', () => {
            if (!_this.progress.max) _this.progress.max = Math.floor(_this.videoTag.duration)
            _this.progress.value = _this.videoTag.currentTime
        });

        const h = e => {
            this.fullScreen = document.fullscreenElement ||
                document.webkitFullscreenElement ||
                document.mozFullscreenElement ||
                document.msFullscreenElement ? true : false;
                window.dispatchEvent(new Event('resize'));
        };

        document.addEventListener('fullscreenchange', h);
        document.addEventListener('webkitfullscreenchange', h);
        document.addEventListener('mozfullscreenchange', h);
        document.addEventListener('msfullscreenchange', h);

        this.playerWidth = this.$refs.container.offsetWidth;
    },

    beforeDestroy () {
        this.hls.destroy();

        if (this.playPromise) {
            this.playPromise.catch(() => {})
        }
    },

    methods: {
        load (video) {
            const _this = this
            if(Hls.isSupported() && !this.isSafari) {
                const hls = new Hls()
                this.hls = hls;
                hls.loadSource(video.stream)
                hls.attachMedia(this.videoTag)
                hls.on(Hls.Events.MANIFEST_PARSED, function() {
                    _this.playPromise = _this.videoTag.play()
                    _this.started = true
                    _this.qualities = hls.levels
                });
            }
            else if (this.videoTag.canPlayType('application/vnd.apple.mpegurl')) {
                this.videoTag.src = video.stream;
                this.videoTag.addEventListener('loadedmetadata',function() {
                    _this.videoTag.play();
                    _this.started = true;
                });
            }
        },

        playPause () {
            if (this.paused || this.ended) this.videoTag.play();
            else this.videoTag.pause();
        },

        seek (e) {
            this.videoTag.currentTime = e.target.value;
        },

        volume (e) {
            this.videoTag.volume = e.target.value;
        },

        toggleFullScreen () {
            if (this.fullScreen) {
                if (this.isIOS) this.toggleFullWindow();
                else if (document.exitFullscreen) document.exitFullscreen();
                else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
                else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
                else if (document.msExitFullscreen) document.msExitFullscreen();
            } else {
                if (this.isIOS) this.toggleFullWindow();
                else if (this.$el.requestFullscreen) this.$el.requestFullscreen();
                else if (this.videoTag.webkitEnterFullscreen) this.videoTag.webkitEnterFullscreen();
                else if (this.$el.mozRequestFullScreen) this.$el.mozRequestFullScreen();
                else if (this.$el.msRequestFullscreen) this.$el.msRequestFullscreen();
            }
        },

        toggleFullWindow () {
            this.fullWindow =! this.fullWindow;
            this.$nextTick(function() {
                window.dispatchEvent(new Event('resize'));
            });
        },

        toggleVerticalExpand () {
            this.verticalExpand =! this.verticalExpand;
            this.$nextTick(function() {
                window.dispatchEvent(new Event('resize'));
            });
        },

        setSpeed (value) {
            this.videoTag.playbackRate = value;
        },

        setQuality (i) {
            this.hls.currentLevel = i
        },

        annotate () {
            this.annotateMode =! this.annotateMode;
        },

        close () {
            if (this.fullScreen) {
                this.toggleFullScreen();
            } else if (this.fullWindow) {
                this.toggleFullWindow();
            } else {
                this.emitter.emit('close-player');
                this.emitter.emit('close-modal', { modalId: 'player' });
            }
        },

        spaceClicked () {
            if (this.speedControlsVisible || this.verticalVolumeVisible) {
                this.speedControlsVisible = false;
                this.verticalVolumeVisible = false;
            } else {
                this.playPause();
            }

        },

        dropdown (el) {
            setTimeout(() => {
                el.target.parentElement.parentElement.getElementsByClassName('dropdown-content')[0].style.maxHeight = this.videoTag.clientHeight * 0.5 + 'px';
            }, 100);
        },

        callPaintable (method) {
            this.$refs.paintable[method]();
        },

        setToolbar (data) {
            this[data.toolbar] = data.items;
        }
    }
}
</script>

<style scoped>
    #video {
        display: block;
    }
    #video::after {
        content: "Loading";
    }

    .big-player video {
        height: 72vh;
    }
</style>
