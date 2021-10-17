<template>
    <div class="text-center">
        <div v-if="errorMessage" class="row alert alert-danger form-error-message">
            {{ errorMessage }}
        </div>
        <div v-if="successMessage" class="row alert alert-success form-success-message">
            {{ successMessage }}
        </div>
        <div class="form-group text-start">
            <label>{{ __('Name') }}</label>
            <input v-model="guest.name" type="text" class="form-control">
            <div class="form-control-feedback text-danger" v-if="formErrors.name">{{ formErrors.name[0] }}</div>
        </div>
        <div class="form-group text-start">
            <label>{{ __('Email') }}</label>
            <input v-model="guest.email" type="text" class="form-control">
            <div class="form-control-feedback text-danger" v-if="formErrors.email">{{ formErrors.email[0] }}</div>
        </div>
        <div class="form-group text-start">
            <label>{{ __('Phone') }}</label>
            <input v-model="guest.phone" type="text" class="form-control">
            <div class="form-control-feedback text-danger" v-if="formErrors.phone">{{ formErrors.phone[0] }}</div>
        </div>
        <div class="form-group text-start">
            <label>{{ __('Note (optional)') }}</label>
            <textarea v-model="guest.notes" class="form-control" rows="3"></textarea>
        </div>
        <div class="row justify-content-center mb-3">
            <strong class="col-4 pt-2 mb-4">{{ __('How many slots?:') }} </strong>
            <select v-model="guest.quantity" class="form-control col-2">
                <option
                    v-for="i in slot.slots"
                    :key="i"
                    :value="i"
                    :disabled="i > slot.available_slots"
                    v-text="i"
                    ></option>
            </select>
        </div>
        <div class="form-group">
            <div @click="alertBeforeEnabled =! alertBeforeEnabled" class="checkbox checkbox-info form-check-inline ps-0" style="display: inline;">
                <input type="checkbox" v-model="alertBeforeEnabled" value="1" name="terms">
                <label>{{ __('Alert before') }}</label>
            </div>
            <select :disabled="!alertBeforeEnabled" v-model="alertBeforeHours" class="form-control col-sm-2" style="max-width: 60px !important; display: inline;">
                <option :value="0">-</option>
                <option v-for="i in 12" :value="i*60" :key="i">{{ i }}</option>
            </select>
            <span class="mt-4"> {{ __('hours') }}</span>
            <select :disabled="!alertBeforeEnabled" v-model="alertBeforeMins" class="form-control col-sm-2" style="max-width: 60px !important; display: inline;">
                <option :value="0">-</option>
                <option v-for="i in minutesRange" :value="i" :key="i">{{ i }}</option>
            </select>
            <span class="mt-4"> {{ __('minutes') }}</span>
        </div>
        <div class="form-group">
            <div @click="guest.agreed =! guest.agreed" class="checkbox checkbox-info form-check-inline ps-0">
                <input type="checkbox" v-model="guest.agreed" value="1" name="terms">
                <label>{{ __('I agree') }}. <a href="#" data-bs-toggle="modal" data-bs-target="#myProClientModal">{{ __('Terms &amp; Conditions') }}</a> ({{ __('Pro &amp; Client') }})</label>
            </div>
            <div class="form-control-feedback text-danger" v-if="formErrors.agreed">{{ formErrors.agreed[0] }}</div>
        </div>
        <pay-buttons
            :validate="validate"
            :email="guest.email"
            :description="`Payment for ${slotObj.title}`"
            :cost="slotObj.cost"
            :cash="slotObj.payment_cash"
            :stripe="slotObj.payment_credit_card"
            :stripeMetadata="{ guest }"
            :credits="false"
            @pay="book"
        />
    </div>
</template>

<script>
import axios from 'axios'
import helpers from '../../mixins/helpers';

export default {
    mixins: [ helpers ],

    props: {
        slotObj: Object
    },

    data () {
        return {
            slot: this.slotObj,
            guest: {
                name: null,
                email: null,
                phone: null,
                notes: null,
                agreed: null,
                quantity: 1,
                alert_before: null
            },
            alertBeforeEnabled: false,
            alertBefore: null,
            alertBeforeHours: 0,
            alertBeforeMins: 0,
            successMessage: null,
            errorMessage: null,
            formErrors: {}
        }
    },

    watch: {
        alertBeforeHours () {
            this.alertBefore = this.alertBeforeHours + this.alertBeforeMins;
        },

        alertBeforeMins () {
            this.alertBefore = this.alertBeforeHours + this.alertBeforeMins;
        },
    },

    computed: {
        minutesRange() {
            let range = [];
            for (let i=5; i<=55; i+=5) range.push(i);
            return range;;
        }
    },

    methods: {
        validate () {
            this.formErrors = {};

            const errors = ['name', 'email', 'phone', 'agreed'].filter(x => {
                if (!this.guest[x]) {
                    this.formErrors[x] = [x == 'agreed' ? 'Terms and Conditions must be agreed.' : `The ${x} field is required.`];
                    return true;
                }
                return false;
            });

            return errors.length === 0;
        },

        async book (currency, data) {
            this.errorMessage = null;
            this.formErrors = {};

            this.guest.alert_before = this.alertBeforeEnabled ? this.alertBefore : null;

            try {
                const response = await axios.put(`/api/slot/${this.slot.slot_id}/book-as-guest`, {
                    with: currency,
                    ...data,
                    ...this.guest
                });

                if (response.data.success){
                    this.$emit('success');
                }else
                    this.errorMessage = response.data.message;

            } catch (error) {
                if (error.response && error.response.status === 422) {
                    this.formErrors = error.response.data.errors;
                    this.errorMessage = error.response.data.message;
                } else {
                    this.errorMessage = error.message;
                }
            }
        }
    }
}
</script>

<style scoped>
    .checkbox label::before, .checkbox label::after {
        cursor: pointer;
    }
</style>