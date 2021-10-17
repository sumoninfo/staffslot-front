<template>
    <div class="video-preview" @click="play">
        <div v-if="video.status == 'complete'"
            ref="previewBox"
            @mouseenter="startThumbCycling(video)"
            @mouseleave="stopThumbCycling(video)"
            class="vthumb card-img-top"
            style="object-fit: cover; height: 100%; cursor: pointer;"
            :style="{
                'background-image': 'url(' + getPreview(video) + ')',
                'background-repeat': 'no-repeat',
                'background-position': thumbCycling && previewIndex ? (offsetX + 'px' + ' ' + offsetY + 'px') : 'center',
                'background-size': thumbCycling && previewIndex ? newWidth + 'px ' + newHeight + 'px' : 'cover'}">
            <div v-if="loadingPreviews" class="spinner-border text-light" role="status" style="position: absolute; margin: auto; top: 0; left: 0; right: 0; bottom: 0; width: 3rem; height: 3rem;">
                <span class="sr-only">{{ __('Loading') }}...</span>
            </div>
            <div v-if="thumbCycling" class="thumb-num">
                <div v-for="i in multi.meta.count"
                    :style="'background-color: ' + (previewIndex == i ? 'rgb(18, 129, 254, 0.5);' : 'rgba(227, 227, 227, 0.5);') + 'width: calc(' +  100/multi.meta.count + '% - 2px); height: 10px; display: inline-table; margin: 1px;'"></div>
            </div>
        </div>
        <div v-else class="card-img-top text-center processing">
            <span class="status" v-html="video.status"></span>
        </div>
        <i v-if="showVideoIcon" class="fa fa-video-camera" style="position: absolute; top: 3px; left: 6px; color: #fff; text-shadow: 0px 0px 5px #000000;"></i>
    </div>
</template>

<script>
    import axios from 'axios'
    import helpers from '../mixins/helpers'

    export default {
        mixins: [helpers],
        props: {
            video: Object,
            playable : {
                type: Boolean,
                default: true
            },
            showVideoIcon: {
                type: Boolean,
                default: false
            }
        },

        data () {
            return {
                cols: 0,
                rows: 0,
                newWidth: 0,
                newHeight: 0,
                offsetX: 0,
                offsetY: 0,
                loadingPreviews: false,
                previewIndex: null,
                thumbBody: null,
                thumbCycling: false,
                thumbsInterval: null,
                multi: null
            }
        },

        methods: {
            getBoxSize () {
                return {
                    width: this.$refs.previewBox.clientWidth,
                    height: this.$refs.previewBox.clientHeight
                }
            },

            getPreview (video) {
                const multi = video.previews.find(x => x.type === 'multi');

                if (multi && this.thumbCycling && this.previewIndex) {
                    return this.thumbBody ? 'data:image/jpeg;base64,' + this.base64Encode(this.thumbBody) : multi.url;
                }

                // Show second image as preview because first is often blank,
                // if there is only one image (apart from image with all previews if it exists) - show it (index 0)
                const i = video.previews.length - ( multi ? 1 : 0 ) == 1 ? 0 : 1;

                try {
                    return video.previews.length ? video.previews[i].url : 'https://timeslotpro-videos.s3.us-east-2.amazonaws.com/output/' +
                        this.video.video_id + '/Thumbnails/t.0000000.jpg';
                } catch (e) {}
            },

            async downloadPreview (url) {
                this.loadingPreviews = true;

                return new Promise(async (resolve, reject) => {
                    const request = new XMLHttpRequest();

                    request.onload = () => {
                        this.thumbBody = request.responseText;
                        this.loadingPreviews = false;
                        resolve();
                    }

                    request.open("GET", url, true);
                    request.overrideMimeType('text/plain; charset=x-user-defined'); 
                    request.send(null);
                });
            },

            async downloadPreview1 (url) {
                this.loadingPreviews = true;

                return new Promise(async (resolve, reject) => {
                    const response = await axios.get(url, {
                        headers: {
                            'Content-Type': 'text/plain; charset=x-user-defined'
                        },
                        data: {}
                    });

                    this.thumbBody = response.data;
                    this.loadingPreviews = false;
                    resolve();
                });
            },

            async startThumbCycling (video) {
                const multi = this.multi = video.previews.find(x => x.type === 'multi');
                if (!multi) return;

                const count = multi.meta.count;
                if (count <= 1) return;

                this.cols = multi.meta.cols;
                this.rows = Math.ceil(count / multi.meta.cols);
                this.multi.meta.aspectRatio = (this.multi.meta.width * this.cols) / (this.multi.meta.height * this.rows);
                this.newWidth = (this.getBoxSize().width+1) * this.cols;
                this.newHeight = (this.getBoxSize().height+1) * this.rows;

                if (this.getBoxSize().width <= this.getBoxSize().height) {
                    this.newWidth = this.newHeight * this.multi.meta.aspectRatio;
                } else { // horizontal thumb
                    const h = this.newWidth / this.multi.meta.aspectRatio;
                    if (h < this.getBoxSize().height){
                        this.newWidth = this.newHeight * this.multi.meta.aspectRatio;
                    } else {
                        this.newHeight = h;
                    }
                }

                this.thumbCycling = true;

                await this.downloadPreview(multi.url);

                if (this.thumbsInterval === null && this.thumbCycling) {
                    const int = () => {
                        if (this.previewIndex === undefined) {
                            this.previewIndex = 1;
                        } else {
                            if (this.previewIndex < count)
                                this.previewIndex += 1;
                            else
                                this.previewIndex = 1;
                        }

                        const cols = this.cols;
                        const rows = this.rows;
                        let currentCol = this.previewIndex%cols;
                        let currentRow = Math.floor(this.previewIndex / cols);
                        if (currentCol == 0) currentCol = cols;
                        if (this.previewIndex % cols == 0) currentRow--;

                        this.offsetX = -1 * (this.newWidth/cols) * currentCol + (this.newWidth/cols);
                        this.offsetY = -1 * this.getBoxSize().height * currentRow;

                        if (this.getBoxSize().width <= this.getBoxSize().height) {
                            this.offsetX -= (this.newWidth/cols - this.getBoxSize().width) / 2;
                        } else { // horizontal thumb
                            this.offsetY -= (this.newHeight/rows - this.getBoxSize().height) / 2;
                            this.offsetX -= (this.newWidth/cols - this.getBoxSize().width) / 2;
                        }

                        this.$forceUpdate();
                    }

                    int();
                    this.thumbsInterval = setInterval(int, 1000);
                }
            },

            stopThumbCycling (video) {
                this.offsetX = 0;
                this.offsetY = 0;
                this.previewIndex = 0;
                this.thumbCycling = false;
                this.loadingPreviews = false;
                clearInterval(this.thumbsInterval);
                this.thumbsInterval = null;
            },

            play () {
                if (this.playable) {
                    this.emitter.emit('play-video', this.video);
                }
            },

            base64Encode (inputStr) {
               var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
               var outputStr = "";
               var i = 0;

               while (i < inputStr.length) {
                   //all three "& 0xff" added below are there to fix a known bug
                   //with bytes returned by xhr.responseText
                   var byte1 = inputStr.charCodeAt(i++) & 0xff;
                   var byte2 = inputStr.charCodeAt(i++) & 0xff;
                   var byte3 = inputStr.charCodeAt(i++) & 0xff;

                   var enc1 = byte1 >> 2;
                   var enc2 = ((byte1 & 3) << 4) | (byte2 >> 4);

                   var enc3, enc4;
                   if (isNaN(byte2)) {
                       enc3 = enc4 = 64;
                   } else {
                       enc3 = ((byte2 & 15) << 2) | (byte3 >> 6);
                       if (isNaN(byte3)) {
                           enc4 = 64;
                       } else {
                           enc4 = byte3 & 63;
                       }
                   }

                   outputStr += b64.charAt(enc1) + b64.charAt(enc2) + b64.charAt(enc3) + b64.charAt(enc4);
                }

                return outputStr;
            }
        }
    }
</script>

<style scoped>
    .video-preview {
        position: relative;
    }

    .card-img-top.processing {
        display: table;
        background-color:  #333;
        height: 100%;
    }

    .card-img-top.processing .status {
        display: table-cell;
        vertical-align: middle;
    }

    .video-preview .thumb-num {
        position: absolute;
        padding: 0 10px;
        bottom: 0;
        left: 0;
        right: 0;
    }

    .video-preview .card-img-top {
        min-width: 105px;
        border-radius: calc(.25rem - 1px) !important;
    }

    .media-body {
    margin-left: 28px;
    }

    h5.mt-0 {
    text-align: left;
    }

/*    .video-library .video-preview .card-img-top {
        border-radius: 0;
        border-top-left-radius: calc(0.25rem - 1px);
        border-top-right-radius: calc(0.25rem - 1px);
    }
*/
    .video-library .card-img-top.processing {
        min-height: 200px;
    }
</style>
