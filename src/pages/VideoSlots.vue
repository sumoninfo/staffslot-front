<template>
    <div>
        <div class="row">
            <div class="col-md-1 hidden-sm hidden-xs"></div>
            <div class="col-md-10 col-sm-12 col-xs-12 text-start">
                <p>
                    <a data-bs-toggle="collapse" href="#collapseExample" aria-expanded="false" aria-controls="collapseExample">
                        <i class="fa fa-play-circle-o" aria-hidden="true"></i>
                    {{__('Tutorial') }}
                    </a> |
                    <a href="#" @click.prevent="shareVideoList">
                        <i aria-hidden="true" class="fa fa-share-square-o"></i> {{ __('Share') }}
                    </a> |
                    <ClipboardButton class="copy-clipboard like-link" :clipboard-text="videoSlotPageLink">
                        <i aria-hidden="true" class="fa fa-clipboard"></i>
                        <span class="button-text">{{ __('Copy') }}</span>
                    </ClipboardButton> |
                    <router-link :to="{ name: 'videoEvents' }">
                        <i class="fa fa-list-ul" aria-hidden="true"></i>
                    {{__('Video Events') }}
                    </router-link>
                </p>
                <div class="collapse" id="collapseExample">
                    <p>{{ __('Video slots make it easy to earn extra income reviewing customer videos. Create a video slot event and post it to get booked.') }}</p>
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
            <div class="col-md-1 hidden-sm hidden-xs"></div>
            <div class="col-md-10 col-sm-12 col-xs-12 text-center">
                <div class="row">
                    <div class="ps-1 pe-1" style="width: calc(30%);">
                        <router-link to="/wizard/video/select-event" class="btn btn-success btn-block btn-navigation w-100" :class="{ disabled: !new_slots_allowed }">
                            <span class="hidden-md-down visible">{{ __('ADD VIDEO SLOTS') }}
                            </span>
                        </router-link>
                    </div>
                    <!-- <div class="col-4 ps-1 pe-1">
                        <router-link to="/video/events" class="btn btn-success btn-block btn-navigation">
                            <span class="button-icon">
                                <i class="fa fa-list-ul"></i></span><span class="hidden-md-down visible">{{ __('VIDEO EVENTS') }}
                            </span>
                        </router-link>
                    </div> -->
                    <div class="ps-1 pe-1" style="width: calc(30%);">
                        <router-link to="/video" class="btn btn-success btn-block btn-navigation w-100" active-class="">
                            <span class="hidden-md-down visible">{{ __('VIDEO LIBRARY') }}
                            </span>
                        </router-link>
                    </div>
                    <div v-if="hasVideoSubscriptions" class="ps-1 pe-1" style="width: calc(40%);">
                        <router-link to="/video/subscriptions" class="btn btn-success btn-block btn-navigation w-100" active-class="">
                            <span class="hidden-md-down visible">{{ __('VIDEO SUBSCRIPTIONS') }}
                            </span>
                        </router-link>
                    </div>
                </div>
                <div class="row">
                    <div class="col-12 mt-3">
                        <video-quota />
                    </div>
                </div>
                <div class="row">
                    <div class="col-12">
                        <span v-if="!new_slots_allowed" class="error">{{ __('You have reached the Pro-free account maximum of') }} {{ $max_active_slots }} {{ __('active time slots. To add more slots') }} <a :href="route('subscription.showSelectSubscription')" class="upgrade-pro-plus-text">{{ __('click here') }}</a> {{ __('to upgrade to Pro-Plus') }}.</span>
                        <br>

                        <ul class="nav nav-tabs tabs slot-tabs mb-2" style="width: 100%; margin-left: 0;">
                            <li class="tab" style="width: calc(100%/3);">
                                <a href="#active-slots" data-bs-toggle="tab" aria-expanded="false" class="active">{{ __('ACTIVE') }}</a>
                            </li>
                            <li class="tab" style="width: calc(100%/3);">
                                <a href="#completed-slots" data-bs-toggle="tab" aria-expanded="false">{{ __('COMPLETED') }}</a>
                            </li>
                            <li class="tab" style="width: calc(100%/3);">
                                <a href="#canceled-slots" data-bs-toggle="tab" aria-expanded="false">{{ __('CANCELED') }}</a>
                            </li>
                        </ul>
                        <div class="tab-content no-bck" style="box-shadow: none;">
                            <div class="tab-pane active" id="active-slots">
                                <div v-if="loading" class="text-center">
                                    <h4 class="mt-4">{{ __('Please wait. Video slots loading...') }}</h4>
                                    <div class="spinner-border" role="status">
                                    </div>
                                </div>
                                <div v-else-if="videoSlots.length" class="row">
                                    <div class="col-xs-12 col-sm-12 col-md-12 text-center">
                                        <video-slot-item
                                            @onCancel="onCancel(slot)"
                                            v-for="slot in videoSlots"
                                            :key="slot.id"
                                            :videoSlot="slot"/>

                                        <pages @on-changed="onPaginationChanged" v-model="pagination" />
                                    </div>
                                </div>
                                <div v-else class="text-center">
                                    <h4>{{ __('There are no video slots') }}</h4>
                                    <p>{{ __('To get started, create a video event type then click the "add slot" button above and share with clients to get video slots booked. Email us at support@timeslot.pro for assitance') }}.</p>
                                </div>
                            </div>
                            <div class="tab-pane" id="completed-slots">
                                <div v-if="loading" class="text-center">
                                    <h4 class="mt-4">{{ __('Please wait. Video slots are loading...') }}</h4>
                                    <div class="spinner-border" role="status">
                                    </div>
                                </div>
                                <div v-else-if="pastVideoSlots.length" class="row">
                                    <div class="col-xs-12 col-sm-12 col-md-12 text-center">
                                        <video-slot-item
                                            @onCancel="onCancel(slot)"
                                            v-for="slot in pastVideoSlots"
                                            :key="slot.id"
                                            :videoSlot="slot"/>

                                        <pages @on-changed="onPaginationChanged('past')" v-model="pastPagination" />
                                    </div>
                                </div>
                                <div v-else class="text-center">
                                    <h4>{{ __('There are no past video slots') }}</h4>
                                </div>
                            </div>
                            <div class="tab-pane" id="canceled-slots">
                                <div v-if="loading" class="text-center">
                                    <h4 class="mt-4">{{ __('Please wait. Video slots are loading..') }}</h4>
                                    <div class="spinner-border" role="status">
                                    </div>
                                </div>
                                <div v-else-if="canceledVideoSlots.length" class="row">
                                    <div class="col-xs-12 col-sm-12 col-md-12 text-center">
                                        <video-slot-item
                                            @onCancel="onCancel(slot)"
                                            v-for="slot in canceledVideoSlots"
                                            :key="slot.id"
                                            :videoSlot="slot"/>

                                        <pages @on-changed="onPaginationChanged('canceled')" v-model="canceledPagination" />
                                    </div>
                                </div>
                                <div v-else class="text-center">
                                    <h4>{{ __('There are no canceled video slots') }}</h4>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-1 hidden-sm hidden-xs"></div>
        </div>

        <invite-customer/>
        <book-for-customer/>

    </div>
</template>

<script>
    import helpers from '../mixins/helpers.js'
    import checkAccess from '../mixins/check-access.js'
    import ClipboardButton from '../components/Controls/ClipboardButton.vue'
    import axios from 'axios'
    import _ from 'lodash'

    export default {
        mixins: [helpers, checkAccess],
        components: { ClipboardButton },

        data() {
            return {
                new_slots_allowed: true,
                videoSlots: [],
                pastVideoSlots: [],
                canceledVideoSlots: [],
                pagination: null,
                pastPagination: null,
                canceledPagination: null,
                videoSlotPageLink: "",
                loading: true
            }
        },

        computed: {
            hasVideoSubscriptions() {
                return (this.$store.state.user || {}).has_video_subscriptions;
            },

            navButtonWidth() {
                let count = this.hasVideoSubscriptions ? 3 : 2;
                return `calc(100%/${count})`;
            }
        },

        mounted () {
            this.getVideoSlots();
            this.getVideoSlotPageLink();
        },

        methods: {
            async getVideoSlots (pick = null) {
                let params;

                if (pick) {
                    const p = pick == 'active' ? this.pagination : this.pastPagination;
                    params = p ? _.pick(p, ['per_page', 'page']) : null;
                    params = { ...params, pick };
                }

                const response = await axios.get('/api/video/slots', { params });

                if (response.data.active_slots) {
                    this.videoSlots = response.data.active_slots.data;
                    this.pagination = { ...response.data.active_slots };
                    delete this.pagination.data;
                }

                if (response.data.past_slots) {
                    this.pastVideoSlots = response.data.past_slots.data;
                    this.pastPagination = { ...response.data.past_slots };
                    delete this.pastPagination.data;
                }

                if (response.data.canceled_slots) {
                    this.canceledVideoSlots = response.data.canceled_slots.data;
                    this.canceledPagination = { ...response.data.canceled_slots };
                    delete this.canceledPagination.data;
                }

                this.loading = false;
            },

            getVideoSlotPageLink(){
                const route = this.$router.resolve({
                    name: 'availableVideoSlots',
                    params: { userId: this.$store.state.user.user_id }
                })
                this.videoSlotPageLink = window.location.origin + route.fullPath
            },

            onPaginationChanged (type = false) {
                this.getVideoSlots(type ? type : 'active');
            },

            async onCancel (slot) {
                const index = this.videoSlots.findIndex(x => x.id === slot.id);
                if (index !== -1)
                    this.videoSlots.splice(index, 1)

                const response = await axios.put(`/api/video/slot/cancel/${slot.id}`);
            },

            shareVideoList(){
                this.emitter.emit('inviteCustomer', {item: {}, _type: "all", item_type:"videoList"});
            },
        }
    }
</script>