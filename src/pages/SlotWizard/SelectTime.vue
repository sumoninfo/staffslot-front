<template>
    <div class="location-box">
        <div class="col-12">
            <h5 class="wizard-text">{{ __('Set the Time(s)') }}</h5>
            <h6><span v-text="event_title"></span></h6>
            <p>{{ __('Event Length') }}: <span v-text="slot_min"></span></p>
            <div class="alert alert-danger" v-show="hasErrors">
                <p>{{ __('ALERT: Time Slots already exist for one or more of the selected times. Click the "Overbook time\
                    slot" button to proceed, or to prevent overbooking edit the time(s) selected below.') }} <a data-bs-toggle="collapse"
                        href="#collapseExample" aria-expanded="false" aria-controls="collapseExample">{{ __(' Click to\
                        review the overbooking details') }}</a>.
                    <span class="collapse" id="collapseExample">
                        <ul class="list-unstyled">
                            <li v-for="(error, key) in errors" :key="key" v-text="error"></li>
                        </ul>
                    </span>
                </p>
            </div>

            <div v-if="clashes_has_bookings" class="row">
                <div class="container text-center">
                    <div class="alert alert-danger">
                        {{ __('Some of overlapping Time Slots has bookings') }}
                    </div>
                </div>
            </div>

            <form v-on:submit.prevent="onSubmit" method="post">

                <div class="container">
                    <template v-for="qindex in quantity" :key="qindex">
                        <div class="card time-slot-card" v-if="!is_multiday">
                            <div class="row">
                                <h6 class="col-md-3 col-sm-12 text-center">{{ __('Time Slot') }} #{{qindex}}</h6>
                                <div class="col">
                                    <time-picker @change="onResetClashes" v-model="slot_times[qindex-1]" />
                                </div>

                                <div class=" close-button">
                                    <a v-if="quantity>1" v-on:click="removeTime(qindex-1)"><i class="fa fa-times"></i></a>
                                </div>

                            </div>
                        </div>
                    </template>

                    <div class="col-12" v-if="is_multiday">
                        <div class="card" v-for="(date, dateindex) in slot_dates" :key="dateindex">
                            <div class="row">
                                <div class="col-md-3 col-sm-12 text-center">
                                    <strong v-text="date"></strong>
                                </div>
                                <div class="col">

                                    <select class="time-select custom-select mb-2 me-sm-2 mb-sm-0" name="hour_id[]" v-model="slot_times[dateindex].hour"
                                        v-on:change="onResetClashes">
                                        <option v-for="(hour, key) in times.hours" :key="key" v-bind:value="hour.hour_id">{{
                                            hour.title }}</option>
                                    </select>

                                    <select class="time-select custom-select mb-2 me-sm-2 mb-sm-0" name="minute_id[]"
                                        v-model="slot_times[dateindex].minute" v-on:change="onResetClashes">
                                        <option v-for="(minute, key) in times.minutes" :key="key" v-bind:value="minute.minute_id">{{
                                            minute.title }}</option>
                                    </select>

                                    <select class="time-select custom-select mb-2 me-sm-2 mb-sm-0" name="meridiem[]"
                                        v-model="slot_times[dateindex].meridiem" v-on:change="onResetClashes">
                                        <option v-for="(meridiem, key) in times.meridiems" :key="key" v-bind:value="meridiem">{{
                                            meridiem }}</option>
                                    </select>

                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="row" v-if="!is_multiday">
                        <div class="container text-center add-time-area">
                            <button :disabled="quantity>=24" type="button" v-on:click="increaseQuantity" class="btn btn-default btn-block"><i
                                    class="fa fa-calendar-plus-o"></i> {{ __('Add another time slot') }}</button>
                        </div>
                    </div>

                    <div class="col-12 set-time-button-set">
                        <button class="btn btn-warning waves-effect waves-light pt-2 me-1" type="button" v-on:click="back()">{{
                            __('Back') }}</button>
                        <button class="btn btn-success select-date waves-effect waves-light pt-2" v-show="!has_clashes">
                            <span v-if="!is_loading"><i class="fa fa-check"></i></span> {{ __('Select') }}
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
                        <button class="btn btn-success select-date" type="button" v-show="has_clashes" v-on:click="onOverbook">
                            <span v-if="!is_loading">{{ __('Overbook time slot') }}</span>
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
                </div>
            </form>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import helpers from '../../mixins/helpers.js'

export default {
    mixins: [helpers],

    data() {
        return {
            is_loading: false,
            errors: [],
            quantity:0,
            default_times:{hour:6,minute:0,meridiem:'AM'},
            slot_dates:[],
            slot_times:[],
            is_multiday:false,
            slot_min:'',
            times: {
                hours: [],
                minutes: [],
                meridiems: [],
            },
            time: {
            },
            event_title: "",
            has_clashes: false,
            clashes_has_bookings: false,
        }
    },
    created: function () {
        this.getTimes();
        this.getSlot();
        if (this.quantity==0) {
            this.increaseQuantity();
        }
    },
    computed: {
        hasErrors: {
            cache: false,
            get: function () {
                return (this.errors.length > 0);
            }
        }
    },
    methods: {
        back: function(){
            this.$router.go(-1);
        },
        increaseQuantity:function increaseQuantity() {
            if (this.quantity<24) {
                var temp_clone;
                if (this.quantity) {
                    var temp_clone = Object.assign({},this.slot_times[this.quantity-1]);
                }else{
                    var temp_clone = Object.assign({},this.default_times);
                }
                temp_clone.hour++;
                this.slot_times.push(temp_clone);
                this.quantity++;

                if (temp_clone.hour==12) {
                    if (temp_clone.meridiem=="AM") {
                        temp_clone.meridiem="PM";
                    }else{
                        temp_clone.meridiem="AM";
                    }
                }
                if (temp_clone.hour>12) {
                    temp_clone.hour=1
                }
            }
        },
        removeTime: function removeTime(index) {
            if (this.quantity<2) {
                return;
            }
            if (index>-1) {
                this.quantity--;
                this.slot_times.splice(index,1);
            }
        },
        switchMeridiem: function switchMeridiem() {
            if (this.default_times.meridiem=="AM") {
                this.default_times.meridiem="PM";
            }else{
                this.default_times.meridiem="AM";
            }
        },
        getSlot: function(){
            axios.post('/api/wizard/get-slot', { slot: this.$store.state.wizard.slot })
            .then((response) => {
                window.scrollTo(0, 0);
                if(response.data.errors!= null && response.data.errors.length > 0){
                    this.errors = response.data.errors;
                } else {
                    this.errors = [];
                    this.event_title = response.data.slot.title;
                    this.slot_min = response.data.slot.minutes +' mins';
                    this.slot_dates = response.data.slot.dates_formated;
                    this.is_multiday = response.data.is_multiday;
                    if(this.is_multiday){
                        this.slot_times = [];
                        for (var i = 0; i <= this.slot_dates.length; i++) {
                            this.slot_times[i] = Object.assign({},this.default_times);
                        }
                    }
                    if (response.data.slot.slot_times && response.data.slot.slot_times.length>0) {
                        this.slot_times = response.data.slot.slot_times;
                        this.quantity = response.data.slot.slot_times.length;
                    }
                }
            })
            .catch((e) => {
              console.log(e);
              this.errors.push(e)
            });
        },
        getTimes: function(){
            axios.get('/api/wizard/get-times')
            .then((response) => {
                if(response.data.errors.length > 0){
                    this.errors = response.data.errors;
                    window.scrollTo(0, 0);
                } else {
                    this.errors = [];
                    this.times.hours = response.data.hours;
                    this.times.minutes = response.data.minutes;
                    this.times.meridiems = response.data.meridiems;
                }
            })
            .catch((e) => {
              this.errors.push(e)
            });
        },
        onResetClashes: function(){
            this.has_clashes = false;
            this.clashes_has_bookings = false;
        },
        onOverbook: function(){
            this.onSubmit();
            // const that = this;
            // swal({
            //     title: 'Overbook time slot?',
            //     text: Lang.get('js.no-revert-possible'),
            //     type: 'info',
            //     showCancelButton: true,
            //     confirmButtonText: 'Yes',
            // }, function () {
            //     that.onSubmit();
            // });
        },
        onSubmit: function(){
            this.is_loading = true;
            const data = {
                slot_times:this.slot_times,
                has_clashes: this.has_clashes,
                slot: this.$store.state.wizard.slot
            };
            axios.post('/api/wizard/select-time', data)
            .then((response) => {
                if(response.data.errors.length > 0){
                    window.scrollTo(0, 0);
                    this.is_loading = false;
                    this.errors = response.data.errors;
                    if(response.data.has_clashes){
                        this.has_clashes = response.data.has_clashes;
                        this.clashes_has_bookings = response.data.clashes_has_bookings;
                    }
                } else {
                    this.errors = [];
                    this.$store.dispatch('wizard/setSlot', response.data.slot);
                    this.$router.push('/wizard/images');
                }
            })
            .catch((e) => {
              this.errors.push(e)
            });
        }
    }
}
</script>
