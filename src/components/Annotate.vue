<template>
    <div v-if="enabled">
        <paintable
            :active="true"
            :width="pWidth"
            :height="pHeight"
            :disableNavigation="true"
            :hide="false"
            :horizontalNavigation="true"
            :name="true ? 'my-screen' : 'my-second-screen'"
            :factor="1"
            :lineWidth="5"
            :lineWidthEraser="20"
            :useEraser="false"
            color="#000"
            class="paint"
            :class="{ fs: fullScreen }"
            ref="paintable"
        >
        </paintable>
        <div v-if="!isIOSSafari" class="annotate toolbar" :class="{ fs: fullScreen }">
            <button @click="send"><i class="fa fa-paper-plane"></i></button>
            <button @click="toggleEraserAndPencil" :class="{ active: paintableView && paintableView.isEraserActive }"><i class="fa fa-eraser"></i></button>
            <button @click="clear"><i class="fa fa-trash"></i></button>
            <button @click="undo"><i class="fa fa-undo"></i></button>
            <button @click="redo"><i class="fa fa-undo" style="transform: scaleX(-1);"></i></button>
            <button @click="openLineWidthPicker" :class="{ active: isLineWidthPickerOpen }"><i class="fa fa-sliders"></i></button>
            <button @click="openColorPicker" :class="{ active: isColorPickerOpen }"><i class="fa fa-eyedropper"></i></button>
        </div>

        <div class="color-picker" v-if="paintableView && isColorPickerOpen">
            <span
                :class="[
                    'color-picker-color',
                    { selected: paintableView.currentColor === color }
                ]"
                v-for="color in paintableView.colors"
                :key="color"
                :style="{ backgroundColor: color }"
                @click="changeColor(color)"
            ></span>
        </div>

        <div class="line-width-picker" v-if="paintableView && isLineWidthPickerOpen">
            <label for="line-width-picker-range">({{ paintableView.currentLineWidth }}px):</label>
            <br />
            <input
                id="line-width-picker-range"
                type="range"
                min="1"
                max="100"
                v-model="paintableView.currentLineWidth"
                @change="isLineWidthPickerOpen = false"
            />
            <div class="line-width-picker-dot" :style="lineWidthStyle"></div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import Paintable from '../components/Paintable.vue';
import helpers from '../mixins/helpers'

export default {
    mixins: [helpers],
    props: {
        enabled: Boolean,
        fullScreen: Boolean,
        annotable: {
            default: null
        }
    },

    components: {
        Paintable
    },

    data () {
        return {
            isColorPickerOpen: false,
            isLineWidthPickerOpen: false,
            paintableView: null
        }
    },

    computed: {
        isIOSSafari () {
            const ua = window.navigator.userAgent;
            const iOS = ua.match(/iPad/i) || ua.match(/iPhone/i);
            return iOS && ua.match(/WebKit/i) && !ua.match(/CriOS/i);
        },

        pWidth () {
            return document.getElementsByTagName('video')[0].videoWidth;
        },

        pHeight () {
            return document.getElementsByTagName('video')[0].videoHeight;
        },

        lineWidthStyle() {
            return {
                height: this.paintableView.currentLineWidth + 'px',
                width: this.paintableView.currentLineWidth + 'px',
                backgroundColor: this.paintableView.currentColor
            };
        },

        toolbar () {
            return {
                mainToolbar: {
                    erase: {
                        icon: 'fa fa-eraser',
                        action: () => { this.toggleEraserAndPencil(); this.$emit('set-toolbar', { toolbar: 'mainToolbar', items: this.toolbar.mainToolbar }) },
                        isActive: this.paintableView && this.paintableView.isEraserActive
                    },
                    delete: {
                        icon: 'fa fa-trash',
                        action: this.clear
                    },
                    send: {
                        icon: 'fa fa-paper-plane',
                        action: this.send
                    }
                },
                secondaryToolbar: {
                    color: {
                        icon: 'fa fa-eyedropper',
                        action: () => { this.openColorPicker(); this.$emit('set-toolbar', { toolbar: 'secondaryToolbar', items: this.toolbar.secondaryToolbar }) },
                        isActive: this.isColorPickerOpen
                    },
                    width: {
                        icon: 'fa fa-sliders',
                        action: () => { this.openLineWidthPicker(); this.$emit('set-toolbar', { toolbar: 'secondaryToolbar', items: this.toolbar.secondaryToolbar }) },
                        isActive: this.isLineWidthPickerOpen
                    },
                    undo: {
                        icon: 'fa fa-undo',
                        action: this.undo
                    },
                    redo: {
                        icon: 'fa fa-undo',
                        style: 'transform: scaleX(-1);',
                        action: this.redo
                    }
                }
            }
        }
    },

    updated () {
        this.paintableView = this.$refs.paintable;
        this.resize();

        if (this.isIOSSafari) {
            this.$emit('set-toolbar', { toolbar: 'mainToolbar', items: this.paintableView ? this.toolbar.mainToolbar : {} });
            this.$emit('set-toolbar', { toolbar: 'secondaryToolbar', items: this.paintableView ? this.toolbar.secondaryToolbar : {} });
        }
    },

    mounted () {
        window.addEventListener('resize', e => {
            this.resize();
        });
    },

    methods: {
        toggleEraserAndPencil() {
            this.paintableView.isEraserActive = !this.paintableView.isEraserActive;
            this.$forceUpdate();
        },

        openColorPicker() {
            this.isColorPickerOpen = !this.isColorPickerOpen;
            this.isLineWidthPickerOpen = false;
        },

        openLineWidthPicker() {
            this.isLineWidthPickerOpen = !this.isLineWidthPickerOpen;
            this.isColorPickerOpen = false;
        },

        changeColor(color) {
            this.paintableView.currentColor = color;
            this.paintableView.tempCtx.strokeStyle = this.paintableView.currentColor;
            this.paintableView.ctx.strokeStyle = this.paintableView.currentColor;
            this.isColorPickerOpen = false;
        },

        undo () {
            this.paintableView.undoDrawingStep();
        },

        redo () {
            this.paintableView.redoDrawingStep();
        },

        clear () {
            this.paintableView.clearCanvas();
        },

        resize () {
            if (this.paintableView) {
                const videoTag = document.getElementsByClassName('video-tag')[0];
                const width = videoTag.clientWidth;
                const height = videoTag.clientHeight;
                const videoWidth = videoTag.videoWidth;
                const videoHeight = videoTag.videoHeight;
                const videoAR = videoWidth/videoHeight;
                let widthAR = width;
                let heightAR = height;

                const isHorizontalVideo = videoWidth >= videoHeight;
                if (isHorizontalVideo) {
                    heightAR = width/videoAR;
                }

                for (let i=0; i<2; i++) {
                    this.paintableView.$el.getElementsByTagName('canvas')[i].style.width = widthAR + 'px';
                    this.paintableView.$el.getElementsByTagName('canvas')[i].style.height = heightAR + 'px';
                }
            }
        },

        async send () {
            const canvas = this.$refs.paintable.$el.getElementsByTagName('canvas')[0];
            const ctx = canvas.getContext('2d');
            const inMemCanvas = document.createElement('canvas');
            const inMemCtx = inMemCanvas.getContext('2d');

            inMemCanvas.width = this.annotable.videoWidth;
            inMemCanvas.height = this.annotable.videoHeight;
            this.annotable && inMemCtx.drawImage(this.annotable, 0, 0, inMemCanvas.width, inMemCanvas.height);
            inMemCtx.drawImage(canvas, 0, 0, inMemCanvas.width, inMemCanvas.height);

            const dataURL = inMemCanvas.toDataURL();

            this.$emit('loading', true);
            const response = await axios.post('/api/post64image', {
                image: dataURL
            });

            this.emitter.emit('annotation', response.data.image);
            this.$emit('loading', false);
            this.$emit('message', 'Annotation successfully sent to the chat');

            setTimeout(() => {
                this.$emit('message', null);
            }, 3000);
        }
    }
}
</script>

<style scoped>
    .line-width-picker {
        background-color: #00000094;
        position: absolute;
        left: 10px;
        top: 60px;
        padding: 12px;
        border-radius: 5px;
        box-sizing: border-box;
    }

    .fs .line-width-picker, .fw .line-width-picker {
        left: 10px;
        top: 100px;
        z-index: 2147483647;
    }

    .ios-safari .line-width-picker {
        left: 60px;
        top: 10px;
    }

    .line-width-picker-dot {
        margin-top: 10px;
        border-radius: 100%;
        -webkit-box-shadow: 0px 0px 5px 1px rgba(255,255,255,0.33);
        -moz-box-shadow: 0px 0px 5px 1px rgba(255,255,255,0.33);
        box-shadow: 0px 0px 5px 1px rgba(255,255,255,0.33);
    }

    .line-width-picker-color {
        border-radius: 100%;
        height: 15px;
        width: 15px;
        display: block;
        margin: 0 0 10px;
        border: 2px solid transparent;
    }

    .line-width-picker-color:last-child {
        margin: 0;
    }

    .line-width-picker-color.selected {
        border: 2px solid #fff;
    }

    .color-picker {
        background-color: #00000094;
        position: absolute;
        left: 10px;
        top: 60px;
        padding: 12px;
        border-radius: 5px;
    }

    .fs .color-picker, .fw .color-picker {
        left: 10px;
        top: 100px;
        z-index: 2147483647;
    }

    .ios-safari .color-picker {
        left: 60px;
        top: 10px;
        z-index: 2147483647;
    }

    .color-picker-color {
        border-radius: 100%;
        height: 15px;
        width: 15px;
        display: block;
        margin: 0 0 10px;
        border: 2px solid transparent;
        -webkit-box-shadow: 0px 0px 5px 1px rgba(255,255,255,0.33);
        -moz-box-shadow: 0px 0px 5px 1px rgba(255,255,255,0.33);
        box-shadow: 0px 0px 5px 1px rgba(255,255,255,0.33);
    }

    .color-picker-color:last-child {
        margin: 0;
    }

    .color-picker-color.selected {
        border: 2px solid #fff;
    }
</style>