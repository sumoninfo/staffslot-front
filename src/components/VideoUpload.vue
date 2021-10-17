<template>
    <div class="video-upload text-center">
        <div class="form-group text-left">
            <label>{{ __('Title') }}</label>
            <input v-model="data.title" type="text" class="form-control">
        </div>
        <div class="form-group text-left">
            <label>{{ __('Description') }}</label>
            <textarea v-model="data.description" class="form-control" rows="3"></textarea>
        </div>
        <div class="form-group text-left">
            <label>{{ __('Tags') }}</label>
            <tag-editor v-model="data.tags" :allowNew="true"/>
        </div>
        <hr>
        <div class="upload-area">
            <h5>{{ __('Drop files here') }}</h5>
            <h6>{{ __('Or') }}</h6>

            <file-upload
                class="btn btn-default"
                v-model="files"
                post-action="/api/upload"
                :headers="headers"
                :data="data"
                drop=".drop-active"
                @input-file="inputFile"
                ref="upload">
                {{ __('Browse') }}
            </file-upload>
        </div>

        <div v-if="files.length" class="mt-2 text-start">
            <div class="progress" v-if="files[0].active || files[0].progress !== '0.00'">
                <div :class="{
                    'progress-bar': true,
                    'progress-bar-striped': true,
                    'bg-danger': files[0].error,
                    'bg-success': files[0].success,
                    'progress-bar-animated': files[0].active
                }" role="progressbar" :style="{width: files[0].progress + '%'}"></div>
            </div>
            <div class="mt-2" style="line-height: 38px;">
                <span v-html="files[0].name"></span>
                <span>{{ files[0].size | formatSize }}</span>
                <span v-html="files[0].error"></span>
                <button class="btn btn-success float-end" @click="startUpload">{{ __('Start upload') }}</button>
            </div>
        </div>
    </div>
</template>

<script>
    import dropArea from '../mixins/drop-area';
    import helpers from '../mixins/helpers';

    export default {
        mixins: [helpers],
        data () {
            return {
                files: [],
                selectedFile: null,
                headers: {},
                data: {},
            }
        },

        mounted () {
            this.initDropArea();
            this.headers = {
                'X-Csrf-Token': document.getElementsByName('csrf-token')[0].content,
                    'X-Requested-With': 'XMLHttpRequest'
            }
            this.data = {
                '_csrf_token': document.getElementsByName('csrf-token')[0].content,
                    title: 'Unnamed Video',
                    description: null,
                    tags: []
            }
        },

        methods: {
            inputFile (newFile, oldFile) {
                if (!newFile) return;

                this.emitter.emit('upload-progress', newFile);

                if (newFile.success === true) {
                    this.emitter.emit('upload-success', newFile);
                    this.$emit('on-success', newFile);
                    this.clear();
                }

                if (newFile.error) {
                    this.emitter.emit('upload-error', newFile);
                    this.$emit('on-error', newFile);
                    this.clear();
                }

                this.selectedFile = newFile;
            },

            startUpload () {
                if (!this.$refs.upload || !this.$refs.upload.active) {
                    this.selectedFile.data = { ...this.data };
                    this.selectedFile.data.tags = this.selectedFile.data.tags.map( x => x.name);
                    this.emitter.emit('upload-start', this.selectedFile);
                    this.$emit('on-start-upload', this.selectedFile);
                    this.$refs.upload.active = true;
                }
            },

            clear () {
                this.files.length = 0;
            }
        }
    }
</script>

<style scoped>
/*    .video-upload {
        width: 50%;
        margin-left: auto;
        margin-right: auto;
        background-color: white;
        padding: 10px;
        border-radius: 5px;
        position: absolute;
        z-index: 1041;
        left: 50%;
        transform: translate(-50%, 0);
    }
*/
    .video-upload .progress {
        height: 1rem;
        margin-bottom: 0;
        margin-top: 15px;
    }

    .upload-area {
        border: 1px solid #e3e3e3;
        border-radius: 5px;
        margin: 10px;
        padding-bottom: 8px;
    }
</style>
