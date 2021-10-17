<template>
    <div class="row justify-content-center">
        <div class="col-md-10" v-if="products.length">
        <h4 class="pl-2">{{ __('Products for sale') }}</h4>
        <p class="pl-2">{{ __('By') }}: {{ account.full_name }}</p>
            <div
                v-for="product in products"
                :key="product.id"
                class="list-collapsable event-list-section"
            >
                <div class="row">
                    <div class="col-sm-4 text-center">
                        <img v-if="product.image"
                            :src="product.image.preview || product.image.url"
                            style="cursor: pointer; width: inherit; height: 155px; object-fit: contain;"
                        >
                    </div>
                    <div class="col-sm-8">
                        <p class="col-collapsable event-title item-title-sm">
                            <router-link :to="{
                                name: 'productDetails',
                                params: {
                                    productId: product.id,
                                    product: JSON.stringify(product)
                                }}">
                                {{ product.product_type.title }}
                            </router-link>
                        </p>
                        <p class="col-collapsable event-minutes item-title-sm" style="width: 100%;">
                            {{ product.product_type.description }}</p>
                        <p class="col-collapsable event-cost item-title-sm"><strong>{{ __('Cost') }}:</strong> ${{ product.product_type.cost }}
                        </p>
                        <div style="display:flex; align-items: center;">
                            <ul class="solts-visualizer me-2">
                                <li v-for="i in product.quantity"
                                    :key="i"
                                    :class="{ booked: i <= product.sold_product_items }"
                                    :style="'width: ' + 1/product.quantity * 100  + '%;'"></li>
                            </ul>
                            <router-link class="btn btn-success slot-button" :to="{
                                name: 'productDetails',
                                params: {
                                    productId: product.id,
                                    product: JSON.stringify(product)
                                }
                            }">
                                {{ __('Buy') }}
                            </router-link>
                        </div>
                    </div>
                </div>
            </div>
            <pages @on-changed="onPaginationChanged" v-model="pagination" />
        </div>
        <div class="col-md-10 super-center text-center" v-else>
            <h4 v-if="loading">{{ __('Please wait') }}...</h4>
            <h4 v-else>{{ __('Our apologies. This pro does not have any productss available. Please contact your pro to request a product') }}.</h4>
        </div>
    </div>
</template>

<script>
    import axios from 'axios'
    import helpers from '../mixins/helpers';

    export default {
        mixins: [ helpers ],

        data () {
            return {
                products: [],
                account: null,
                pagination: null,
                channel: null
            }
        },

        computed: {
            loading () { return this.$root.loading }
        },

        mounted () {
            this.fetchProducts();

            this.channel = `user-updates-${this.$route.params.publicId}`;
            this.Echo.channel(this.channel)
                .listen('ProductStatusUpdate', e => {
                    this.fetchProducts();
                });
        },

        beforeDestroy () {
            this.Echo.leaveChannel(this.channel);
        },

        methods: {
            async fetchProducts () {
                this.emitter.emit('isLoading', true);
                const response = await axios(`/api/${this.$route.params.publicId}/products`);
                const {data, ...pagination} = response.data.products;
                this.account = response.data.account;
                this.products = data;
                this.pagination = pagination;
                this.emitter.emit('isLoading', false);
            },

            onPaginationChanged () {
                this.fetchProducts();
            }
        }
    }
</script>

<style>

</style>
