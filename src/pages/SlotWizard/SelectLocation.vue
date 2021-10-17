<template>
    <div class="location-box">
        <h5>{{ __('Event Location') }}</h5>
        <h6><span v-text="event_title"></span></h6>
        <p>{{ __('Select a location, enter a new location or click the skip button if no location.') }}</p>
        <div class="alert alert-danger" v-show="hasErrors">
            <ul class="list-unstyled">
                <li v-for="(error, key) in errors" v-text="error"></li>
            </ul>
        </div>

        <form v-on:submit.prevent="onSubmit" method="post">

            <div class="form-group">
                <select class="form-control" type="text" name="location_id" v-model="location_id" v-on:change="onLocationChange">
                    <option value="">{{ __('Choose a location') }}...</option>
                    <option v-for="location in locations" v-text="location.place+' ('+location.address+')'" :value="location.location_id"></option>
                </select>
            </div>

            <hr>

            <div class="form-group">
                <label>{{ __('Place') }}</label>
                <input class="form-control" type="text" name="location_place" v-model="location_place" :placeholder="__('e.g. Barker\'s Field')">
            </div>

            <div class="form-group">
                <label>{{ __('Address') }}</label>
                <input class="form-control" type="text" name="location_address" v-model="location_address" :placeholder="__('e.g. 45 Lane Way')">
            </div>

            <div class="form-check">
                <label class="form-check-label location-select-check">
                    <input type="checkbox" class="form-check-input" value="1" v-model="location_save">
                    {{ __('Save this location to my list.') }}
                </label>
            </div>

            <button class="btn btn-warning mt-2 me-1" type="button" v-on:click="back()">{{ __('Back') }}</button>
            <button class="btn btn-success select-date mt-2" type="submit">
                <span v-if="!is_loading"><i class="fa fa-check"></i> {{ __('Select Location') }}</span>
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
            <button class="btn btn-sm btn-skip mt-2" type="button" v-on:click="onSkip">
                <span>{{ __('Skip Location') }}</span>
            </button>
        </form>
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
            locations: [],
            location_id: "",
            location_place: "",
            location_address: "",
            location_save: "",
        }
    },
    created: function () {
        // this.getSlot();
        this.getLocations();
    },
    computed: {
        hasErrors: function () {
            return (this.errors.length > 0);
        },
        event_title () {
            return this.$store.state.wizard.slot.title
        }
    },
    methods: {
        back: function(){
            this.$router.go(-1);
        },
        onLocationChange: function(){
            this.locations.forEach(function(val){
                if(val.location_id == this.location_id){
                    this.location_place = val.place;
                    this.location_address = val.address;
                }
            }, this);
        },
        getLocations: function(){
            axios.get('/api/wizard/get-locations')
            .then((response) => {
                if(response.data.errors.length > 0){
                    this.errors = response.data.errors;
                    window.scrollTo(0, 0);
                } else {
                    this.errors = [];
                    this.locations = response.data.locations;
                    this.locations.map(x => x.default &&
                        (this.location_id = x.location_id, this.onLocationChange()))
                }
            })
            .catch((e) => {
              this.errors.push(e)
            });
        },
        onSubmit: function(){
            this.is_loading = true;
            const data = {
                location_place: this.location_place,
                location_address: this.location_address,
                location_save: this.location_save,
                slot: this.$store.state.wizard.slot
            };
            axios.post('/api/wizard/select-location', data)
            .then((response) => {
                if(response.data.errors.length > 0){
                    this.is_loading = false;
                    this.errors = response.data.errors;
                } else {
                    this.errors = [];
                    this.$store.dispatch('wizard/setSlot', response.data.slot)
                    this.$router.push('/wizard/select-dates');
                }
            })
            .catch((e) => {
              this.errors.push(e)
            });
        },
        onSkip: function(){
            const data = {
                location_place: "",
                location_address: "",
                location_save: "",
            };
            axios.post('/api/wizard/select-location', data)
            .then((response) => {
                if(response.data.errors.length > 0){
                    this.errors = response.data.errors;
                } else {
                    this.errors = [];
                    this.$router.push('/wizard/select-dates');
                }
            })
            .catch((e) => {
              this.errors.push(e)
            });
        }
    }
}
</script>
