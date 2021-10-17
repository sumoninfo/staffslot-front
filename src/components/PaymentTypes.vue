<template>
    <div>
        <label class="event-label">{{ __('Select payment options for this event') }}</label>
        <small class="form-text">{{ __('All events accept package credits by default. The "package credits only" option requires customers to buy a package in order to book a slot') }}.</small>

        <div class="checkbox">
            <input type="checkbox" id="ch0" v-model="package_only">
            <label for="ch0">{{ __('Package credits only') }}</label>
        </div>

        <div class="checkbox">
            <input type="checkbox" id="ch1" v-model="payment_cash">
            <label for="ch1">{{ __('Cash') }}</label>
        </div>

        <div class="checkbox">
            <input type="checkbox" id="ch2" v-model="payment_credit_card" :disabled="!enableCreditCard">
            <label for="ch2">{{ __('Credit card') }}</label>
            <small v-show="!enableCreditCard" class='text-danger'>{{ __('to activate credit card payments set up your <a href=\":url\">TSP Connect account<\/a>') }}</small>
        </div>

        <div class="checkbox">
            <input type="checkbox" id="ch3" v-model="payment_club_credit">
            <label for="ch3">{{ __('Club Credit') }}</label>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import helpers from '../mixins/helpers'

export default {
    mixins: [helpers],
    props: {
        value: Object
    },

    data () {
        return {
            enableCreditCard: false,
            payment_cash: false,
            payment_club_credit: false,
            payment_credit_card: false,
            package_only:false,
        }
    },

    watch: {
        value () {
            Object.keys(this.value).map(key => this[key] = this.value[key]);
        }
    },

    mounted () {
//        this.$nextTick(() => 
//            Object.keys(this.value).map(key => this[key] = this.value[key]));

        [
            'payment_cash',
            'payment_club_credit',
            'payment_credit_card',
            'package_only'
        ].map(watchingKey => {
            this.$watch(watchingKey, (nval, oval) => {
                if(nval) {
                    if (watchingKey == 'package_only') {
                        this.payment_cash = false;
                        this.payment_club_credit = false;
                        this.payment_credit_card = false;
                    } else {
                        this.package_only = false;
                    }
                }

                this.$emit('input', {
                    payment_cash: this.payment_cash,
                    payment_club_credit: this.payment_club_credit,
                    payment_credit_card: this.payment_credit_card,
                    package_only: this.package_only
                });
            });
        });

        axios.get("/api/payment-settings/is-connected").then(response =>
            this.enableCreditCard = response.data.status ? true : false);
    }
}
</script>
