<template>
    <div class="upcoming-bookings">
        <div v-if="videoSubscriptions && videoSubscriptions.data.length">
            <div class="subscription-card-area">
                <div class="page-title-area">
                    <h2 class="section-title">
                        {{ __('My Active Subscriptions') }}
                    </h2>
                </div>
            </div>
            <customer-booked-video-subscription
                v-for="subscription in videoSubscriptions.data"
                :key="subscription.booking_id"
                :subscription="subscription"
                class="list-collapsable event-list-section"
            />
            <pages action="fetchBoookedActiveVideoSubscriptions" v-model="videoSubscriptions" />
        </div>

        <div v-if="pastVideoSubscriptions && pastVideoSubscriptions.data.length">
            <div class="past-subscription-card-area">
                <div class="page-title-area">
                    <h2 class="section-title mt-3">
                        {{ __('Past Subscriptions') }}
                    </h2>
                </div>
            </div>
            <customer-booked-video-subscription
                v-for="subscription in pastVideoSubscriptions.data"
                :key="subscription.booking_id"
                :subscription="subscription"
                class="list-collapsable event-list-section"
            />
            <pages action="fetchBoookedPastVideoSubscriptions" v-model="pastVideoSubscriptions" />
        </div>
    </div>
</template>

<script>
import helpers from '../mixins/helpers';

export default {
    mixins: [helpers],

    data () {
        return {
        }
    },

    watch: {
        loading (status) {
            this.emitter.emit('isLoading', status);
        }
    },

    computed: {
        videoSubscriptions () {
            return (this.$store.state.bookedVideoSubscriptions || {}).video_subscriptions;
        },

        pastVideoSubscriptions () {
            return (this.$store.state.bookedVideoSubscriptions || {}).past_video_subscriptions;
        },

        loading () {
            return (this.$store.state.videoSubscriptions || {}).loading;
        }
    }
}
</script>

<style>

</style>