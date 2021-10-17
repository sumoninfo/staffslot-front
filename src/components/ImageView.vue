<template>
    <modal
        :is-visible="visible"
        @close="close"
    >
        <div class="player" :class="{ fs: fullScreen, fw: fullWindow, ve: verticalExpand, 'dt-safari': !isIOS && isSafari }" ref="container">
            <div class="main toolbar">
                <button @click="close"><i class="fa fa-close"></i></button>
                <button @click="toggleVerticalExpand"><i class="fa fa-arrows-v"></i></button>
                <button @click="toggleFullScreen()" class="fullscreen"><i class="fa fa-expand"></i></button>
            </div>
            <img :src="href">
        </div>
    </modal>
</template>

<script>
import helpers from '../mixins/helpers'

export default {
    mixins: [helpers],
    props: {
        href: String
    },

    data () {
        return {
            visible: true,
            fullScreen: false,
            fullWindow: false,
            verticalExpand: false
        }
    },

    computed: {
        isIOS () {
            const ua = window.navigator.userAgent;
            return ua.match(/iPad/i) || ua.match(/iPhone/i);
        },

        isSafari () {
            const ua = window.navigator.userAgent;
            return ua.match(/WebKit/i) && ua.match(/Safari/i) && !ua.match(/Chrome/i);
        }
    },

    mounted () {
        const h = e => {
            this.fullScreen = document.fullscreenElement ||
                document.webkitFullscreenElement ||
                document.mozFullscreenElement ||
                document.msFullscreenElement ? true : false;
        };

        document.addEventListener('fullscreenchange', h);
        document.addEventListener('webkitfullscreenchange', h);
        document.addEventListener('mozfullscreenchange', h);
        document.addEventListener('msfullscreenchange', h);
    },

    methods: {
        close () {
            if (this.fullScreen) {
                this.toggleFullScreen();
            } else if (this.fullWindow) {
                this.toggleFullWindow();
            } else {
                this.visible = false;
                this.$emit('close');
            }
        },

        toggleVerticalExpand () {
            this.verticalExpand =! this.verticalExpand;
        },

        toggleFullScreen () {
            if (this.fullScreen) {
                if (this.isIOS) return this.toggleFullWindow();
                else if (document.exitFullscreen) document.exitFullscreen();
                else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
                else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
                else if (document.msExitFullscreen) document.msExitFullscreen();
            } else {
                const container = this.$refs.container;

                if (this.isIOS) return this.toggleFullWindow();
                else if (container.requestFullscreen) container.requestFullscreen();
                else if (container.webkitRequestFullscreen) container.webkitRequestFullscreen();
                else if (container.mozRequestFullScreen) container.mozRequestFullScreen();
                else if (container.msRequestFullscreen) container.msRequestFullscreen();
            }

            this.fullScreen =! this.fullScreen;
        },

        toggleFullWindow () {
            this.fullWindow =! this.fullWindow;
        }
    }
}
</script>

<style scoped>
    img {
        max-width: 100%;
        max-height: 100%;
    }

    .fs img, .fw img {
        position: absolute;
        top: 0;
        bottom: 0;
        right: 0;
        left: 0;
        margin: auto;
    }

    .ve img {
        object-fit: cover;
        height: 100%;
    }

    .dt-safari.ve img {
        height: 50%;
    }

    .fs .toolbar {
        position: fixed;
    }
</style>