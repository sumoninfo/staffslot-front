<template>
    <div>
        <h3 class="text-center">{{ videoSlot.title }}</h3>
        <div class="text-center">
            <span v-if="videoSlot.disabled" class="badge-original badge-secondary">{{ __('Canceled') }}</span>
        </div>
        <br>
        <p class="text-center">{{ videoSlot.description }}</p>
        <br>
        <div class="promo-video text-center mb-2" v-if="videoSlot.videos && videoSlot.videos.length">
            <div v-for="video,i in videoSlot.videos" :key="i" style="display: inline-table; margin: 1px;">
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
                <tr v-if="booking">
                    <td class="confirm-slot-field"><strong>{{ __('Date Purchased') }}</strong></td>
                    <td>{{ booking.formatted_created_at }}</td>
                </tr>
                <tr v-else>
                    <td class="confirm-slot-field"><strong>{{ __('Available slots') }}</strong></td>
                    <td v-if="videoSlot.used_slots !== videoSlot.slots">{{ videoSlot.available_slots }}/{{ videoSlot.slots }}</td>
                    <td v-if="videoSlot.used_slots === videoSlot.slots">{{ __('Fully Booked') }}</td>
                </tr>
                <tr>
                    <td colspan="2">
                        <ClipboardButton class="btn btn-sm btn-link btn-clipboard mb-1" :clipboard-text="videoSlotLink">
                            <span class="button-icon"><i class="fa fa-copy"></i></span>
                            <span class="button-text">{{ __('Copy Link') }}</span>
                        </ClipboardButton>
                        <template v-if="videoSlot.slots >videoSlot.bookings_count">
                            <button
                                    class="btn-invite-customer btn  btn-sm  btn-secondary mb-1"
                                    v-on:click="inviteCustomer('email')">
                                <span class="button-icon"><i class="fa fa-envelope"></i></span>{{ __('Email Invite') }}
                            </button>
                            <button
                                    v-if="videoSlot.user.account.role!=null && videoSlot.user.account.role.name!='pro-free'"
                                    class="btn-invite-customer btn btn-sm  btn-secondary mb-1"
                                    v-on:click="inviteCustomer('sms')">
                                <span class="button-icon"><i class="fa fa-commenting-o"></i></span>{{ __('SMS Invite') }}
                            </button>
                        </template>
                    </td>
                </tr>
            </tbody>
        </table>
        <invite-customer/>
        <book-for-customer/>
    </div>
</template>

<script>
    import filters from '../mixins/filters.js';
    import helpers from '../mixins/helpers.js';
    import ClipboardButton from './Controls/ClipboardButton.vue'

    export default {
        mixins: [filters, helpers],

        data () {
            return {
                playingVideo: null
            }
        },

        props: {
            videoSlot: Object,
            booking: Object
        },

        components: { ClipboardButton },

        computed: {
            videoSlotLink () {
                return base_url().replace(/\/$/, "") + this.$router.resolve({
                    name: 'confirmVideoSlot',
                    params: { videoSlotId: this.videoSlot.id}
                }).href;
            }
        },

        methods: {
            play (video) {
                this.playingVideo = video;
            },
            bookForCustomer () {
                this.emitter.emit('bookForCustomer', this.videoSlot, 'video')

                if (this.videoSlot.payment_cash) {
                    $('#btn-book-customer-cash').show();
                }else{
                    $('#btn-book-customer-cash').hide();
                }

                if (this.videoSlot.payment_club_credit) {
                    $('#btn-book-customer-club').show();
                }else{
                    $('#btn-book-customer-club').hide();
                }
            },
            inviteCustomer (_type) {
                this.emitter.emit('inviteCustomer', {item: this.videoSlot, _type, item_type: 'video'})
            },
        }

    }
</script>