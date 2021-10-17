<template>
    <div id="app" class="row justify-content-center">
        <Preloader v-if="loading" />
        <div class="col-md-8" v-else>
            <div class="page-title-area">
                <h6>{{ __('Create &amp; save event types to add as time slots.') }}</h6>
            </div>
            <!-- <div class="location-box">
                <div v-if="errors" class="alert alert-danger">
                    <ul class="list-unstyled">
                        <li v-for="(error, i) in errors" :key="i">{{ error }}</li>
                    </ul>
                </div>
            </div> -->
            <event-form v-if="eventId" :createNew="false" :eventdata="event" :isVideo="isVideo"/>
            <event-form v-else :createNew="true" :isVideo="isVideo"/>
        </div>
    </div>
</template>

<script>
    import helpers from '../mixins/helpers.js'
    import axios from 'axios'
    import _ from 'lodash'
    import Preloader from '../components/Preloader.vue'

    export default {
        mixins: [helpers],
        components: { Preloader },
        data () {
            return {
                isVideo: _.get(this, '$route.meta.isVideo', false),
                eventId: _.get(this, '$route.params.videoEventId', _.get(this, '$route.params.eventId', false)),
                event: _.get(this, '$route.params.videoEvent', _.get(this, '$route.params.event', false)),
                errors: null,
                loading: false
            }
        },

        async mounted () {
            this.event = this.event ? JSON.parse(this.event) : false;
            if (!this.event && this.eventId) {
                this.loading = true
                const url = this.isVideo ? `/api/video/event/${this.eventId}` : `/api/event/${this.eventId}`;
                const response = await axios.get(url);
                this.event = response.data.video_event || response.data.event;
                this.loading = false
            }
        }
    }
</script>

<style>

</style>
