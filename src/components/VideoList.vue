<template>
    <div class="video-list">
        <div class="mt-2" v-if="loading">{{ __('Please wait') }}...</div>
        <div v-else>
            <tag-editor v-model="tags" class="mb-2 ms-0" />
            <div tabindex="0"
                @keydown.up="prevItem"
                @keydown.down="nextItem"
                @keydown.space.prevent=""
                @keyup.space.prevent="select(filteredVideos[pointer])"
                @blur="focused = false;">

                <div class="media"
                    v-for="(video, i) in filteredVideos"
                    :class="{ selected: isSelected(video), focused: focused && i === pointer }"
                    :key="video.id"
                    @click="select(video, i)">

                    <video-thumb
                        class="me-3"
                        :video="video"
                        :style="`width: ${previewWidth}px; height: ${previewHeightComputed}px;`"/>
                    <div class="media-body">
                        <h5 class="mt-0">{{ video.title }}</h5>
                        {{ video.description }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import axios from 'axios'
    import helpers from '../mixins/helpers'

    export default {
        mixins: [helpers],
        props: {
            value: {
                type: [Object, Array],
                default: null
            },

            multiple: {
                type: Boolean,
                default: false
            },

            previewWidth: {
                type: String,
                default: "150"
            },

            previewHeight: String
        },

        data () {
            return {
                selected: [],
                pointer: 0,
                focused: false,
                loading: false,
                valueChangedFirstTime: true,
                videos: [],
                tags: []
            }
        },

        computed: {
            previewHeightComputed () {
                return this.previewHeight || this.previewWidth;
            },

            filteredVideos () {
                return this.videos.filter( x => !this.tags.length || this.intersectTags(x).length );
            }
        },

        watch: {
            value () {
                if (this.valueChangedFirstTime && this.value) {
                    this.selected = this.multiple ? this.value : [this.value];
                    this.valueChangedFirstTime = false;
                }
            }
        },

        mounted () {
            this.getVideos();

            this.emitter.on('upload-success', f => {
                this.getVideos();
            });

            this.emitter.on('video-processing-status-change', video => {
                let i = this.videos.findIndex(x => x.video_id === video.video_id); if (i !== -1) {
                    this.videos[i] = video;
                    this.$forceUpdate();
                    // Computed properties are not recomputing without this
                    this.videos.push({})
                    this.videos.pop()
                }
            });
        },

        methods: {
            async getVideos () {
                this.loading = true;
                const response = await axios.get('/api/videos');
                this.$emit('loaded')
                this.loading = false;
                this.videos = response.data.videos;
            },

            isSelected (video) {
                return this.selected.find( x => { return x ? x.id === video.id : false }) ? true : false;
            },

            select (video, i) {
                if (i) this.pointer = i;

                if (this.multiple) {
                    if (!this.isSelected(video)) {
                        this.selected.push(video);
                    } else {
                        this.selected = this.selected.filter( x => x ? x.id !== video.id : false );
                    }
                    this.$emit('update:modelValue', this.selected);
                } else {
                    if (!this.isSelected(video)) {
                        this.selected = [video];
                        this.$emit('update:modelValue', video);
                    } else {
                        this.selected = [];
                        this.$emit('update:modelValue', null);
                    }
                }
            },

            prevItem () {
                this.focused = true;

                if (this.pointer > 0)
                    this.pointer--
                else
                    this.pointer = this.filteredVideos.length-1

                this.$el.getElementsByClassName('media')[this.pointer].scrollIntoViewIfNeeded()
            },

            nextItem () {
                this.focused = true;

                if (this.pointer < this.filteredVideos.length-1)
                    this.pointer++
                else
                    this.pointer = 0

                this.$el.getElementsByClassName('media')[this.pointer].scrollIntoViewIfNeeded()
            },

            intersectTags (video) {
                const videoTags = video.tags.map(x => x.name);
                const selectedTags = this.tags.map(x => x.name);
                const intersection = videoTags.filter( x => selectedTags.includes(x));
                return intersection;
            }
        }
    }
</script>

<style scoped>
    .media {
        margin-bottom: 1px;
        border: 3px solid #fff !important;
        /*border: initial !important;*/
        background-color: #fff !important;
        border-radius: 0 !important;
        padding: 7px;
        cursor: pointer;
    }

    .media.selected {
        border: 3px solid #41b882 !important;
    }

    .media.focused {
        border: 3px solid #4182b8 !important;
        background-color: #4182b8 !important;
        color: #fff !important;
    }

    .media.selected.focused {
        border: 3px solid #41b882 !important;
    }

</style>
