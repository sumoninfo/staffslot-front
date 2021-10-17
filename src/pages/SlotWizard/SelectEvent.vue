<template>
    <div class="location-box">
        <div class="col-12">
            <h5 v-if="isVideo" class="wizard-text start-wizard-headline">{{ __('Select an event type to get started') }}</h5>
            <h5 v-if="isProduct" class="wizard-text start-wizard-headline">{{ __('Select a product type to get started') }}</h5>
            <!-- <h5 v-else class="wizard-text start-wizard-headline">{{ __('Select an event type to get started or') }} <router-link to="/wizard/custom-event">{{
                    __('create a custom event') }}</router-link>.</h5> -->
            <div class="alert alert-danger" v-show="hasErrors">
                <ul class="list-unstyled">
                    <li v-for="(error, key) in errors" :key="key" v-text="error"></li>
                </ul>
            </div>

            <div v-if="hasEvents">
                <form v-on:submit.prevent="onSubmit" method="post">
                    <div class="event-search container">
                        <div class="form-inline lg-form form-lg">
                            <i class="fa fa-search" aria-hidden="true"></i>
                            <input class="event-search-form form-control form-inline form-control-sm ms-3 col-11" tabindex="0"
                                placeholder="Search" type="text" v-model="query" />
                        </div>
                    </div>
                    <div class="submit-btn-area mt-2">
                        <button class="btn btn-success btn-block w-100" type="submit">
                            <span v-if="!is_loading">{{ __('Select') }}</span>
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
                    <div v-if="hasEvents" class="mt-2">
                        <div class="container w-100 p-0 m-0" v-for="(event, key) in filterdEvents" :key="key">
                            <div class="card event-types col-12">
                                <label v-bind:for="key" class="row event-pick-item">
                                    <div class="col-1">
                                        <input type="radio" class="input-control" name="event_id" v-bind:id="key" v-bind:value="event.event_id"
                                            v-model="event_id">
                                    </div>
                                    <div class="col">
                                        <span v-text="event.title"></span><span v-if="event.minutes">, {{ event.minutes }}</span>
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>
                    <div v-if="is_loading_events" class="text-center">
                        <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    </div>
                    <div class="wizard-buttons">
                    <button class="btn btn-warning me-1" type="button" v-on:click="back()"><i class="fa fa-chevron-left"></i> {{
                        __('Back') }}</button>
                    <button class="btn btn-success select-button w-50" type="submit">
                        <span v-if="!is_loading"><i class="fa fa-chevron-right"></i> {{ __('Select') }}</span>
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
                <!-- <p class="mt-5">{{ __('Create a one-time-use') }} <router-link to="/wizard/custom-event">{{ __('custom\
                        event') }}</router-link>.</p> -->
            </div>

            <div v-show="!hasEvents && !is_loading_events">
                <p v-if="isProduct">{{ __('You have no product types. Create a') }} <router-link :to="{ name: 'createProductType' }">{{ __('reusable type') }}</router-link></p>
                <p v-else>{{ __('You have no events. Create a reusable event') }}</p>
            </div>
        </div>
    </div>
</template>

<script>
import helpers from '../../mixins/helpers.js'
import { mapActions } from 'vuex';
import axios from 'axios'
import _ from 'lodash'

export default {
    mixins: [helpers],

    data() {
        return {
            isVideo: _.get(this, '$route.meta.isVideo', false),
            isProduct: _.get(this, '$route.meta.isProduct', false),
            is_loading: false,
            is_loading_events: false,
            errors: [],
            event_id: null,
            events: [],
            query:''
        }
    },
    async created () {
        if (!this.isVideo && !this.isProduct)
            this.getEvents();
        else if (this.isProduct) {
            if(!this.$store.state.products.types) {
                this.is_loading_events = true;
                await this.fetchTypes();
                this.is_loading_events = false;
            }
            this.events = this.$store.state.products.types;
            this.events = this.events && this.events.map(x => (x.event_id = x.id) && x);
            this.setProduct(null);
        } else {
            this.events = _.get(this, '$store.state.events.events.video') || [];
        }

        if (this.$route.query.event_id){
            this.event_id = this.$route.query.event_id;
        } else if (this.$route.params.productType) {
            this.event_id = this.$route.params.productType.id;
        } else if (this.$route.meta.isProduct && this.$store.state.wizard.product) {
            this.event_id = this.$store.state.wizard.product.id;
        } else {
            this.event_id = _.get(this, '$store.state.wizard.videoSlot.id');
        }
    },
    computed: {
        hasErrors: function () {
            return (this.errors.length > 0);
        },
        hasEvents: function () {
            return (this.events.length > 0);
        },
        filterdEvents: function filterdEvents() {
            if (this.query!="") {
                return this.events.filter( event => { return event.title.match(new RegExp(".*"+this.query+".*", 'gi'))} );
            }else{
                return this.events;
            }
        }
    },
    methods: {
        ...mapActions({ 'setProduct': 'wizard/setProduct', 'fetchTypes': 'products/fetchTypes' }),

        back: function(){
            this.$router.go(-1);
        },
        getEvents: function(){
            this.is_loading_events = true;
            axios.get('/api/wizard/get-events')
            .then((response) => {
                window.scrollTo(0, 0);
                this.events = response.data.events;
            })
            .catch((e) => {
              this.errors.push(e)
            })
            .finally(e => this.is_loading_events = false);
        },
        onSubmit: function(){
            if (this.isVideo)
                return this.addVideoSlot();
            else if (this.isProduct)
                return this.addProduct();

            this.is_loading = true;
            const data = {
                event_id: this.event_id
            };
            axios.post('/api/wizard/select-event', data)
            .then((response) => {
                if(response.data.errors.length > 0){
                    this.is_loading = false;
                    this.errors = response.data.errors;
                    window.scrollTo(0, 0);
                } else {
                    this.errors = [];
                    this.$store.dispatch('wizard/setSlot', response.data.slot);
                    this.$router.push('/wizard/select-location');
                }
            })
            .catch((e) => {
              this.errors.push(e)
            });
        },
        addVideoSlot () {
            if (!this.event_id) {
                this.errors.push('Please select event');
                window.scrollTo(0, 0);
                return;
            }

            const event = this.$store.state.events.events.video.find(x => x.id == this.event_id);
            this.$store.dispatch('wizard/setVideoSlot', { ...this.$store.state.wizard.videoSlot, ...event });
            this.$router.push('/wizard/video/slot-options');
        },
        addProduct () {
            if (!this.event_id) {
                this.errors.push('Please select product type');
                window.scrollTo(0, 0);
                return;
            }

            const productType = this.$store.state.products.types.find(x => x.id == this.event_id);
            this.$store.dispatch('wizard/setProduct', { ...this.$store.state.wizard.product, ...productType });
            this.$router.push({ name: 'wizardProductOptions' });
        }
    }
}
</script>
