<template>
    <div ref="container">
        <div style="max-height: 55vh; overflow-y: scroll; margin-top: 10px;">
            <video-list ref="videoList" previewWidth="100" v-model="choosedVideo" :multiple="multiple" />
        </div>
        <hr>
        <a href="javascript:void(0)" @click="toggleUpload">{{ __('Upload') }}</a>
        <br>
        <div v-if="uploadSuccess" class="message">
            {{ __('Video was successfully uploaded and processing now. It can be sent to chat while waiting. After processing it will be playable.') }}
        </div>
        <modal :isVisible="showMessage" modalId="choose-or-upload-message" verticalCenter>
            <p>{{ __('Video will appear in the list after upload complete') }}.</p>
        </modal>
    </div>
</template>

<script>
    import { mapActions } from 'vuex';
    import VideoUpload from '../components/Modals/VideoUpload.vue';
    import helpers from '../mixins/helpers';

    export default {
        mixins: [helpers],
        props: {
            multiple: {
                type: Boolean,
                default: false
            }
        },

        data () {
            return {
                chooseLastVideo: false,
                uploadSuccess: false,
                uploadVisible: false,
                choosedVideo: null,
                showMessage: false
            }
        },

        watch: {
            choosedVideo () {
                this.$emit('input', this.choosedVideo);
            }
        },
        mounted () {
            this.emitter.on('close-modal', data => {
                if (data.modalId == 'choose-or-upload-message')
                    this.showMessage = false;
            });

            this.emitter.on('upload-start', f => {
                this.showMessage = true;
            });

            this.emitter.on('upload-success', f => {
                this.showMessage = false;
                // this.$refs.videoList.select(this.$refs.videoList.videos[this.$refs.videoList.videos.length-1]);
                this.uploadSuccess = true;
            });
        },
        methods: {
            ...mapActions({showModal: 'modals/show'}),

            toggleUpload () {
                this.showModal({ component: VideoUpload, id: 'video-upload' });
            },

            onSuccessUpload () {
                this.uploadSuccess = true;
                this.chooseLastVideo = true;
                this.emitter.emit('refresh-components');
            }
        }
    }
</script>

<style scoped>
    .message {
        text-align: left;
        padding: 10px;
    }
</style>
