<template>
    <div>
        <h5 class="text-center">{{ subscriptionTitle }}</h5>
        <video-browser
            :videos="videos"
            :tags="tags"
        />
    </div>
</template>

<script>
import axios from 'axios'

export default {
    data () {
        return {
            subscriptionTitle: null,
            videos: []
        }
    },

    computed: {
        tags () {
            let videoTags = [];
            this.videos.map(x => x.tags.map(y => {
                if (videoTags.findIndex(z => z.id === y.id) === -1) {
                    videoTags.push(y)
                }
            }));
            return videoTags;
        }
    },

    async mounted () {
        const response = await axios.get(`/api/video/subscriptions/${this.$route.params.subscriptionId}/videos`);
        this.videos = response.data.videos;
        this.subscriptionTitle = response.data.subscription_title;
    }
}
</script>
