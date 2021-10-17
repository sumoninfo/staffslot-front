<template>
    <div class="col-12">
        <div class="row">
            <div class="col-7 col-sm-6 col-md-4 data-box">
                <todays-income :loader="isLoaded" :todaysActualIncome="dashboard.todays_actual_income" :todaysPotentialIncome="dashboard.todays_potential_income"/>
            </div>
              <div class="col-5 col-sm-6 col-md-4 data-box d-none d-md-block d-lg-block d-xl-block">
                <div class="loader-layout">
                    <preloader v-show="isLoaded"></preloader>
                    <div class="data-card widget-box-1 bg-white calendar-style-slots">
                        <h4 class="text-dark font-18">{{ __('Todays Slots') }}</h4>
                        <h2 class="text-pink text-left ml-2"><span data-plugin="counterup">{{ dashboard.todays_booked_slots }}</span></h2>
                        <p class="text-muted">{{ dashboard.todays_booked_slots }} / {{ dashboard.todays_available_slots }} {{ __('Slots Booked') }}</p>
                    </div>
                </div>
              </div>
            <div class="col-5 col-sm-6 col-md-4 data-box">
                <todays-slots :loader="isLoaded" :todaysAvailableSlots="dashboard.todays_available_slots" :todaysBookedSlots="dashboard.todays_booked_slots"/>
            </div>
            <div class="col-12 col-sm-12 col-md-12 data-box">
                <div class="loader-layout">
                    <preloader v-show="isLoaded"></preloader>
                    <div class="data-card widget-box-1 bg-white">
                        <!-- <i class="fa fa-info-circle text-muted pull-right inform" data-bs-toggle="tooltip" data-placement="bottom" title="" data-original-title="{{ __('Last 30 Days') }}"></i> -->
                        <h4 class="text-dark font-18">{{ __('Last 30 Days Revenue') }}</h4>
                        <h2 class="text-success text-left inline-numbers">$<span data-plugin="counterup">{{ dashboard.month_revenue }}</span></h2>
                        <p class="text-muted inline-block" v-if="dashboard.month_booked">{{ __('Total Booked') }}:<br>{{ dashboard.month_booked.length }}</p>
                        <monthly-revenue :data="dashboard.month_booked" :timezone="dashboard.current_timezone"/>
                    </div>
                </div>
            </div>
        </div>
        <div class="row quick-links quick-links-box">
              <div class="col-6 col-sm-6 col-md-6"><router-link class="btn btn-default btn-block btn-navigation w-100" style="background-image: url( https://s3.amazonaws.com/tspassets/tsp-yoga-class-1.jpg) !important;" :to="{ name: 'slotList' }"><span class="button-icon"><i class="fa fa-calendar-check-o"></i></span>{{ __('MY SLOTS') }}</router-link></div>
              <div class="col-6 col-sm-6 col-md-6"><router-link class="btn btn-default btn-block btn-navigation w-100" :to="{ name: 'eventList' }" style="background-image: url(https://s3.amazonaws.com/tspassets/tsp-coach-standing-1.jpg);"><span class="button-icon"><i class="fa fa-list-ul"></i></span>{{ __('MY EVENTS') }}</router-link></div>
        </div>

        <div class="upcoming-card-section" v-if="dashboard.upcoming_bookings">
            <div class="col-md-12 upcoming-bookings">
                <div class="page-title-area">
                    <h2 class="section-title">{{ __('Upcoming bookings') }}</h2>
                </div>
            </div>

            <div class="list-collapsable event-list-section" v-for="(slot, key) in dashboard.upcoming_bookings.data" :key="key">
                <div class="row">
                    <div class="col-md-5">
                        <p class="col-collapsable event-title item-title-sm"><strong>{{ __('Event') }}:</strong> <router-link :to="{ name: 'slotDetails', params: { slotId: slot.slot_id }}">{{ slot.title }}</router-link></p>
                        <p class="col-collapsable event-location-name item-title-sm"><strong>{{ slot.location_place }}</strong></p>
                    </div>
                    <div class="col-md-4 pb-2 ml-1">
                        <a href="#" data-bs-toggle="collapse" :data-bs-target="'#booking-upcoming-list' + key">{{ __('View booked customers') }}</a>
                        <div :id="'booking-upcoming-list' + key" class="collapse">
                            <ol>
                                <li v-for="(booking, lk) in slot.bookings" :key="lk" class="customer-list-sm">
                                    <a href="#" data-bs-toggle="modal" :data-bs-target="'#model-' + key + '-' + lk">{{ booking.account ? `${booking.account.first_name} ${booking.account.last_name}` : booking.guest.name }}</a>
                                    <div class="modal" :id="'model-' + key + '-' + lk" tabindex="-1" role="dialog">
                                        <div class="modal-dialog" role="document">
                                            <div class="modal-content">
                                                <div class="modal-header">
                                                    <h5 class="modal-title">{{ __('Client Info') }}</h5>
                                                    <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
                                                        <span aria-hidden="true">&times;</span>
                                                    </button>
                                                </div>
                                                <div v-if="booking.user" class="modal-body">
                                                    <p>{{ __('Name') }}: {{ booking.user.account.first_name }} {{ booking.user.account.last_name }}</p>
                                                    <p>{{ __('Email') }}: {{ booking.user.email }}</p>
                                                    <p>{{ __('Contact number') }}: {{ booking.user.account.contact_number }}</p>
                                                </div>
                                                <div v-if="booking.guest" class="modal-body">
                                                    <p>{{ __('Name') }}: {{ booking.guest.name }}</p>
                                                    <p>{{ __('Email') }}: {{ booking.guest.email }}</p>
                                                    <p>{{ __('Contact number') }}: {{ booking.guest.phone }}</p>
                                                </div>
                                                <div class="modal-footer">
                                                    <a  v-if="booking.user" :href="route('profile.showPublicProfile', booking.user.account.public_id)" class="btn btn-success">{{ __('View profile') }}</a>
                                                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">{{ __('Close') }}</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            </ol>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <p class="col-collapsable event-cost item-title-sm">
                            <strong>{{ __('Date & Time') }}:</strong>
                            <div v-if="slot.childs.length">
                                <a href="#" data-bs-toggle="collapse" :data-bs-target="'#booking-upcoming-list-days' + key">{{ slot.event_day }} - {{ slot.end_day }}</a>
                                <div :id="'booking-upcoming-list-days' + key" class="collapse">
                                    <ul>
                                        <li v-for="(child_slot, csk) in slot.childs">{{ child_slot.event_day }}</li>
                                    </ul>
                                </div>
                            </div>
                            <div class="col" v-else>
                                {{ slot.event_day }}
                            </div>
                            <div class="col">{{ slot.start_time }} - {{ slot.end_time }}</div>
                        </p>
                    </div>
                </div>
                <div class="row">
                    <div class="col-12">
                        <ul class="solts-visualizer">
                            <li v-for="i in slot.slots" :class="{ booked: i <= slot.bookings.length }" :style="'width: ' + 1/slot.slots * 100  + '%;'"></li>
                        </ul>
                    </div>
                </div>
            </div>
            <!-- <a href="">View All</a> -->
        </div>
<!-- ------------------------------------------------------------------------------- -->
    </div>
</template>

<script>
    import helpers from '../mixins/helpers.js'
    import Preloader from '../components/Preloader.vue'

    export default {
        mixins: [helpers],
        data () {
            return {
                currentTimezone: null,
                monthRevenue: null,
                monthBooked: [],
                todaysAvailableSlots: null,
                todaysBookedSlots: null,
                todaysActualIncome: null,
                todaysPotentialIncome: null
            }
        },

        computed: {
            dashboard () {
                return this.$store.state.dashboard ? this.$store.state.dashboard : []
            },

            isLoaded () {
                if(this.$store.state.dashboard){
                    return false
                } else {
                    return true
                }

            }
        },

        components: {
            Preloader
        }
    }
</script>