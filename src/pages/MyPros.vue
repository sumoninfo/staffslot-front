<template>
    <div class="row" v-if="pros">
        <div class="col-md-1"></div>
        <div class="col-md-10">
            <p>{{ __('Browse previously booked and saved pros') }}.</p>
            <div class="row">
                <div class="col-sm-6 col-lg-6" v-for="pro in pros" :key="pro.user_id">
                    <div class="profile-box">
                        <div class="contact-card">
                            <a class="pull-left profile-image-box" :href="route('search.showDetails', pro.user_id)">
                                <div v-if="pro.account.profile_photo" class="img-circle profile-image" :style="'background-image:url(\'https://app.timeslot.pro/storage/uploads/' + pro.account.profile_photo + '\')'"></div>
                                <div v-else class="img-circle profile-image" style="background-image:url('/images/default-profile-time-slot-pro.png')"></div>
                            </a>
                            <div class="member-info mb-4">
                                <h4 class="m-t-0 m-b-6 header-title">
                                    <b><a :href="route('search.showDetails', pro.user_id)">
                                        <span class="m-r-5">{{ pro.account.first_name }}</span>
                                        <span>{{ pro.account.last_name }}</span></a></b><br>
                                </h4>
                                <h5>
                                    <small v-if="pro.account.nickname">(<span>{{ pro.account.nickname }}</span>)</small>
                                </h5>
                                <p v-if="pro.account.city" class="text-dark"><i class="fa fa-map-marker"></i> <span>{{ pro.account.city }}</span>,
                                    <span>{{ pro.account.state }}</span>
                                </p>
                                <p><router-link :to="{ name: 'availableSlots', params: { userId: pro.user_id }}"><i class="fa fa-check"></i> {{ __('Book a Time Slot') }}</router-link></p>
                                <p><router-link v-if="pro.hasVideoSlots" :to="{ name: 'availableVideoSlots', params: { userId: pro.user_id }}"><i class="fa fa-play-circle-o" aria-hidden="true"></i> {{ __('Book a Video Slot') }}</router-link></p>
                                <p><router-link :to="{ name: 'availablePackages', params: { publicId: pro.account.public_id }}"><i class="fa fa-ticket"></i> {{ __('Buy a Package') }}</router-link></p>
                                <p v-if="pro.hasVideoSubscriptions" class="text-dark m-b-1"><router-link :to="{ name: 'publicVideoSubscriptions', params: { publicId: pro.account.public_id } }"><i class="fa fa-film"></i> {{ __('Buy a Video Subscription') }}</router-link></p>
                                <p v-if="pro.hasProducts" class="text-dark m-b-1"><router-link :to="{ name: 'publicProducts', params: { publicId: pro.account.public_id } }"><i class="fa fa-film"></i> {{ __('Buy a Product') }}</router-link></p>
                                <p><router-link :to="{ name: 'publicCalendar', params: { publicId: pro.account.public_id }}"><i class="fa fa-calendar"></i> {{ __('View Calendar') }}</router-link></p>
                            </div>
                        </div>
                        <!-- <div class="pro-action-buttons">
                            <a class="btn btn-success btn-sm slots-btn col-6" :href="route('booking.showAvailableSlots', pro.user_id)"><i class="fa fa-check"></i> {{ __('Book a Time Slot') }}</a><br>
                            <a class="btn btn-success btn-sm slots-btn col-6" :href="route('booking.showAvailableSlots', pro.user_id)"><i class="fa fa-play-circle-o" aria-hidden="true"></i> {{ __('Book a Video Slot') }}</a><br>
                            <a class="btn btn-success btn-sm slots-btn col-6" :href="route('booking.showAvailableSlots', pro.user_id)"><i class="fa fa-ticket"></i> {{ __('Buy a Package') }}</a><br>
                            <a class="btn btn-info col-6" :href="route('calendar.showPublicCalendar', pro.account.public_id)"><i class="fa fa-calendar"></i> View Calendar</a>
                        </div> -->
                    </div>
                </div>
            </div>
        </div>
        <div class="col-md-1"></div>
    </div>
</template>

<script>
import helpers from '../mixins/helpers.js'

export default {
    mixins: [helpers],

    computed: {
        pros () {
            return this.$store.state.bookmarkPros
        }
    },
}
</script>

<style>

</style>
