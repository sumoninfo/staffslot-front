<template>
    <div class="location-box" style="padding-left: 1rem; padding-right: 1rem; /* .location-box has padding 3% but it looking bad with v-switch component */">
        <div class="alert alert-danger" v-show="hasErrors">
            <ul class="list-unstyled">
                <li v-for="(error, key) in errors" v-text="error"></li>
            </ul>
        </div>
        <form v-on:submit.prevent="onSubmit" method="post">
            <table class="table">
                <thead>
                    <tr>
                        <th colspan="2" class="confirm-area">
                            <h5 class="confirm-time-text">{{ __('Confirm Time Slot Details') }}</h5>
                        </th>
                    </tr>
                </thead>
                <tbody class="wizard-body confirm-body mt-2">
                    <tr>
                        <td colspan="2">
                            <div class="text-center mb-2">
                                <div v-for="video in slot.promoVideo" :key="video.id" style="display: inline-table; margin: 1px;">
                                    <video-thumb v-if="video" :video="video" style="width: 275px; height: 155px;" />
                                </div>
                                <div v-for="image in slot.images" :key="image.id" style="display: inline-table; margin: 1px;">
                                    <image-thumb :image="image" />
                                </div>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td class="confirm-slot-field"><strong>{{ __('Event') }}</strong></td>
                        <td v-text="slot.title"></td>
                    </tr>
                    <tr>
                        <td class="confirm-slot-field"><strong>{{ __('Description') }}</strong></td>
                        <td v-text="slot.description"></td>
                    </tr>
                    <tr>
                        <td class="confirm-slot-field"><strong>{{ __('Location') }}</strong></td>
                        <td>
                            <span v-text="slot.location_place"></span> (<span v-text="slot.location_address"></span>)
                        </td>
                    </tr>
                    <tr>
                        <td class="confirm-slot-field"><strong>{{ __('Notes') }}</strong></td>
                        <td v-text="slot.notes"></td>
                    </tr>
                    <tr>
                        <td class="confirm-slot-field"><strong>{{ __('Duration') }}</strong></td>
                        <td v-text="duration"></td>
                    </tr>
                    <tr>
                        <td class="confirm-slot-field"><strong>{{ __('Cost per slot') }}</strong></td>
                        <td>$<span v-text="cost_pretty"></span></td>
                    </tr>
                    <tr v-show="slotNotFree">
                        <td class="confirm-slot-field"><strong>{{ __('Potential earnings') }}</strong></td>
                        <td>$<span v-text="potential_earnings"></span></td>
                    </tr>
                    <tr>
                        <td class="confirm-slot-field"><strong>{{ __('Slots') }}</strong></td>
                        <td v-text="slot.slots"></td>
                    </tr>
                    <tr>
                        <td class="confirm-slot-field" colspan="2">
                            <h5 class="dt-hdr-txt">{{ __('Confirm Dates &amp; Times') }}</h5>
                        </td>
                    </tr>
                    <tr v-if="stateSlot.event.is_multiday && stateSlot.event.multiday_type == 'ongoing'" class="confirm-slot-row">
                        <td><strong>{{ __('From') }}:</strong></td>
                        <td v-text="ongoingFrom"></td>
                    </tr>
                    <tr v-if="stateSlot.event.is_multiday && stateSlot.event.multiday_type == 'ongoing'" class="confirm-slot-row">
                        <td><strong>{{ __('To') }}:</strong></td>
                        <td v-text="ongoingTo"></td>
                    </tr>
                    <tr v-if="!(stateSlot.event.is_multiday && stateSlot.event.multiday_type == 'ongoing')"
                        class="confirm-slot-row"
                        v-for="(datetime, key) in datetimes"
                        :key="key">
                        <td><strong>{{ __('Slot') }} #<span v-text="key+1"></span>:</strong></td>
                        <td v-text="datetime"></td>
                    </tr>
                </tbody>
            </table>
            <div class="container">
                <div class="form-group">
                    <label class="form-check-label" for="is_private_checkbox">{{ __('Make this a private time slot.') }}</label>
                    <div class="mt-3 d-i-table form-check form-switch ms-2">
                        <input id="is_private_checkbox" class="form-check-input" type="checkbox" v-model="slot.is_private">
                    </div>
                </div>
            </div>
            <div v-if="true" class="container">
                <div class="form-group">
                    <label class="form-check-label" for="overbook_cancel_checkbox">{{ __('First Book First Serve') }}</label>
                    <div class="mt-3 d-i-table form-check form-switch ms-2">
                        <input id="overbook_cancel_checkbox" class="form-check-input" type="checkbox" v-model="slot.overbook_cancel">
                    </div>
                    <span class="ps-2 d-i-table">{{ __('Cancel Overlapping "First Book First Serve" slots if one of them gets booked') }}</span>
                </div>
            </div>
            <div class="confirm-button-set text-center" style="margin: 0 -5px">
                <router-link class="btn btn-danger cancel-link me-1" :to="{ name: 'slotList' }">{{ __('Cancel') }}</router-link>
                <button class="btn btn-warning me-1" type="button" v-on:click="back()">{{ __('Back') }}</button>
                <button class="btn btn-success" type="submit">
                    <span v-if="!is_loading">{{ __('Confirm and Add') }}</span>
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
import axios from 'axios'
import helpers from '../../mixins/helpers.js'
import { mapState } from 'vuex';
import moment from 'moment'
import ImageThumb from '../../components/ImageThumb.vue'

export default {
    mixins: [helpers],

    components: {
      ImageThumb
    },

    data() {
        return {
            is_loading: false,
            errors: [],
            slot: {
                title: "",
                description: "",
                notes: "",
                minutes: "",
                slots: "",
                cost: "",
                payment_cash: 0,
                payment_credit_card: 0,
                alert_before: 0,
                is_private:false,
                overbook_cancel:false,
                has_clashes:false,
            },
            duration: null,
            cost_pretty: null,
            potential_earnings: null,
            datetimes: []
        }
    },
    created: function () {
        this.getSlot();
    },
    computed: {
        ...mapState({ stateSlot: s => s.wizard.slot }),

        ongoingFrom () {
            return moment(this.stateSlot.dateFrom).format('ddd MM/DD/YYYY hh:mma');
        },

        ongoingTo () {
            return moment(this.stateSlot.dateTo).format('ddd MM/DD/YYYY hh:mma');
        },

        hasErrors: {
            cache: false,
            get: function () {
                return (this.errors.length > 0);
            }
        },
        slotNotFree: {
            cache: false,
            get: function () {
                return (this.potential_earnings > 0);
            }
        }
    },
    methods: {
        back: function(){
            this.$router.go(-1);
        },
        getSlot: function(){
            axios.post('/api/wizard/get-slot', { slot: this.$store.state.wizard.slot })
            .then((response) => {
                window.scrollTo(0, 0);
                if(response.data.errors.length > 0){
                    this.errors = response.data.errors;
                    window.scrollTo(0, 0);
                } else {
                    this.errors = [];
                    this.slot = {...this.slot, ...response.data.slot};
                    this.duration = response.data.duration;
                    this.datetimes = response.data.datetimes;
                    this.cost_pretty = response.data.cost_pretty;
                    this.potential_earnings = parseFloat(response.data.potential_earnings.replace(',', '')).toFixed(2);
                }
            })
            .catch((e) => {
              this.errors.push(e)
            });
        },
        onSubmit: function(){
            this.is_loading = true;
            const data = {
                slot_is_private: this.slot.is_private,
                alert_before: this.slot.alert_before,
                slot: {...this.$store.state.wizard.slot, ...{overbook_cancel: this.slot.overbook_cancel}}
            };

            this.emitter.emit('loadingStart');

            axios.post('/api/wizard/confirm-slot', data)
            .then((response) => {
                if(response.data.errors.length > 0){
                    this.is_loading = false;
                    this.errors = response.data.errors;
                    window.scrollTo(0, 0);
                } else {
                    this.errors = [];
                    this.$store.dispatch('fetchSlots')
                    this.$store.commit('setFlashMessage', 'You have successfully added new time slots.');
                    this.$router.push('/slot/list');
                }

                this.emitter.emit('loadingStop');
            })
            .catch((e) => {
              this.errors.push(e)
            });
        }
    }
}
</script>
<style scoped>
    .d-i-table {
        display: inline-table;
        vertical-align: middle;
    }
</style>
