<template>
    <div class="text-center mt-2">
        <loading-button
            v-if="!cost"
            @click="pay('free')"
            :loading="state.free.loading"
            :disabled="state.free.disabled"
            class="btn btn-primary me-1"
        >
            {{ __('Book for Free') }}
        </loading-button>
        <loading-button
            v-if="cash == 1 && cost"
            @click="pay('cash')"
            :loading="state.cash.loading"
            :disabled="state.cash.disabled"
            class="btn btn-primary me-1 mt-1"
        >
            <template #icon>
                <i class="fa fa-money" aria-hidden="true"></i>
            </template>
            {{ __('Pay with Cash') }}
        </loading-button>
        <stripe-button
            v-if="stripe == 1 && cost"
            @onSubmit="pay('credit_card', $event)"
            @loading="stripeButtonStatus"
            :validate="validate"
            :metadata="stripeMetadata"
            :email="email"
            :description="description"
            :amount="cost * 100">
            <loading-button
                class="btn btn-success mt-1"
                :loading="state.credit_card.loading"
                :disabled="state.credit_card.disabled"
            >
                <template #icon>
                    <i class="fa fa-credit-card" aria-hidden="true"></i>
                </template>
                {{ __('Pay with Card') }}
            </loading-button>
        </stripe-button>
        <loading-button
            v-if="credits == 1 && cost"
            @click="pay('club_credit')"
            :loading="state.club_credit.loading"
            :disabled="state.club_credit.disabled"
            class="btn btn-primary me-1 mt-1"
        >
            <template #icon>
                <i class="fa fa-diamond" aria-hidden="true"></i>
            </template>
            {{ __('Book with Club Credit') }}
        </loading-button>

        <div v-if="internalPackageOrders && (internalPackageOrders.length > 0 || Object.keys(internalPackageOrders).length)" class="col-12 text-center">
            <hr>
            <h5 class="mt-4 mb-3">{{ __('Pay with Package Credits') }}</h5>

            <span
                v-for="packageOrder in internalPackageOrders"
                :key="packageOrder.id"
                >
                <template v-if="( packageOrder.paid || packageOrder.payment_type != 'cash' || packageOrder.payment_type != 'free' ) && !packageOrder.is_canceled && !packageOrder.is_expired">
                    <loading-button
                        :loading="state.package_credit.loading"
                        :disabled="state.package_credit.disabled"
                        @click="pay('package_credit', { order_id: packageOrder.id })"
                        class="btn btn-success"><i class="fa fa-ticket" aria-hidden="true"></i> {{ packageOrder.package.package_name}}
                    </loading-button>
                    <p class="label label-primary">{{ packageOrder.used_slots }} / {{ packageOrder.allocated_slots != 0 ? packageOrder.allocated_slots : '&infin;' }} </p>
                </template>
            </span>
        </div>
        <div v-else-if="cash == 0 && credits == 0 && stripe == 0 && this.packagesLink" class="col-12 text-center">
          <p>{{ __('You do not have package credits available for this item. Click') }} <router-link :to="this.packagesLink">{{ __('here') }}</router-link> <span v-if="this.packagesSellerName">{{ __('to shop packages by') }} {{ this.packagesSellerName }}</span>.</p>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import helpers from '../../mixins/helpers';

export default {
    mixins: [helpers],

    props: {
        cost: 0,
        cash: false,
        stripe: false,
        credits: false,
        packagesLink: Object,
        packagesSellerName: String,
        packageOrders: {
            type: [Array, Object],
            default: []
        },
        packageOrdersType: {
            type: String,
            default: null
        },
        packageOrdersId: {
            type: [String, Number],
            default: null
        },
        description: null,
        email: null,
        validate: null,
        stripeMetadata: {
            type: Object,
            default: null
        }
    },

    data () {
        return {
            busy: false,
            state: {
                free: { loading: false, disabled: false },
                cash: { loading: false, disabled: false },
                credit_card: { loading: false, disabled: false },
                club_credit: { loading: false, disabled: false },
                package_credit: { loading: false, disabled: false }
            },
            internalPackageOrders: this.packageOrders,
            loadingOrders: false
        }
    },

    created () {
        if (this.packageOrdersType && !this.packageOrders.length) {
            this.fetchPackageOrders();
        }
    },

    methods: {
        async pay (currency, data) {
            this.state[currency].loading = true;
            this.setAll('disabled', true);
            this.$store.commit('setLoading', true)

            let valid = true;
            if (typeof this.validate === 'function' && currency !== 'credit_card') {
                valid = this.validate();
            }

            if (valid && this.$attrs['onPay'])
                await this.$attrs['onPay'](currency, data);

            this.state[currency].loading = false;
            this.setAll('disabled', false);
            this.$store.commit('setLoading', false)
        },

        async fetchPackageOrders () {
            this.loadingOrders = true;
            const response = await axios.get(`/api/package/orders?slot_id=${this.packageOrdersId}&slot_type=${this.packageOrdersType}`);
            this.internalPackageOrders = response.data.packageOrders;
            this.loadingOrders = false;
        },

        stripeButtonStatus (loading) {
            this.state['credit_card'].loading = loading;
            this.setAll('disabled', loading);
        },

        setAll(key, state) {
            for (let i in this.state)
                this.state[i][key] = state;
        }
    }
}
</script>

<style>

</style>
