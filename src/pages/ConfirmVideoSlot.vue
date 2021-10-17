<template>
    <div class="row" v-if="videoSlot">
        <div class="col-md-3"></div>
        <div class="col-md-6">
            <div class="card-box slot-details">
                <h3 class="text-center">{{ videoSlot.title }}</h3>
                <br>
                <p class="text-center">{{ videoSlot.description }}</p>
                <br>
                <div class="text-center">
                    <div
                        v-for="video,i in videoSlot.videos"
                        :key="i"
                        style="display: inline-table; margin: 1px;">
                        <video-thumb @click="play(video)" v-if="video" :video="video" style="width: 275px; height: 155px;" />
                    </div>
                </div>

                <table class="table" style="margin-bottom: 0.5rem">
                    <tbody>
                        <tr>
                            <td class="confirm-slot-field"><strong>{{ __('Notes') }}</strong></td>
                            <td>{{ videoSlot.notes }}</td>
                        </tr>
                        <tr v-if="videoSlot.cancellation_policy">
                            <td class="confirm-slot-field"><strong>{{ __('Cancellation Policy') }}</strong></td>
                            <td>{{ videoSlot.cancellation_policy }}</td>
                        </tr>
                        <tr>
                            <td class="confirm-slot-field"><strong>{{ __('Duration') }}</strong></td>
                            <td>{{ videoSlot.minutes }} {{ __('mins') }}</td>
                        </tr>
                        <tr>
                            <td class="confirm-slot-field"><strong>{{ __('Cost') }}</strong></td>
                            <td>{{ formatCurrency(videoSlot.cost_pretty) }}</td>
                        </tr>
                        <tr>
                            <td class="confirm-slot-field"><strong>{{ __('Available slots') }}</strong></td>
                            <td v-if="videoSlot.used_slots !== videoSlot.slots">{{ videoSlot.available_slots }}/{{ videoSlot.slots }}</td>
                            <td v-if="videoSlot.used_slots === videoSlot.slots">{{ __('Fully Booked') }}</td>
                        </tr>
                        <tr v-if="videoSlot.video_event.waiver_url">
                            <td class="confirm-slot-field"><strong>{{ __('Slot waiver') }}</strong></td>
                            <td><a target="blank" :href="videoSlot.video_event.waiver_url">{{ videoSlot.video_event.waiver_url }}</a></td>
                        </tr>
                        <tr v-if="videoSlot.video_event.doc_url">
                            <td class="confirm-slot-field"><strong>{{ __('Other') }}</strong></td>
                            <td><a target="blank" :href="videoSlot.video_event.doc_url">{{ videoSlot.video_event.doc_url }}</a></td>
                        </tr>
                    </tbody>
                </table>

                <p v-if="user" class="text-center">
                    <button v-if="!videoSlot.cost" @click="pay('free')" class="btn btn-primary">{{ __('Book for Free') }}</button>
                    <span v-else>
                        <button v-if="videoSlot.video_event.payment_cash" @click="pay('cash')" class="btn btn-primary mt-1"><i class="fa fa-money" aria-hidden="true"></i> {{ __('Pay with Cash') }}</button>

                        <stripe-button
                            @onSubmit="pay('credit_card', $event)"
                            :amount="videoSlot.cost * 100">
                            <button v-if="videoSlot.video_event.payment_credit_card" class="btn btn-success mt-1" style="margin-bottom: 0.5rem;"><i class="fa fa-credit-card" aria-hidden="true"></i> {{ __('Pay with Card') }}</button>
                        </stripe-button>

                        <button v-if="videoSlot.video_event.payment_club_credit" @click="pay('club_credit')" class="btn btn-primary mt-1"><i class="fa fa-diamond" aria-hidden="true"></i> {{ __('Book with Club Credit') }}</button>

                        <div v-if="packageOrders.length > 0" class="col-12 text-center">
                            <hr>
                            <h5 class="mt-4 mb-3">{{ __('Book with Package Credits') }}</h5>
                            <template v-if="( packageOrder.paid || packageOrder.payment_type != 'cash' || packageOrder.payment_type != 'free' ) && !packageOrder.is_canceled && !packageOrder.is_expired">
                                <span
                                    v-for="packageOrder,i in packageOrders"
                                    :key="i"
                                >
                                    <button
                                        @click="pay('package_credit', { order_id: packageOrder.id })"
                                        class="btn btn-success"><i class="fa fa-ticket" aria-hidden="true"></i> {{ packageOrder.package.package_name}}
                                    </button> <p class="label label-primary">{{ packageOrder.used_slots }} / {{ packageOrder.allocated_slots }} </p>
                                </span>
                            </template>
                        </div>
                        <div v-if="!videoSlot.payment_club_credit" class="col-12 text-center">
                            <h5>{{ __('You do not have package credits available for this item. Click') }} <a :href="`/package/pro/${videoSlot.public_id}`">{{ __('here') }}</a> {{ __('to shop packages by') }} {{ videoSlot.user.account.full_name }}.</h5>
                        </div>
                        <span v-if="!loadingOrders && packageOrders.length == 0 && !videoSlot.video_event.payment_cash && !videoSlot.video_event.payment_club_credit && !videoSlot.video_event.payment_credit_card">
                            <p class="alert alert-secondary">
                                {{ __('Must purchase an eligible package to book this slot') }}. <a :href="`/package/pro/${videoSlot.public_id}`">{{ __('click here') }} </a> {{ __("to view this pro's packages") }}
                            </p>
                        </span>
                    </span>
                </p>
                <div v-else class="col-12 text-center">
                    <a :href="proceedUrl">{{ __('Login To proceed') }}</a>
                </div>
            </div>
        </div>
    </div>
    <div v-else class="super-center">
        <h4 class="mt-2">{{ __('Please wait') }}...</h4>
    </div>
</template>

<script>
    import filters from '../mixins/filters';
    import helpers from '../mixins/helpers.js';
    import axios from 'axios'

    export default {
        mixins: [helpers, filters],

        data () {
            return {
                videoSlot: this.$route.params.videoSlot && JSON.parse(this.$route.params.videoSlot),
                packageOrders: [],
                loadingOrders: true
            }
        },

        computed:{
            user() {
                return this.$store.state.user;
            },

            proceedUrl() {
                return "/auth/login?redirect_url=" + encodeURI(window.location.href);
            }
        },

        async mounted () {
            this.emitter.on('close-modal', params => {
                if (params.modalId === 'player')
                    this.playingVideo = null;
            });

            if (!this.videoSlot) {
                const response = await axios.get(`/api/video/slot/${this.$route.params.videoSlotId}`);
                this.videoSlot = response.data.video_slot;
            }

            if (this.user) {
                const response = await axios.get(`/api/package/orders?slot_id=${this.videoSlot.id}&slot_type=video`);
                this.packageOrders = response.data.packageOrders;
            }
            this.loadingOrders = false;
        },

        methods: {
            async pay (currency, data) {
                const response = await axios.put(`/api/video/book-slot/${this.videoSlot.id}`, {
                    with: currency,
                    ...data
                });

                if (response.data.success) {
                    this.$store.dispatch('fetchPackageOrders');
                    this.$store.dispatch('fetchBookings');
                    this.$router.push({
                        name: 'videoBooking',
                        params: {
                            bookingId: response.data.booking.booking_id,
                            booking: JSON.stringify(response.data.booking)
                        }
                    });
                }
            }
        }
    }
</script>