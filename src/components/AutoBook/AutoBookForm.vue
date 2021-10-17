<template>
    <div class="col-12">

        <div class="row justify-content-center">
            <div class="col-auto">

                <p id="autobook-error" class="alert alert-danger" v-if="errors.length">
                    <b>{{ __('Please correct the following error(s):') }}</b>
                    <ul>
                        <li v-for="error in errors">{{ error }}</li>
                    </ul>
                </p>

            </div>
        </div>

        <div class="row my-4">
            <div class="col-md-3">
                <label for="autobook-name">{{ __('Title') }}</label>
            </div>
            <div class="col-md-9">
                <input class="form-control" type="text" v-model="autoBook.name" id="autobook-name" tabindex="0">
            </div>
        </div>
        <hr>

        <div class="row my-4">
            <div class="col-md-3">
                <label for="autobook-pro">{{ __('Pro') }}</label>
            </div>
            <div class="col-md-9">

                <multiselect
                v-model="pro"
                label="full_name"
                track-by="user_id"
                :searchable="true"
                :options="bookedPros"
                placeholder="Select Pro">
                </multiselect>

            </div>
        </div>
        <hr>

        <div class="row my-4">
            <div class="col-md-3">
                <label for="autobook-event">{{ __('Event') }}</label>
            </div>
            <div class="col-md-9">
                <multiselect
                v-model="event"
                label="title"
                track-by="event_id"
                :searchable="true"
                :options="proEvents"
                placeholder="Select Event">
                </multiselect>

            </div>
        </div>
        <hr>

        <div class="row my-4">
            <div class="col-md-3">
                <label for="autobook-week-days">{{ __('Week Days') }}</label>
            </div>
            <div class="col-md-9">
                <multiselect
                v-model="weekDaysSelected"
                label="text"
                :multiple="true"
                :close-on-select="false"
                :searchable="true"
                track-by="value"
                :options="weekdays"
                placeholder="Select Week Days">
                </multiselect>
            </div>
        </div>
        <hr>

        <div class="row mt-4">
            <div class="col-md-3">
                <label>{{ __('Time Range') }}</label>
            </div>
            <div class="col-md-3">
                <time-picker v-model="autoBook.time_range_start"></time-picker>
            </div>
            <div class="col-md-3">
                <time-picker v-model="autoBook.time_range_end"></time-picker>
            </div>
        </div>

        <div class="row my-4">
            <div class="col-md-3">
                <label for="autobook-active">{{ __('Is Active') }}</label>
            </div>
            <div class="col-md-9">
                <input v-model="autoBook.is_active" id="autobook-active" class="form-control js-switch" type="checkbox" value="1" checked>
            </div>
        </div>
        <hr>

        <div class="row my-4">
            <div class="col-md-3">
                <strong>{{ __('Payment Types') }}</strong>
            </div>
            <div class="col-md-3">
                <input v-model="autoBook.is_cash" id="autobook-cash" class="input-control js-switch" type="checkbox" value="1" checked>
                <label for="autobook-cash">{{ __('Cash') }}</label>
            </div>
            <div class="col-md-3">
                <input v-model="autoBook.is_club_credit" id="autobook-club-credit" class="input-control js-switch" type="checkbox" value="1" checked>
                <label for="autobook-club-credit">{{ __('Club Credit') }}</label>
            </div>
            <div v-if="false && ('hide for now')"  class="col-md-3">
                <input v-model="autoBook.is_package" id="autobook-package-credit" class="input-control js-switch" type="checkbox" value="1" checked>
                <label for="autobook-package-credit">{{ __('Package Credit') }}</label>
            </div>
        </div>
        <hr>

        <div class="row mt-4">
            <div class="col-12 text-center">
                <button :class="{'btn btn-success':true, 'disabled':isSaving}" :disabled="isSaving" @click="save">
                    <i v-if="isSaving" class="fa fa-cog fa-spin" aria-hidden="true"></i>
                    <i v-else class="fa fa-floppy-o" aria-hidden="true"></i>
                    {{ __('Save') }}
                </button>
                <button :class="{'btn btn-dark':true, 'disabled':isSaving}" :disabled="isSaving" @click="resetForm">
                    <i class="fa fa-refresh" aria-hidden="true"></i>
                    {{ __('Reset') }}
                </button>
            </div>
        </div>

    </div>
</template>
<script type="text/javascript">
        import axios from 'axios'
        import helpers from '../../mixins/helpers'
        import Swal from 'sweetalert2'

        export default{
            props:{
                autobook:Object,
                weekdays:Array,
            },
            mixins: [helpers],            
            data(){
                return {
                    time:{
                        hour:'09',
                        minute:'00',
                        meridium:'AM'
                    },
                    autoBook:{},
                    events:[],
                    pro:{},
                    event:{},
                    ajaxloading:true,
                    weekDaysSelected:[],
                    timePickerOptions:{
                        format: 'LT',
                        useCurrent: false,
                        showClear: true,
                        showClose: true,
                    },
                    errors:[],
                    bookedEvents:[],
                    proEvents:[],
                    myPros:[],
                    switchery:[],
                    isSaving:false,
                }
            },
            watch:{
                is_active(){
                    switcheryOnChangeManual()
                },
                pro(newPro,oldPro){
                    this.getProEvents();
                    if (Object.keys(oldPro).length !=0) {
                        this.event = {};

                    }
                },
                event(event){
                    if (event && event.event_id) {
                        this.autoBook.event_id = event.event_id
                    }else{
                        this.autoBook.event_id = "";
                    }
                },
                weekDaysSelected(weekDaysSelected){
                    var week_days = [];
                    for (var i = 0; i < weekDaysSelected.length; i++) {
                        week_days[i] = weekDaysSelected[i].value;
                    }
                    this.autoBook.week_days = week_days;
                },
            },
            methods:{
                validateForm(){
                    this.errors = [];
                    var i=0;

                    if (!this.autoBook.name) {
                        this.errors[i++] = "AutoBook name can not be blank";
                    }

                    if (this.autoBook.event_id=="") {
                        this.errors[i++] = "AutoBook Event must be selected";
                    }

                    if (!this.autoBook.week_days || this.autoBook.week_days.length<=0) {
                        this.errors[i++] = "Select at least 1 day of the week for AutoBook";
                    }

                    if (!this.autoBook.time_range_start) {
                        this.errors[i++] = "Select time for AutoBook";
                    }

                    if (!this.autoBook.is_cash && !this.autoBook.is_club_credit && !this.autoBook.is_package) {
                        this.errors[i++] = "Select atleast 1 payment method";
                    }
                    if(this.errors.length){
                        return false;
                    }
                    return true;
                },
                resetForm(){
                    this.autoBook = Object.assign({},this.autobook);
                    this.pro = this.autobook.pro;
                    this.event = this.autobook.event;

                    if (this.autobook.week_days) {
                        var count = 0;
                        for (var i = 0; i < this.weekdays.length; i++) {
                            if (
                                this.autobook.week_days
                                .indexOf(this.weekdays[i].value) > -1
                            ) {
                                    this.weekDaysSelected[count++] = Object.assign({},this.weekdays[i]);
                            }
                        }

                    }

                },
                save(){
                    if (this.validateForm()) {
                        if (this.isSaving) {
                            return;
                        }
                        this.isSaving = true;
                        axios.post(route('autoBook.store'),this.autoBook)
                            .then(response => {

                                // this.isSaving = false; //disabled for redirecting after save
                                swal ({
                                    title:"Success",
                                    text:"AutoBook Saved!",
                                    type:"success"
                                },
                                function () {
                                    window.location = "/autobook";
                                });
                            })
                            .catch(error => {
                                this.isSaving = false;
                                console.log(error)
                            });

                    }else{
                        //TODO:scroll top
                        $('html').scrollTop(0);
                    }
                },

                getPros(){
                    axios.get("/api/customers/my-pros")
                        .then( response => {
                            this.myPros = response.data;
                        })
                        .catch(error => console.log(error));
                },
                getProEvents(){
                    if (this.pro) {
                        axios.get("/api/customers/pro/"+ this.pro.user_id +"/events")
                            .then( response => {
                                this.proEvents = response.data;
                            })
                            .catch(error => console.log(error));
                    }
                },

            },
            computed:{
                bookedPros(){
                    var pros = [];
                    var count=0;
                    for (var i = 0; i < this.myPros.length; i++) {
                        // console.log(this.myPros[i]);
                        if (this.myPros[i]!=null) {
                            pros[this.myPros[i].user_id] = this.myPros[i].account;
                        }
                    }
                    return pros;
                },
            },
            created(){
                this.resetForm();
                this.getPros();
            },
            mounted(){
            },
        };

</script>
