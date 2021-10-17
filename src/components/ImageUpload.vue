<template>
    <div>
        <div class="upload-area text-center">
            <h5>{{ __('Drop files here') }}</h5>
            <h6>{{ __('Or') }}</h6>
            <file-upload
                class="btn btn-default"
                v-model="files"
                :multiple="true"
                :thread="5"
                :headers="headers"
                @input-file="inputFile"
                @input-filter="inputFilter"
                post-action="http://143.244.165.94/api/upload/image"
                drop=".drop-active"
                :drop1="true"
                ref="upload">
                {{ __('Browse') }}
            </file-upload>
        </div>
        <ul>
            <li v-for="file in files" :key="file.id">
                <img v-if="file.thumb" :src="file.thumb" width="40" height="auto" />
                <span v-else>{{ __('No Image') }}</span>
                <span class="filename">
                    {{file.name}}
                </span>
                <div class="col mt-1" style="display: flex;">
                    <div class="progress" style="width: 90%;">
                        <div :class="{
                                      'progress-bar': true,
                                      'progress-bar-striped': true,
                                      'bg-danger': file.error,
                                      'bg-success': file.success,
                                      'progress-bar-animated': file.active
                                      }" role="progressbar" :style="{width: file.progress + '%'}"></div>
                    </div>
                    <i class="fa fa-remove ms-2" @click="remove(file)" style="line-height: 0.71; cursor: pointer;"></i>
                </div>
            </li>
        </ul>
        <div class="text-center">
            <button v-if="files.length" class="btn btn-success" @click="startUpload">{{ __('Start upload') }}</button>
        </div>
    </div>
</template>

<script>
    import dropArea from '../mixins/drop-area';
    import helpers from '../mixins/helpers'

    export default {
        mixins: [ dropArea, helpers ],

        data () {
            return {
                files: [],
                headers: {},
                data: {},
            }
        },

        mounted () {
            this.initDropArea()
            this.headers = {
                // 'X-Csrf-Token': document.getElementsByName('csrf-token')[0].content,
                'X-Requested-With': 'XMLHttpRequest'
            }
            this.data = {
                // '_csrf_token': document.getElementsByName('csrf-token')[0].content,
                title: null,
                description: null,
                tags: []
            }
        },

        methods: {
            inputFilter (newFile, oldFile, prevent) {
                if (newFile && !oldFile) {
                    if (newFile.file && newFile.type.substr(0, 6) === 'image/' && this.autoCompress > 0 && this.autoCompress < newFile.size) {
                        newFile.error = 'compressing'
                        const imageCompressor = new ImageCompressor(null, {
                            convertSize: Infinity,
                            maxWidth: 512,
                            maxHeight: 512,
                        })
                        imageCompressor.compress(newFile.file)
                            .then((file) => {
                                this.$refs.upload.update(newFile, { error: '', file, size: file.size, type: file.type })
                            })
                            .catch((err) => {
                                this.$refs.upload.update(newFile, { error: err.message || 'compress' })
                            })
                    }
                }
                if (newFile && (!oldFile || newFile.file !== oldFile.file)) {
                    newFile.blob = ''
                    let URL = window.URL || window.webkitURL
                    if (URL && URL.createObjectURL) {
                        newFile.blob = URL.createObjectURL(newFile.file)
                    }
                    newFile.thumb = ''
                    if (newFile.blob && newFile.type.substr(0, 6) === 'image/') {
                        newFile.thumb = newFile.blob
                    }
                }
            },

            inputFile (newFile, oldFile) {
              if (!newFile || !this.$refs.upload.active) return;
                if (newFile.success === true) {
                    this.$emit('fileUploaded', newFile)
                    if (!this.files.includes(newFile)) {
                      this.files.push(newFile)
                    }
                }

                if (newFile.error) {
                    this.$emit('on-error', newFile);
                }

            },

            remove (file) {
                const i = this.files.findIndex(x => x.id == file.id);
                this.files.splice(i, 1);
            },

            startUpload () {
                if (!this.$refs.upload.active) {
                    this.$refs.upload.active = true;
                }
            },
        }
    }
</script>

<style scoped>
    .upload-area {
        border: 1px solid #e3e3e3;
        border-radius: 5px;
        margin: 10px;
        padding-bottom: 8px;
    }

    ul {
        list-style-type:none;
    }
</style>
