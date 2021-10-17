<template>
    <div v-if="videoSubscription" class="container">
        <div class="card-box mt-4">
            <div class="col-12">
                <div class="event-detail-header">
                    <h3>{{ videoSubscription.name }}</h3>
                    <h4 class="text-center">{{ __('Subscription Details') }}</h4>
                    <br v-if="videoSubscription.videos.length">
                    <div v-if="videoSubscription.videos.length" class="promo-video text-center mb-2">
                        <div v-for="video in videoSubscription.videos" :key="video.id" style="display: inline-table; margin: 1px;">
                            <video-thumb @click="play(video)" v-if="video" :video="video" style="width: 275px; height: 155px;" />
                        </div>
                    </div>
                </div>
                <hr />
                <div class="row">
                    <div class="col h6">{{ __('Tags') }}:</div>
                    <div class="col-md-8">
                        <div class="row d-flex ps-4 ps-md-0">
                            <div class="px-0 pb-1 mb-2" v-for="tag in videoSubscription.tags" :key="tag.id">
                                <span class="label label-primary mt-1">{{ tag.name }}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <hr v-if="videoSubscription.expiration_message" />
                <div v-if="videoSubscription.expiration_message" class="row">
                    <div class="col-4 h6">{{ __('Subscription Expires') }}:</div>
                    <div class="col-8">{{ videoSubscription.expiration_message }}</div>
                </div>
                <hr />
                <div class="row">
                    <div class="col-4 h6">{{ __('Subscription Cost') }}:</div>
                    <div class="col-8">
                        ${{ videoSubscription.cost }}
                        <span v-if="videoSubscription.renewal_message" class="text-primary">
                            ({{ videoSubscription.renewal_message }})
                        </span>
                    </div>
                </div>
                <hr />
                <div class="row">
                    <div class="col-4 h6">{{ __('Subscription Description') }}:</div>
                    <div class="col-8">{{ videoSubscription.description }}</div>
                </div>

                <hr v-if="videoSubscription.waiver_url">
                <div v-if="videoSubscription.waiver_url" class="row">
                    <div class="col-4 h6">{{ __('Waiver') }}:</div>
                    <div class="col-8"><a target="_blank" :href="videoSubscription.waiver_url">{{ videoSubscription.waiver_url }}</a></div>
                </div>

                <hr v-if="videoSubscription.doc_url">
                <div v-if="videoSubscription.doc_url" class="row">
                    <div class="col-4 h6">{{ __('Package form') }}:</div>
                    <div class="col-8"><a target="_blank" :href="videoSubscription.doc_url">{{ videoSubscription.doc_url }}</a></div>
                </div>

                <pay-buttons
                    v-if="!isOwner"
                    :description="`Payment for ${videoSubscription.name}`"
                    :cost="videoSubscription.cost"
                    :cash="videoSubscription.cash_enabled"
                    :stripe="videoSubscription.credit_card_enabled"
                    :credits="videoSubscription.club_credit_enabled"
                    @pay="pay"
                />
            </div>
        </div>
        <div v-if="isOwner">
            <div  class="detail-header bkd-slots-hdr mb-1">
                <h3>{{ __('BOOKINGS') }} ( {{ videoSubscription.bookings.length }} / {{ videoSubscription.slots || '∞' }})</h3>
            </div>
            <div v-for="(booking, i) in videoSubscription.bookings" :key="booking.booking_id" class="list-collapsable event-list-section">
                <div class="row">
                    <div class="col-md-6 col-lg-6">
                        <p class="col-collapsable event-slot">{{ i+1 }}</p>
                        <p class="col-collapsable event-title item-title-sm"><strong>{{ __('Customer') }}:</strong>
                            <a :href="`/customers/${booking.user.user_id}`">{{ booking.user.account.full_name }}</a>
                        </p>
                        <p class="col-collapsable event-minutes item-title-sm"><strong>{{ __('Subscribed on') }}:</strong>{{ booking.created_at }}</p>
                        <p class="col-collapsable event-cost item-title-sm"><strong>{{ __('Payment Method') }}:</strong>
                            <payment-status-manage
                                :payment-status="booking.payment_status"
                                :booking="booking.booking_id">
                            </payment-status-manage>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import helpers from '../mixins/helpers';
import subscription from '../transformers/subscription';

export default {
    mixins: [helpers],

    data () {
        return {
            videoSubscription: null
        }
    },

    computed: {
        isOwner () {
            return this.$store.state.user && this.$store.state.user.user_id === this.videoSubscription.user_id;
        }
    },

    async mounted () {
        if (this.$route.params.videoSubscriptionId) {
            if (this.$route.params.videoSubscription) {
                this.videoSubscription = subscription(JSON.parse(this.$route.params.videoSubscription));
            } else {
                const response = await axios(`/api/video/subscriptions/${this.$route.params.videoSubscriptionId}`);
                this.videoSubscription = subscription(response.data.video_subscription);
            }
            this.videoSubscription.tagsObj = this.videoSubscription.tags;
        }
    },

    methods: {
        async pay (currency, data) {
            const response = await this.$store.dispatch('callApi', {
                method: 'post',
                url: `/api/video/subscriptions/${this.videoSubscription.id}/book`,
                data: {
                    with: currency,
                    ...data
                }
            });

            if (response.data.success) {
                this.$store.dispatch('fetchBoookedVideoSubscriptions');
                this.$store.dispatch('uiState/set', { myVideoBookingsPane: 1 });
                this.$router.push({ name: 'myVideoSubscriptionsWatch', params: { subscriptionId: response.data.booking.booking_id } });
            }
        }
    }
}
</script>

<style>

</style>