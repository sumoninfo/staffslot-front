<template>
    <div>
        <div v-if="isBookingEmpty">
            <h1>{{ __('Video Purchases') }}</h1>
            <p>{{ __('When a  video slot or video subscription is booked with a pro, it will appear here') }}.</p>
        </div>
        <div v-if="!loading && !isBookingEmpty">
            <div class="row">
                <div class="col-md-1 hidden-sm hidden-xs text-start"></div>
                <div class="col-md-10 col-sm-12 col-xs-12 text-start">
                    <p>
                        <a data-bs-toggle="collapse" href="#collapseExample" aria-expanded="false" aria-controls="collapseExample">
                            <i class="fa fa-play-circle-o" aria-hidden="true"></i>
                        {{__('Customer Video Tutorial') }}
                        </a>
                    </p>
                    <div class="collapse" id="collapseExample">
                        <p>{{ __('Buy a video slot and post your video for the pro to review. Chat with the pro and watch videos the pro shares with you as feedback') }}.</p>
                        <p>{{ __('The goal is to make it easier and more convenient for you to quickly get an analysis and feedback') }}.</p>
                        <p>{{ __('When the video chat is complete, you will not be able to post new messages or videos with the pro. You will retain the existing chat and posted videos for additional review') }}.</p>
                    </div>
                </div>
                <div class="col-md-1 hidden-sm hidden-xs text-start"></div>
            </div>
            <div class="row justify-content-center">
                <div class="col-md-8">
                    <router-link to="/video" class="btn btn-success btn-block btn-navigation w-100" active-class="">
                        <span class="button-icon">
                            <i class="fa fa-play-circle"></i></span><span class="hidden-md-down visible">{{ __('VIDEO LIBRARY') }}
                        </span>
                    </router-link>
                </div>
            </div>
            <div class="row justify-content-center mt-3">
                <div class="col-md-8">
                    <video-quota />
                </div>
            </div>
            <div v-if="tabbarVisible" class="row justify-content-center mt-3">
                <div class="col-md-8">
                    <ul class="nav nav-tabs tabs" style="width: 100%;">
                        <li class="tab" style="width: 45%;">
                            <a role="button" @click="activePane = 0" tabindex="0" :class="{ active: activePane === 0 }">{{ __('VIDEO SLOTS') }}</a>
                        </li>
                        <li class="tab" style="width: 55%;">
                            <a role="button" @click="activePane = 1" tabindex="1" :class="{ active: activePane === 1 }">{{ __('VIDEO SUBSCRIPTIONS') }}</a>
                        </li>
                    </ul>
                </div>
            </div>
            <div v-if="activePane === 0">
                <div class="row justify-content-center" v-if="!videoBookings.data.length && !pastVideoBookings.data.length">
                    <p class="no-video-slots-text">{{ __('No booked video are slots. Click') }} <router-link to="/search"> {{ __('here') }} </router-link> {{ __('to find a pro that offers video slots. Video slots are a great way to get feedback from a pro using video online') }}.</p>
                </div>
                <div class="row justify-content-center" v-if="videoBookings && videoBookings.data.length">
                    <div class="col-md-8 upcoming-bookings">
                        <div class="page-title-area ">
                            <h2 class="section-title">{{ __('Available Video Slots') }}</h2>
                        </div>

                        <div class="col-12">
                            <my-video-booking-item v-for="booking in videoBookings.data" :key="booking.booking_id" :booking="booking" />
                            <pages @on-changed="onPaginationChanged" v-model="pagination" />
                        </div>
                    </div>
                </div>

                <div class="row justify-content-center" v-if="pastVideoBookings && pastVideoBookings.data.length">
                    <div class="col-md-8 upcoming-bookings">
                        <div class="page-title-area mt-3">
                            <h2 class="section-title">{{ __('Past Video Slots') }}</h2>
                        </div>

                        <div class="col-12">
                            <my-video-booking-item v-for="booking in pastVideoBookings.data" :key="booking.booking_id" :booking="booking" />
                            <pages @on-changed="onPastPaginationChanged" v-model="pastPagination" />
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="activePane === 1">
                <div class="row justify-content-center">
                    <div class="col-md-8 upcoming-bookings">
                        <div class="col-12">
                            <my-video-subscriptions-page />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import helpers from '../mixins/helpers.js'
    import axios from 'axios'
    import _ from 'lodash'

    export default {
        mixins: [helpers],

        data () {
            return {
                receivedVideoBookings: null,
                receivedPastVideoBookings: null,
                pagination: null,
                pastPagination: null
            }
        },

        mounted () {
            this.pagination = { ...this.videoBookings };
            this.pastPagination = { ...this.pastVideoBookings };
            delete this.pagination.data;
            delete this.pastPagination.data;
            this.$store.dispatch('fetchBoookedVideoSubscriptions');
        },

        computed: {
            videoBookings() {
                return this.receivedVideoBookings ? this.receivedVideoBookings : this.$store.state.bookedVideoSubscriptions.video_subscriptions;
            },

            pastVideoBookings() {
                return this.receivedPastVideoBookings ? this.receivedPastVideoBookings : this.$store.state.bookedVideoSubscriptions.past_video_subscriptions;
            },

            loading () {
                return !this.videoBookings || !this.pastVideoBookings;
            },

            tabbarVisible () {
                return true;
            },

            isBookingEmpty () {
                if(this.$store.state.bookedVideoSubscriptions.video_subscriptions !== null && this.$store.state.bookedVideoSubscriptions.past_video_subscriptions !== null) {
                    if(this.$store.state.bookedVideoSubscriptions.video_subscriptions.data.length == 0 && this.$store.state.bookedVideoSubscriptions.past_video_subscriptions.data.length == 0){
                        return true
                    }
                }
                return false;
            },

            activePane: {
                get () { return (this.$store.state.uiState && this.$store.state.uiState.myVideoBookingsPane) || 0; },
                set (val) { this.$store.dispatch('uiState/set', { myVideoBookingsPane: val }); }
            }
        },

        methods: {
            async onPaginationChanged () {
                const response = await axios.get('/api/booking/video?pick=active', {
                    params: _.pick(this.pagination, ['per_page', 'page'])
                });

                this.receivedVideoBookings = response.data.bookings;
                this.pagination = { ...this.receivedVideoBookings };
                delete this.pagination.data;
            },

            async onPastPaginationChanged () {
                const response = await axios.get('/api/booking/video?pick=past', {
                    params: _.pick(this.pastPagination, ['per_page', 'page'])
                });

                this.receivedPastVideoBookings = response.data.pastBookings;
                this.pastPagination = { ...this.receivedPastVideoBookings };
                delete this.pastPagination.data;
            }
        }
    }
</script>