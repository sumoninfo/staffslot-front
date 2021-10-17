<template>
    <div class="list-collapsable event-list-section text-start">
        <div class="row">
            <div class="col-sm-12 col-md-6 col-lg-6">
                <p class="col-collapsable event-title item-title-sm">
                    <router-link
                        @click="onSlotChoosed"
                        :to="{
                            name: 'videoSlotDetails',
                            params: { videoSlotId: videoSlot.id, videoSlot: JSON.stringify(videoSlot) }
                        }">{{ videoSlot.title }}</router-link>
                </p>
            </div>

            <confirm @confirm="$emit('onCancel')">
                <button class="btn btn-default delete-link"><span class="icon-only"><i class="fa fa-close"></i></span></button>
            </confirm>

        </div>

        <div class="row">
            <div class="col-sm-12 col-md-12 ps-3">
                <div v-if="videoSlot.bookings_count>0">
                    <a class="h6 text-primary" href="#" data-bs-toggle="collapse" :data-bs-target="'#booking-video-'+videoSlot.id">{{ __('View Bookings') }}</a>
                    <div :id="'booking-video-'+videoSlot.id" class="collapse">
                        <ol>
                            <li
                                v-for="(booking,index) in videoSlot.bookings"
                                :key="index"
                            >
                                <span v-text='booking.user.account.full_name'></span>
                            </li>
                        </ol>
                    </div>
                </div>
            </div>
            <div class="col-sm-12 col-md-10 col-lg-10 last-message">
                <template v-if="videoSlot.last_message">
                    <span style="chat-msg-txt">{{ __('Last message') }}: {{ fromNow(videoSlot.last_message.created_at) }} <router-link :to="`/video/booking/${videoSlot.last_message.chatable_id}`"> <b>{{ videoSlot.last_message.user.account.first_name }} {{ videoSlot.last_message.user.account.last_name }}</b> {{ videoSlot.last_message.preview }} </router-link></span>
                </template>
            </div>

            <div class="col-12 col-md-12 col-lg-12 text-end mb-2 pe-4">

                <ClipboardButton class="btn btn-sm btn-link btn-clipboard mb-1" :clipboard-text="videoSlotLink">
                    <span class="button-icon"><i class="fa fa-copy"></i></span>
                    <span class="button-text">{{ __('Copy Link') }}</span>
                </ClipboardButton>

                <template v-if="videoSlot.slots > videoSlot.bookings.length || videoSlot.unlimited">
                    <button
                            class="btn btn-sm btn-link btn-book-customer mb-1 me-1"
                            v-on:click="bookForCustomer">
                        <span class="button-icon"><i class="fa fa-plus-square"></i></span>{{ __('Book Customers') }}
                    </button>

                    <button
                            class="btn-invite-customer btn  btn-sm btn-secondary mb-1 me-1"
                            v-on:click="inviteCustomer('email')">
                        <span class="button-icon"><i class="fa fa-envelope"></i></span>{{ __('Email Invite') }}
                    </button>
                    <button
                            v-if="videoSlot.user.account.role!=null && videoSlot.user.account.role.name!='pro-free'"
                            class="btn-invite-customer btn btn-sm btn-secondary mb-1"
                            v-on:click="inviteCustomer('sms')">
                        <span class="button-icon"><i class="fa fa-commenting-o"></i></span>{{ __('SMS Invite') }}
                    </button>
                </template>

            </div>

            <div v-if="videoSlot.unlimited" class="text-center btn-book-customer" style="width: 100%">
                {{ __('Unlimited') }}
            </div>
            <ul v-else class="solts-visualizer">
                <li v-for="(si, i) in videoSlot.slots"
                    :key="si.slot_id"
                    :class="{
                        canceled: videoSlot.bookings[i] && videoSlot.bookings[i].cancelled,
                        completed: videoSlot.bookings[i] && videoSlot.bookings[i].completed,
                        booked: si <= videoSlot.bookings.length
                    }"
                    :style="'width:'+ (1/videoSlot.slots * 100) +'%;'">
                </li>
            </ul>

        </div>

    </div>
</template>

<script>
    import filters from '../../mixins/filters.js'
    import $ from 'jquery'
    import helpers from '../../mixins/helpers'
    import ClipboardButton from '../Controls/ClipboardButton.vue'

    export default {
        mixins: [filters, helpers],

        props: {
            videoSlot: {
                type: Object
            }
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
            onSlotChoosed () {
                this.$store.commit('setSlotDetails', this.videoSlot);
            },
            bookForCustomer () {
                this.emitter.emit('bookForCustomer', this.videoSlot, 'video')

                if (+this.videoSlot.payment_cash) {
                    $('#btn-book-customer-cash').show();
                    $('#btn-book-customer-free').hide();
                }else{
                  $('#btn-book-customer-free').show();
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