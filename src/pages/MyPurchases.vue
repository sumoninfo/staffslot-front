<template>
    <div class="row justify-content-center">
        <div class="col-md-8 upcoming-bookings">
            <div v-if="!loading && purchases.data.length">
                <div class="page-title-area "><h2 class="section-title">{{ __('Open orders') }}</h2></div>
                <div v-for="p in purchases.data" :key="p.id">
                    <div class="list-collapsable event-list-section">
                        <div class="row">
                            <p class="col-collapsable event-title item-title-sm w-100">
                                <router-link :to="{
                                    name: 'productChat',
                                    params: {
                                        bookingId: p.booking_id,
                                        booking: JSON.stringify(p)
                                    }
                                }">
                                    {{ p.bookable.product_type.title }}
                                </router-link>
                            </p>
                        </div>
                        <div class="row">
                            <p class="col-collapsable event-minutes item-title-sm" style="width: 33.3%;"><strong>{{ __('Purchased') }}</strong> {{ p.created_at }}</p>
                            <p class="col-collapsable event-minutes item-title-sm" style="width: 33.3%;"><strong>{{ __('Quantity') }}</strong> {{ p.quantity }}</p>
                            <p class="col-collapsable event-minutes item-title-sm" style="width: 33.3%;"><strong>{{ __('Sold By') }}</strong> {{ p.bookable.user.account.full_name }}</p>
                        </div>
                    </div>
                </div>
                <pages action="products/fetchActivePurchases" v-model="purchases" />
            </div>
            <div v-if="!loading && pastPurchases.data.length">
                <div class="page-title-area "><h2 class="section-title">{{ __('Completed orders') }}</h2></div>
                <div v-for="p in pastPurchases.data" :key="p.id">
                    <div class="list-collapsable event-list-section">
                        <div class="row">
                            <p class="col-collapsable event-title item-title-sm w-100">
                                <router-link :to="{
                                    name: 'productChat',
                                    params: {
                                        bookingId: p.booking_id,
                                        booking: JSON.stringify(p)
                                    }
                                }">
                                    {{ p.bookable.product_type.title }}
                                </router-link>
                            </p>
                            <div>
                                <span v-if="p.cancelled" class="badge-original badge-secondary ml-2 mt-1">{{ __('Canceled') }}</span>
                                <span v-if="p.completed" class="badge-original badge-secondary ml-2 mt-1">{{ __('Completed') }}</span>
                            </div>
                        </div>
                        <div class="row">
                            <p class="col-collapsable event-minutes item-title-sm" style="width: 33.3%;"><strong>{{ __('Purchased') }}</strong> {{ p.created_at }}</p>
                            <p class="col-collapsable event-minutes item-title-sm" style="width: 33.3%;"><strong>{{ __('Quantity') }}</strong> {{ p.quantity }}</p>
                            <p class="col-collapsable event-minutes item-title-sm" style="width: 33.3%;"><strong>{{ __('Sold By') }}</strong> {{ p.bookable.user.account.full_name }}</p>
                        </div>
                    </div>
                </div>
                <pages action="products/fetchPastPurchases" v-model="pastPurchases" />
            </div>
            <div v-if="!loading && !purchases.data.length && !pastPurchases.data.length" class="text-center super-center">
                <h4>{{ __('No orders placed.') }}</h4>
                <h5>{{ __('Please') }} <router-link :to="{ name: 'searchPro' }">{{ __('click here') }}</router-link> {{ __('to find a pro and shop their store.') }}</h5>
            </div>
        </div>
    </div>
</template>

<script>
    import helpers from '../mixins/helpers';
    import { mapActions, mapState } from 'vuex';

    export default {
        mixins: [ helpers ],

        computed: {
            ...mapState({
                loading: s => s.products.loading,
                purchases: s => s.products.purchases,
                pastPurchases: s => s.products.pastPurchases
            })
        },

        mounted () {
            this.fetchPurchases();
        },

        methods: {
            ...mapActions({ fetchPurchases: 'products/fetchPurchases' })
        }
    }
</script>

<style>

</style>
