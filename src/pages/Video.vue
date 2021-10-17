<template>
    <div class="video-library" v-if="user">
        <div class="super-center text-center" v-if="loading">
            <h4 class="mt-2">{{ __('Please wait') }}...</h4>
        </div>
        <div class="super-center text-center" v-else-if="!videos.length">
            <h4>{{ __('There are no videos yet') }}</h4>
            <h5>{{ __('You can add videos') }} <a href="javascript:" @click="toggleUpload">{{ __('here') }} <i class="fa fa-upload"></i></a></h5>
        </div>
        <div v-else>
            <video-browser
                :videos="videos"
                :editable="true"
            >
                <template v-slot:header>
                    <h6 class="text-center">{{ __('You can add videos') }} <a href="javascript:" @click="toggleUpload">{{ __('here') }} <i class="fa fa-upload"></i></a></h6>
                    <video-quota />
                </template>
                <template v-slot:sort-select>
                    <div class="d-flex justify-content-end mt-3 select-container">
                        <h5 class="sort-title">Sort By:</h5>
                        <multiselect
                            v-model="sortBy"
                            track-by="sortBy"
                            label="label"
                            :options="sortOptions"
                            :searchable="false"
                            :allow-empty="false"
                        />
                    </div>
                </template>
            </video-browser>
        </div>
    </div>
</template>

<script>
import _ from 'lodash'
import axios from 'axios'
import { mapActions } from 'vuex';
import VideoUpload from '../components/Modals/VideoUpload.vue';

export default {
    data () {
        return {
            videos: [],
            dropActive: false,
            uploadVisible: false,
            loading: false,
            uploading: false,
            sortBy: { sortBy: 'newest', label: 'Date added \u2b61' },
            sortOptions: [
                { sortBy: 'newest', label: 'Date added \u2b61' },
                { sortBy: 'oldest', label: 'Date added \u2b63' },
                { sortBy: 'asc', label: 'A-Z \u2b61' },
                { sortBy: 'desc', label: 'A-Z \u2b63' },
            ],
        }
    },

    watch: {
        sortBy(newValue) {
            const { sortBy } = newValue;
            this.getVideos(sortBy);
        },
    },

    computed: {
        user () {
            return _.get(this.$store.state, 'user');
        }
    },

    mounted () {
        const { sortBy } = this.sortBy
        this.getVideos(sortBy);

        this.emitter.on('upload-success', file => {
            this.getVideos(sortBy);
        });
    },

    methods: {
        ...mapActions({showModal: 'modals/show'}),

        async getVideos (sortBy = '') {
            this.loading = true;
            const response = await axios.get(`/api/videos?order=${sortBy}`);
            this.loading = false;
            this.videos = response.data.videos;
        },

        toggleUpload () {
            this.showModal({ component: VideoUpload, id: 'video-upload' });
        },

        onSuccess (file) {
            this.uploading = false;
            this.toggleUpload();
            this.getVideos();
        }
    }
}
</script>

<style scoped lang="scss">
.select-container {
    @media(max-width: 600px) {
        flex-direction: column;
    }
}

.multiselect {
    max-width: 400px;
    margin-left: 15px;

    @media(max-width: 600px) {
        max-width: 100%;
        margin: 0;
    }
}
</style>