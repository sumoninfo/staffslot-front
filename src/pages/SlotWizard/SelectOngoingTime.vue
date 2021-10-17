<template>
  <div class="location-box">
        <div class="col-12">
            <h5 class="wizard-text">{{ __('Set the Time(s)') }}</h5>
            <h6><span v-text="slot.title"></span></h6>
        </div>
        <div class="card">
            <div class="row">
                <div class="col-md-3 col-sm-12 text-center">
                    <span style="display: block;">{{ __('Start time') }}</span>
                    <strong v-text="slot.date_from"></strong>
                </div>
                <div class="col text-center">
                    <time-picker v-model="fromTime"/>
                </div>
            </div>
        </div>
        <div class="card">
            <div class="row">
                <div class="col-md-3 col-sm-12 text-center">
                    <span style="display: block;">{{ __('End time') }}</span>
                    <strong v-text="slot.date_to"></strong>
                </div>
                <div class="col text-center">
                    <time-picker v-model="toTime"/>
                </div>
            </div>
        </div>
        <div class="text-center">
            <button type="button" class="btn btn-warning" @click="$router.go(-1)">{{ __('Back') }}</button>
            <button type="submit" class="btn btn-success" @click="goNext"><i class="fa fa-check"></i> {{ __('Select') }}</button>
        </div>
  </div>
</template>

<script>
import helpers from '../../mixins/helpers';
import { mapState } from 'vuex';
import moment from 'moment';

export default {
    mixins: [ helpers ],

    data () {
        return {
            fromTime: {
                hour: 6,
                meridium: 'AM',
                minute: '00',
            },
            toTime: {
                hour: 6,
                meridium: 'AM',
                minute: '00',
            }
        }
    },

    computed: {
        ...mapState({ slot: s => s.wizard.slot })
    },

    methods: {
        goNext () {
            const format = 'MM-DD-YYYY hh:mm a';
            const dateFrom = moment(this.slot.date_from + ` ${this.fromTime.hour}:${this.fromTime.minute} ${this.fromTime.meridium}`, format);
            const dateTo = moment(this.slot.date_to + ` ${this.toTime.hour}:${this.toTime.minute} ${this.toTime.meridium}`, format);
            this.slot.minutes = dateTo.diff(dateFrom, 'minutes');
            this.slot.datetimes = [ dateFrom.format('YYYY-MM-DD HH:mm:ss') ];
            this.slot.dateFrom = dateFrom;
            this.slot.dateTo = dateTo;
            this.$store.dispatch('wizard/setSlot', this.slot);
            this.$router.push('/wizard/select-promo-video');
        }
    }
}
</script>

<style>

</style>
