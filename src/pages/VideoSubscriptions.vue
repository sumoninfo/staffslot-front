<template>
    <div class="container">
        <div>
            <div class="row">
                <div class="col-md-1 hidden-sm hidden-xs"></div>
                <div class="col-md-10 col-sm-12 col-xs-12 text-start">
                    <p>
                        <a data-bs-toggle="collapse" href="#collapseExample" aria-expanded="false" aria-controls="collapseExample">
                            <i class="fa fa-play-circle-o" aria-hidden="true"></i>
                            {{__('Tutorial') }}</a> | 
                        <router-link :to="{ name: 'videoSlots' }"><i class="fa fa-angle-left" aria-hidden="true"></i> {{ __('Back to Video Slots') }}</router-link>
                    </p>
                    <div class="collapse" id="collapseExample">
                        <p>{{ __('Video subscriptions make it easy to earn extra income by allowing customers to watch specific videos you select. Create a video subscription, pick the video tags to include and get booked.') }}</p>
                        <div class="plyr__video-embed" id="player" style="margin-bottom: 20px;">
                            <iframe src="https://www.youtube.com/embed/ZwDZWOHhk3g?origin=https://plyr.io&amp;iv_load_policy=3&amp;modestbranding=1&amp;playsinline=1&amp;showinfo=0&amp;rel=0&amp;enablejsapi=1"
                                allowfullscreen allowtransparency allow="autoplay"></iframe>
                        </div>
                        <p>{{ __('To get started, create a video slot event type, pick how many minutes of video you agree to review, how many you want to see and how much each costs. Then post as a video slot and share with customers.') }}</p>
                        <p>{{ __('Next add any videos to your private library that you would want to use in reply to a customer. When the customer books your slot, you can chat with them and post videos from your library or a new video in response. Mark the video slot "complete" when done to close it out.') }}</p>
                        <p>{{ __('Watch the video above to learn more.') }} <a href="https://www.timeslot.pro/support/" target="_blank" class="support-link"><i class="fa fa-support" aria-hidden="true"></i><span class="button-text"> {{ __('Contact Support') }}</span></a></p>
                        <hr>
                    </div>
                </div>
                <div class="col-md-1 hidden-sm hidden-xs"></div>
            </div>
            <div class="row">
                <div class="col-12 text-center pb-2">
                    <router-link :to="{ name: 'createVideoSubscription' }" class="btn btn-success btn-block w-100"
                    data-animation="fadein" data-plugin="custommodal"
                    data-overlaySpeed="200" data-overlayColor="#36404a">
                        <i class="fa fa-plus"></i> {{ __('Add a New Subscription') }}
                    </router-link>
                </div>
            </div>
            <div class="row">
                <ul class="nav nav-tabs tabs" style="width: 100%;">
                    <li class="tab" style="width: calc(100%/3);">
                        <a role="button" @click="activePane = 0" tabindex="0" :class="{ active: activePane === 0 }">{{ __('FOR SALE') }}</a>
                    </li>
                    <li class="tab" style="width: calc(100%/3);">
                        <a role="button" @click="activePane = 1" tabindex="1" :class="{ active: activePane === 1 }">{{ __('ACTIVE') }}</a>
                    </li>
                    <li class="tab" style="width: calc(100%/3);">
                        <a role="button" @click="activePane = 2" tabindex="2" :class="{ active: activePane === 2 }">{{ __('PAST') }}</a>
                    </li>
                </ul>
            </div>
            <div v-if="activePane === 0">
                <div v-if="!loading && !subscriptions.length" class="text-center">
                    <h4>{{ __('There are no video subscriptions yet') }}</h4>
                </div>
                <div v-if="subscriptions.length" class="row">
                    <div class="col-12 package-card-wrapper">
                        <div v-for="subscription in subscriptions" :key="subscription.id" class="card package-box">
                            <div class="row package-cover">
                                <div class="col-12">
                                    <h5>
                                        <span class="pull-right">
                                            <confirm @confirm="destroy(subscription.id)">
                                                <button class="btn btn-default delete-link">
                                                    <i class="fa fa-close"></i>
                                                </button>
                                            </confirm>
                                        </span>
                                    </h5>
                                    <h3 class="package-title">
                                        <router-link :to="{ name: 'videoSubscriptionDetails', params: { videoSubscription: JSON.stringify(subscription), videoSubscriptionId: subscription.id} }" v-text="subscription.name"></router-link>
                                    </h3>
                                    <div class="row package-details">
                                        <div class="col-12 col-sm-4 package-pricing">
                                            <p>{{ subscription.cost ? `Cost: $${subscription.cost}` : 'Free' }}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-12">
                                    <div class="row package-stats">
                                        <div class="col-collapsable package-status">
                                            <div class="package-status-box booked">
                                                <h6>{{ __('Sold') }}</h6>
                                                <h5>{{ subscription.bookings_count }}/ {{ subscription.slots || "∞" }}</h5>
                                            </div>
                                        </div>
                                        <div class="col-collapsable package-status">
                                            <div class="package-status-box earning">
                                                <h6>{{ __('Earnings') }}</h6>
                                                <h5>${{ subscription.bookings_count * subscription.cost }}</h5>
                                            </div>
                                        </div>
                                        <div class="col-collapsable package-status text-center">
                                            <div :class="'package-status-box-small status-'+ 'active'">
                                                <a>{{ __('Active') }}</a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-12">
                                    <router-link :to="{ name: 'editVideoSubscription', params: { videoSubscription: JSON.stringify(subscription), videoSubscriptionId: subscription.id} }" class="btn btn-edit btn-clipboard"><i class="fa fa-pencil"></i> Edit Subscription</router-link>
                                    <ClipboardButton class="btn-clipboard btn btn-link" :clipboard-text="subscriptionUrl(subscription.id)">
                                        <span class="button-icon">
                                            <i class="fa fa-copy"></i>
                                        </span>
                                        <span class="button-text">{{ __('Copy Link') }}</span>
                                    </ClipboardButton>
                                    <book-invite-buttons
                                        style="display:inline; float:right; text-align: right;"
                                        :entity="subscription"
                                        entityType="videoSubscription"
                                        :cash="subscription.cash_enabled ? true : false"
                                        :credits="subscription.club_credit_enabled ? true : false"
                                    />
                                </div>
                            </div>
                        </div>
                            <pages @on-changed="fetchSubscriptions" v-model="forSalePagination" />
                    </div>
                </div>
            </div>
            <div v-if="activePane === 1">
                <div class="col-12 package-card-wrapper">
                    <booked-video-subscription
                        @cancel="cancelBooking"
                        v-for="booking in activeBookings"
                        :data="booking"
                        :key="booking.booking_id"
                    />
                    <pages @on-changed="fetchActiveBookings" v-model="activePagination" />
                </div>
            </div>
            <div v-if="activePane === 2">
                <div class="col-12 package-card-wrapper">
                    <booked-video-subscription
                        v-for="booking in pastBookings"
                        :data="booking"
                        :key="booking.booking_id"
                    />
                    <pages @on-changed="fetchPastBookings" v-model="pastPagination" />
            </div>
            </div>
        </div>
        <invite-customer/>
        <book-for-customer/>
    </div>
</template>

<script>
import axios from 'axios'
import helpers from '../mixins/helpers.js'
import checkAccess from '../mixins/check-access'
import ClipboardButton from '../components/Controls/ClipboardButton.vue'

export default {
    mixins: [helpers, checkAccess],
    components: { ClipboardButton },

    data () {
        return {
            subscriptions: [],
            activeBookings: [],
            pastBookings: [],
            forSalePagination: {},
            activePagination: {},
            pastPagination: {}
        }
    },

    watch: {
        loading (status) {
            this.emitter.emit('isLoading', status);
        }
    },

    computed: {
        activePane: {
            get () { return (this.$store.state.uiState && this.$store.state.uiState.videoSubscriptionsPane) || 0; },
            set (val) { this.$store.dispatch('uiState/set', { videoSubscriptionsPane: val }); }
        },

        loading: {
            get () { return (this.$store.state.videoSubscriptions || {}).loading },
            set (val) { this.$store.commit('videoSubscriptions/set', { loading: val }) }
        }
    },

    async mounted () {
        this.fetchAll()
    },

    methods: {
        async fetchSubscriptions () {
            this.loading = true;
            const params = {
                per_page: this.forSalePagination.per_page,
                page: this.forSalePagination.page,
            };
            const response = await axios.get('/api/video/subscriptions', { params });
            this.subscriptions = response.data.subscriptions.data;
            this.forSalePagination = { ...response.data.subscriptions };
            delete this.forSalePagination.data;
            this.loading = false;
        },

        async fetchActiveBookings () {
            this.loading = true;
            const params = {
                per_page: this.activePagination.per_page,
                page: this.activePagination.page,
            };
            const response = await axios.get('/api/video/subscriptions/active-bookings', { params });
            this.activeBookings = response.data.bookings.data.map(x => {x.bookable.bookings = this.subscriptions.find(y => y.id == x.bookable_id).bookings; return x });
            this.activePagination = { ...response.data.bookings };
            delete this.activePagination.data;
            this.loading = false;
        },

        async fetchPastBookings () {
            this.loading = true;
            const params = {
                per_page: this.pastPagination.per_page,
                page: this.pastPagination.page,
            };
            const response = await axios.get('/api/video/subscriptions/past-bookings', { params });
            this.pastBookings = response.data.bookings.data.map(x => {x.bookable.bookings = this.subscriptions.find(y => y.id == x.bookable_id).bookings; return x });
            this.pastPagination = { ...response.data.bookings };
            delete this.pastPagination.data;
            this.loading = false;
        },

        async fetchAll () {
            await this.fetchSubscriptions();

            return Promise.all([
                this.fetchActiveBookings(),
                this.fetchPastBookings()
            ]);
        },

        subscriptionUrl(id) {
            return window.location.origin +
                this.$router.resolve({ name: 'videoSubscriptionDetails',
                    params: { videoSubscriptionId: id} }).href;
        },

        async destroy (id) {
            this.loading = true;
            await this.$store.dispatch('callApi', {
                method: 'delete',
                url: `/api/video/subscriptions/${id}`
            });
            await this.fetchAll();
            this.loading = false;
        },

        async cancelBooking (booking) {
            this.loading = true;
            await this.$store.dispatch('callApi', {
                method: 'put',
                url: `/api/booking/video/cancel/${booking.booking_id}`
            });
            await this.fetchAll()
            this.loading = false;
        }
    }
}
</script>

<style>

</style>