<template>
    <div>
        <div class="row">
            <div class="col-md-1 hidden-sm hidden-xs"></div>
            <div class="col-md-10 col-sm-12 col-xs-12 text-start">
                <p>
                    <a data-bs-toggle="collapse" href="#collapseExample" aria-expanded="false" aria-controls="collapseExample">
                        <i class="fa fa-play-circle-o" aria-hidden="true"></i>
                    {{__('Tutorial') }}
                    </a> |
                    <ClipboardButton class="copy-clipboard like-link" :clipboard-text="publicListUrl">
                        <i aria-hidden="true" class="fa fa-clipboard"></i>
                        <span class="button-text">{{ __('Copy') }}</span>
                    </ClipboardButton> |
                    <router-link :to="{ name: 'productTypes' }">
                        <i class="fa fa-list-ul" aria-hidden="true"></i>
                        {{__('Product Types') }}
                    </router-link>
                </p>
                <div class="collapse" id="collapseExample">
                    <p></p>
                </div>
            </div>
            <div class="col-md-1 hidden-sm hidden-xs"></div>
        </div>
        <div class="row">
            <div class="col-md-1 hidden-sm hidden-xs"></div>
            <div class="col-md-10 col-sm-12 col-xs-12 text-start pb-2">
                <router-link :to="{ name: 'wizardProductType' }" class="btn btn-success btn-block">
                    <i class="fa fa-plus"></i> {{ __('Add a New Product') }}
                </router-link>
            </div>
            <div class="col-md-1 hidden-sm hidden-xs"></div>
        </div>
        <div class="row">
            <div class="col-md-1 hidden-sm hidden-xs"></div>
            <div class="col-md-10 col-sm-12 col-xs-12 text-center">
                <ul class="nav nav-tabs tabs mb-2" style="width: 100%; margin-left: 0;">
                    <li class="tab" style="width: calc(100%/3);">
                        <a role="button" @click="activePane = 0" tabindex="0" :class="{ active: activePane === 0 }">{{ __('ACTIVE') }}</a>
                    </li>
                    <li class="tab" style="width: calc(100%/3);">
                        <a role="button" @click="activePane = 1" tabindex="1" :class="{ active: activePane === 1 }">{{ __('COMPLETED') }}</a>
                    </li>
                    <li class="tab" style="width: calc(100%/3);">
                        <a role="button" @click="activePane = 2" tabindex="2" :class="{ active: activePane === 2 }">{{ __('CANCELED') }}</a>
                    </li>
                </ul>
                <div class="tab-content no-bck" style="box-shadow: none;">
                    <div v-if="activePane === 0">
                        <pro-product-item
                            v-for="product in products ? products.data : []"
                            :key="product.id"
                            :product="product"
                            @on-cancel="onCancel(product)"
                        />
                        <pages action="products/fetchProducts" v-model="products" />
                        <div v-if="!loading && (!products || !products.data.length)" class="text-center">
                            <h4>{{ __('There are no products') }}</h4>
                            <p>{{ __('There are no products available for sale. Click') }} <router-link :to="{ name: 'wizardProductType' }">{{ __('here') }}</router-link> {{ __('to add a new product') }}.</p>
                        </div>
                    </div>
                    <div v-if="activePane === 1">
                        <pro-product-item
                            v-for="product in soldProducts ? soldProducts.data : []"
                            :key="product.id"
                            :product="product"
                        />
                        <pages action="products/fetchSoldProducts" v-model="soldProducts" />
                        <div v-if="!loading && (!soldProducts || !soldProducts.data.length)" class="text-center">
                            <h4>{{ __('There are no products') }}</h4>
                        </div>
                    </div>
                    <div v-if="activePane === 2">
                        <pro-product-item
                            v-for="product in canceledProducts ? canceledProducts.data : []"
                            :key="product.id"
                            :product="product"
                        />
                        <pages action="products/fetchCanceledProducts" v-model="canceledProducts" />
                        <div v-if="!loading && (!canceledProducts || !canceledProducts.data.length)" class="text-center">
                            <h4>{{ __('There are no products') }}</h4>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-1 hidden-sm hidden-xs"></div>
        </div>
    </div>
</template>

<script>
    import axios from 'axios'
    import checkAccess from '../mixins/check-access';
    import helpers from '../mixins/helpers';
    import ProProductItem from '../components/ProProductItem.vue';
    import ClipboardButton from '../components/Controls/ClipboardButton.vue'
    import { mapActions, mapState } from 'vuex';

    export default {
        mixins: [ helpers, checkAccess ],

        components: {
            ProProductItem,
            ClipboardButton
        },

        computed: {
            ...mapState({
                loading: s => s.products.loading,
                products: s => s.products.products,
                canceledProducts: s => s.products.canceledProducts,
                soldProducts: s => s.products.soldProducts,
                publicId: s => s.user.account.public_id
            }),

            publicListUrl () {
                return base_url().replace(/\/$/, '') +
                    this.$router.resolve({ name: 'publicProducts', params: { publicId: this.publicId }}).href;
            },

            activePane: {
                get () { return (this.$store.state.uiState && this.$store.state.uiState.productsPane) || 0; },
                set (val) {
                    this.loadTab(val);
                    this.$store.dispatch('uiState/set', { productsPane: val });
                }
            }
        },

        mounted () {
            this.loadTab(this.activePane);

            this.Echo.channel(`user-updates-${this.publicId}`)
                .listen('ProductStatusUpdate', e => {
                    this.loadTab(this.activePane);
            });
        },

        beforeDestroy () {
            this.Echo.leave(`user-updates-${this.publicId}`);
        },

        methods: {
            ...mapActions({
                fetchProducts: 'products/fetchProducts',
                fetchCanceledProducts: 'products/fetchCanceledProducts',
                fetchSoldProducts: 'products/fetchSoldProducts'
            }),

            loadTab (pane) {
                switch (pane) {
                    case 0:
                        this.fetchProducts();
                        break;
                    case 1:
                        this.fetchSoldProducts();
                        break;
                    case 2:
                        this.fetchCanceledProducts();
                        break;
                }
            },

            async onCancel (product) {
                const response = await axios.put(`/api/products/${product.id}/cancel`);
                this.fetchProducts();
            }
        }
    }
</script>

<style>

</style>
