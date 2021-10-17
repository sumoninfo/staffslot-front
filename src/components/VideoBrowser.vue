<template>
    <div>
        <modal modalId="video-edit">
            <video-edit :video="editingVideo"/>
        </modal>
        <player v-if="currentVideo" :video="currentVideo" class="big-player" />
        <slot name="header"></slot>
        <tag-editor
            v-model="selectedTags"
            :tags="tags"
            class="mt-3"
        />
        <slot name="sort-select"></slot>
        <div class="card-columns">
            <div
                class="card"
                v-for="video in videos"
                :key="video.id"
                v-if="!selectedTags.length || intersectTags(video).length"
            >
                <div v-if="editable" class="controls text-end">
                    <button class="btn" @click="editVideo(video)"><i class="fa fa-pencil"></i></button>
                    <confirm @confirm="deleteVideo(video)" style="display: inline-table;">
                        <button class="btn"><i class="fa fa-times"></i></button>
                    </confirm>
                </div>
                <video-thumb :video="video" :playable="false" @click.native="playVideo(video)" />
                <div class="tags mt-2">
                    <span
                        v-for="tag in video.tags"
                        :key="tag.id"
                        class="badge-tag badge-success me-1"
                        v-text="tag.name"
                    ></span>
                </div>
                <div class="card-body pt-0">
                    <h5 class="card-title mt-0">
                        <a href="javascript:void(0)" @click="playVideo(video)">{{ video.title ? video.title : video.video_id  }}</a></h5>
                    <p class="card-text">{{ video.description }}</p>
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
            videos: Array,
            tags: {
                type: Array,
                default: null
            },
            editable: {
                type: Boolean,
                default: false
            }
        },

        data () {
            return {
                selectedTags: [],
                currentVideo: null,
                editingVideo: null,
            }
        },

        mounted () {
            this.emitter.on('close-player', () => this.currentVideo = null);

            this.emitter.on('video-processing-status-change', video => {
                let i = this.videos.findIndex(x => x.video_id === video.video_id); if (i !== -1) {
                    this.videos[i] = video;
                    this.$forceUpdate();
                }
            });
        },

        methods: {
            playVideo (video) {
                this.currentVideo = video;
                window.scroll(0, 0);
            },

            editVideo (video) {
                this.editingVideo = video;
                this.emitter.emit('show-modal', { modalId: 'video-edit' });
            },

            deleteVideo (video) {
                const index = this.videos.findIndex(x => x.id === video.id);
                if (index !== -1) {
                    this.videos.splice(index, 1);
                }

                // Deselect deleted video from create video slot wizard
                let wizardVideoSlot = this.$store.state.wizard.videoSlot;
                if (wizardVideoSlot) {
                    const i = wizardVideoSlot.promoVideo.findIndex( x => x.id === video.id);
                    delete wizardVideoSlot.promoVideo[i];
                    this.$store.dispatch('wizard/setVideoSlot', wizardVideoSlot);
                }

                axios.delete(`/api/video/${video.id}`);
            },

            intersectTags (video) {
                const videoTags = video.tags.map(x => x.name);
                const selectedTags = this.selectedTags.map(x => x.name);
                const intersection = videoTags.filter( x => selectedTags.includes(x));
                return intersection;
            },
        }
    }
</script>

<style scoped lang="scss">
    .card-columns .card:first-child {
        margin-bottom: 0.74rem;
    }

    .video-preview {
        height: 180px;
    }
</style>
