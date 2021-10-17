<template>
    <div class="row" v-if="videoSlot">
        <div class="col-md-2"></div>
        <div class="col-md-8">
            <div class="card-box">
                <video-slot-details :videoSlot="videoSlot" />
            </div>
            <div class="detail-header bkd-slots-hdr mb-1">
                <h3>{{ __('BOOKINGS') }} ({{ videoSlot.bookings.length }} / {{ videoSlot.slots }})</h3>
            </div>
            <div v-for="(booking, i) in videoSlot.bookings" :key="i" class="list-collapsable event-list-section">
                <div @click="onBookingChoosed(booking)" class="row slot-item">
                    <div class="col-md-6 col-lg-6">
                        <p class="col-collapsable event-slot">{{ i+1 }}</p>
                        <p v-if="booking.user" class="col-collapsable event-title item-title-sm"><strong>{{ __('Customer') }}:</strong>
                            {{ booking.user.account.first_name }} {{ booking.user.account.last_name }}
                        </p>
                        <p class="col-collapsable">
                            <span v-if="booking.last_message">
                                <strong>{{ __('Last message') }}:</strong> {{ fromNow(booking.last_message.created_at) }},
                            </span>

                            <strong>{{ __('Total') }}:</strong> {{ booking.messages_count }} {{ __('message(s)') }}
                        </p>
                        <p class="col-collapsable" v-if="booking.last_message">
                            <b>{{ booking.last_message.user.account.first_name }} {{ booking.last_message.user.account.last_name }}</b> {{ booking.last_message.preview }}
                        </p>
                        <p class="col-collapsable event-cost item-title-sm"><strong>{{ __('Payment Method') }}:</strong>
                            <a href="javascript:void(0)" @click.stop="setPaid(booking)" class="payment-type payment-status-link">{{ __(booking.payment_status.type) }}
                                <span v-if="['cash', 'club credit'].indexOf(booking.payment_status.type) !== -1" class="payment-status-tag"> - {{ booking.payment_status.paid }}</span>
                            </a>
                        </p>
                    </div>
                    <div>
                        <span v-if="booking.cancelled" class="badge-original badge-secondary canceled">{{ __('Canceled') }}</span>
                        <span v-if="booking.completed" class="badge-original badge-secondary completed">{{ __('Completed') }}</span>
                    </div>
                    <div v-if="!booking.cancelled && !booking.completed" style="position: initial; top: 8px; right: 8px; margin-left: 10px; display: flex">
                        <confirm @confirm="completeBooking(booking)" style="display: inline-table; padding: 0.6rem 0;">
                            <button class="btn btn-success">{{ __('Complete') }}</button>
                        </confirm>
                        <confirm @confirm="cancelBooking(booking)">
                            <button class="btn btn-default delete-link" style="position: relative; top: 0; right: 0;"><span class="icon-only"><small>{{ __('cancel') }}</small> <i class="fa fa-close"></i></span></button>
                        </confirm>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import helpers from '../mixins/helpers.js';
    import filters from '../mixins/filters.js';
    import axios from 'axios'
    import Swal from 'sweetalert2'

    export default {
        mixins: [helpers, filters],

        data () {
            return {
                videoSlot: this.$route.params.videoSlot && JSON.parse(this.$route.params.videoSlot)
            }
        },

        mounted () {
            this.fetchVideoSlot();
        },

        methods: {
            async fetchVideoSlot () {
                const response = await axios.get(`/api/video/slot/${this.$route.params.videoSlotId}`);
                this.videoSlot = response.data.video_slot;
            },

            onBookingChoosed (booking) {
                this.$router.push({
                    name: 'videoBooking',
                    path: `/video/booking/${booking.booking_id}`,
                    params: {
                        bookingId: booking.booking_id,
                        booking: JSON.stringify({ ...booking, bookable: this.videoSlot })
                    }
                });
            },

            async cancelBooking (booking) {
                const response = await axios.put(`/api/booking/video/cancel/${booking.booking_id}`);
                booking.cancelled = true;
            },

            async completeBooking (booking) {
                const response = await axios.put(`/api/booking/video/complete/${booking.booking_id}`);
                booking.completed = true;
            },

            async setPaid (booking) {
                if (booking.paid || ['cash', 'club_credit'].indexOf(booking.payment_type) === -1) {
                    return;
                }

                const result = await Swal.fire({
                    title: this.__('Did you get paid?'),
                    text: ' ',
                    type: 'info',
                    showCancelButton: true,
                    confirmButtonText: this.__('yes'),
                    cancelButtonText: this.__('cancel')
                })
                if (result.isConfirmed) {
                    booking.payment_status.paid = this.__('please wait');
                    await axios.post('/api/slot/booking/paid/' + booking.booking_id, { paid: true} );
                    booking.payment_status.paid = this.__('paid');
                };
            },

            async cancelSlot (slot) {
                const response = await axios.put(`/api/video/slot/cancel/${slot.id}`);
            },

            async completeSlot (slot) {
                const response = await axios.put(`/api/video/slot/complete/${slot.id}`);
            },
        }
    }
</script>

<style scoped>
    .slot-item {
        cursor: pointer;
    }
</style>