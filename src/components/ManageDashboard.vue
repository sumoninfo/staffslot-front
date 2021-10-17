<template>
    <div id="ts-content">
        <div class="row">
            <div class="col-7 col-sm-6 col-md-4 data-box">
                <todays-income :todaysActualIncome="todaysActualIncome" :todaysPotentialIncome="todaysPotentialIncome"/>
            </div>
              <div class="col-5 col-sm-6 col-md-4 data-box d-none d-md-block d-lg-block d-xl-block">
                <div class="data-card widget-box-1 bg-white calendar-style-slots">
                  <h4 class="text-dark font-18">{{ __('Todays Slots') }}</h4>
                  <h2 class="text-pink text-left ml-2"><span data-plugin="counterup">{{ todaysBookedSlots }}</span></h2>
                  <p class="text-muted">{{ todaysBookedSlots }} / {{ todaysAvailableSlots }} {{ __('Slots Booked') }}</p>
                </div>
              </div>
            <div class="col-5 col-sm-6 col-md-4 data-box">
                <todays-slots :todaysAvailableSlots="todaysAvailableSlots" :todaysBookedSlots="todaysBookedSlots"/>
            </div>
            <div class="col-12 col-sm-12 col-md-12 data-box">
                <div class="data-card widget-box-1 bg-white">
                    <!-- <i class="fa fa-info-circle text-muted pull-right inform" data-bs-toggle="tooltip" data-placement="bottom" title="" data-original-title="{{ __('Last 30 Days') }}"></i> -->
                    <h4 class="text-dark font-18">{{ __('Last 30 Days Slot Revenue') }}</h4>
                    <h2 class="text-success text-left inline-numbers">$<span data-plugin="counterup">{{ monthRevenue }}</span></h2>
                    <p class="text-muted inline-block">{{ __('Total Booked') }}:<br>{{ monthBooked.length }}</p>
                    <monthly-revenue :data="monthBooked" :timezone="currentTimezone"/>
                </div>
            </div>
        </div>
        <div class="form-group ">
            <multiselect
                placeholder="Choose users"
                v-model="selectedUsers"
                track-by="id"
                :options="managedUsers"
                :custom-label="x => `${x.user.email} ${x.user.account.full_name}`"
                :multiple="true"
            >
                <template slot="option" slot-scope="props">
                    <img
                        style="width: 30px; height: 30px; object-fit: cover;"
                        class="rounded-circle"
                        v-if="props.option.user.account.profile_photo"
                        :src="props.option.user.account.profile_photo.startsWith('http') === false ? '/storage/uploads/' + props.option.user.account.profile_photo : props.option.user.account.profile_photo" >
                    <img v-else src="/images/default-profile-time-slot-pro.png" alt="user"
                        style="width: 30px; height: 30px; object-fit: cover;"
                        class="rounded-circle">
                    <span class="option__desc"><span class="option__small">{{ `${props.option.user.email} ${props.option.user.account.full_name}` }}</span></span>
                </template>
            </multiselect>
        </div>
        <div class="form-group ">
            <multiselect
                placeholder="Choose events"
                v-model="selectedEvents"
                track-by="id"
                :custom-label="x => x.title"
                :options="managedEvents"
                :multiple="true"
            />
        </div>
        <div class="form-group">
            <!-- <label>Set Date Range</label> -->
            <div class="m-b-20 row">
                <div class="col-6">
                    <date-picker
                        class="form-control"
                        placeholder="Select from date"
                        v-model="filters.dateFrom"
                    />
                </div>
                <div class="col-6">
                    <date-picker
                        class="form-control"
                        placeholder="Select to date"
                        v-model="filters.dateTo"
                    />
                </div>
            </div>
        </div>
        <div class="slot-box">
            <div class="col-lg-12 result-tabs">
                <ul class="nav nav-tabs tabs slot-tabs" style="width: 100%;">
                    <li class="tab" style="width: 20%;">
                        <a href="#active-slots" data-bs-toggle="tab" aria-expanded="false" class="active all-tab">{{ __('All') }}</a>
                    </li>
                    <li class="tab" style="width: 20%;">
                        <a href="#full-slots" data-bs-toggle="tab" aria-expanded="false" class="full-tab">{{ __('FULL') }}</a>
                    </li>
                    <li class="tab" style="width: 20%;">
                        <a href="#booked-slots" data-bs-toggle="tab" aria-expanded="false" class="part-tab">{{ __('PART') }}</a>
                    </li>
                    <li class="tab" style="width: 20%;">
                        <a href="#open-slots" data-bs-toggle="tab" aria-expanded="false" class="open-tab">{{ __('OPEN') }}</a>
                    </li>
                    <li class="tab" style="width: 20%;">
                        <a href="#archived-slots" data-bs-toggle="tab" aria-expanded="true" class="past-tab">{{ __('PAST') }}</a>
                    </li>
                </ul>
            </div>
            <div class="tab-content no-bck">
                <div class="tab-pane active" id="active-slots">
                    <slot-list managed :filters="filters" type='active' perpage="15"></slot-list>
                </div>
                <div class="tab-pane" id="full-slots">
                    <slot-list managed :filters="filters" type='full' perpage="15"></slot-list>
                </div>
                <div class="tab-pane" id="booked-slots">
                    <slot-list managed :filters="filters" type='booked' perpage="15"></slot-list>
                </div>
                <div class="tab-pane" id="open-slots">
                    <slot-list managed :filters="filters" type='open' perpage="15"></slot-list>
                </div>
                <div class="tab-pane past-booking-grid" id="archived-slots">
                    <slot-list managed :filters="filters" perpage="15" inactive="true"></slot-list>
                </div>
            </div>
        </div>
        <book-for-customer/>
        <invite-customer/>
    </div>
</template>

<script>
import axios from 'axios'
import helpers from '../mixins/helpers'

export default {
    mixins: [helpers],
    data () {
        return {
            currentTimezone: null,
            managedUsers: [],
            managedEvents: [],
            selectedUsers: [],
            selectedEvents: [],
            filters: {
                users: [],
                events: [],
                dateFrom: '',
                dateTo: ''
            },
            monthRevenue: null,
            monthBooked: [],
            todaysAvailableSlots: null,
            todaysBookedSlots: null,
            todaysActualIncome: null,
            todaysPotentialIncome: null
        }
    },
    mounted () {
        axios.get('/api/manager/pros').then(response => {
            this.managedUsers = response.data.approved
        })

        axios.post('/api/manager/events').then(response => {
            this.managedEvents = response.data.events
        })

        this.update()
    },
    watch: {
        selectedEvents: function(val) {
            this.filters.events = val.map(x => x.title)
            this.update()
        },
        selectedUsers: function(val) {
            this.filters.users = val.map(x => x.user.user_id)

            axios.post('/api/manager/events', {
                users: this.filters.users
            }).then(response => {
                this.managedEvents = response.data.events
                this.update()
            })
        }
    },
    methods: {
        update () {
            axios.post('/api/dashboard', {
                users: this.selectedUsers
            }).then(response => {
                this.currentTimesone = response.data.current_timesone
                this.monthBooked = response.data.month_booked
                this.monthRevenue = response.data.month_revenue

                this.todaysAvailableSlots = response.data.todays_available_slots
                this.todaysBookedSlots = response.data.todays_booked_slots
                this.todaysActualIncome = response.data.todays_actual_income
                this.todaysPotentialIncome = response.data.todays_potential_income
            })
        }
    }
}
</script>

<style>

</style>
