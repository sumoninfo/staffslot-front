<template>
    <div class="location-box">
        <h5>{{ __('Select the Date(s)') }}</h5>
        <h6> <span v-text="event_title"></span></h6>
        <p>{{ __('Add event to these days') }}</p>
        <div class="alert alert-danger" v-show="hasErrors">
            <ul class="list-unstyled">
                <li v-for="(error, key) in errors" :key="key" v-text="error"></li>
            </ul>
        </div>
        <div class="date-preload-text" v-if="!isOngoing">
            <a href="#" class="preload-text" v-on:click.prevent="onNextDays(6)">{{ __('Load next 7 days') }}</a>  <a
                href="#" class="preload-text" v-on:click.prevent="onNextDays(14)">{{ __('Load next 14 days') }}</a>
        </div>
        <div class="mt-3 mb-3 date-selector">
            <span>{{ __('From') }} </span>
            <date-picker class="date-selection" v-model="date_from" />
            <span>{{ __('to') }} </span>
            <date-picker class="date-selection" v-model="date_to" />
            <button v-if="dates.length" @click="selectAll" class="btn btn-warning">{{ __('Select all') }}</button>
        </div>
        <form v-on:submit.prevent="onSubmit" method="post">
            <div v-if="loading_dates" class="checkbox mb-2 text-center">
                <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            </div>
            <div class="checkbox mb-2" v-for="(date, key) in dates" :key="key">
                <input v-bind:id="key" type="checkbox" v-model="date.selected" true-value="1" false-value="0">
                <label v-bind:for="key" v-text="date.pretty"></label>
            </div>
            <div class="wizard-buttons">
            <button class="btn btn-warning me-1" type="button" v-on:click="back()">{{ __('Back') }}</button>
            <button class="btn btn-success select-date" type="submit">
                <span v-if="!is_loading"><i class="fa fa-check"></i> {{ __('Select Dates') }}</span>
                <div class="la-ball-spin-clockwise la-sm" v-if="is_loading">
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
            </button>
            </div>
        </form>
    </div>
</template>

<script>
import $ from 'jquery'
import axios from 'axios'
import moment from 'moment'
import helpers from '../../mixins/helpers.js'
import { mapState } from 'vuex';

export default {
    mixins: [helpers],

    data() {
        return {
            is_loading: false,
            errors: [],
            dates: [],
            date_from: "",
            date_to: "",
            date_from_picker: null,
            date_to_picker: null,
            loading_dates: false
        }
    },
    watch: {
        date_from() {
            this.onChangeDatePeriod();
        },

        date_to() {
            this.onChangeDatePeriod();
        }
    },
    computed: {
        ...mapState({ slot: s => s.wizard.slot }),
        hasErrors: {
            cache: false,
            get: function () {
                return (this.errors.length > 0);
            }
        },
        event_title () {
            return this.$store.state.wizard.slot.title
        },
        isOngoing() {
            return this.slot.event.multiday_type == 'ongoing';
        }
    },
    methods: {
        onNextDays: function(days){
            const from = moment();
            const to = moment().add(days, 'days');
            this.date_from = from.format('YYYY-MM-DD');
            this.date_to = to.format('YYYY-MM-DD');

            this.getDates();
        },
        onChangeDatePeriod: function(){
            if(this.date_from == ""){
                this.errors = ['Please select from date'];
                return false;
            }
            if(this.date_to == ""){
                this.errors = ['Please select to date'];
                return false;
            }
            this.getDates();
        },
        back: function(){
            this.$router.go(-1);
        },
        getDates: function(){
            this.dates = [];
            this.loading_dates = true;
            axios.get(`/api/wizard/get-dates?from=${moment(this.date_from).format('YYYY-MM-DD')}&to=${moment(this.date_to).format('YYYY-MM-DD')}`)
            .then((response) => {
                if(response.data.errors.length > 0){
                    this.errors = response.data.errors;
                } else {
                    this.errors = [];
                    this.dates = response.data.dates;
                }
            })
            .catch((e) => {
              this.errors.push(e)
            }).finally(() => this.loading_dates = false);
        },
        selectAll () {
            this.dates.map(x => x.selected = 1);
        },
        onSubmit: function(){
            if (this.isOngoing) {
                return this.onOngoingSubmit();
            }

            this.is_loading = true;
            const data = {
                dates: this.dates,
                slot: this.$store.state.wizard.slot
            };
            axios.post('/api/wizard/select-dates', data)
            .then((response) => {
                if(response.data.errors.length > 0){
                    this.is_loading = false;
                    this.errors = response.data.errors;
                } else {
                    this.errors = [];
                    this.$store.dispatch('wizard/setSlot', response.data.slot)
                    this.$router.push('/wizard/select-time');
                }
            })
            .catch((e) => {
              this.errors.push(e)
            });
        },
        onOngoingSubmit () {
            if (!this.date_from || !this.date_to) {
                return this.errors.push('Please select date from and date to.');
            }

            this.slot.date_from = this.date_from;
            this.slot.date_to = this.date_to;
            this.errors = [];
            this.$store.dispatch('wizard/setSlot', this.slot)
            this.$router.push('/wizard/select-ongoing-time');
        },
        onPreviousWeek: function(){
            if(this.week > 0){
                this.week--;
                this.getDates();
            }
        },
        onNextWeek: function(){
            this.week++;
            this.getDates();
        }
    }
}
</script>

