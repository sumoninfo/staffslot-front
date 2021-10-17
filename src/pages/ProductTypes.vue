<template>
    <div class="row">
        <div class="hidden-sm hidden-xs col-md-1"></div>
        <div class="col-xs-12 col-sm-12 col-md-10">
            <div class="row">
                <div class="col-12 text-center">
                    <router-link
                        :to="{ name: 'createProductType' }"
                        class="btn btn-success btn-block btn-new-event"
                    >
                        <span class="button-icon"><i class="fa fa-plus"></i></span>{{ __('NEW PRODUCT') }}
                    </router-link>
                </div>
            </div>
            <div class="row event-search">
                <div class="form-group col-12">
                    <input type="text" class="form-control" v-model="filter" :placeholder="__('Enter product type') + '...'" style="width: 100%">
                </div>
            </div>
            <div class="event-card-box">
                <div v-for="productType in productTypes" :key="productType.id">
                    <div class="list-collapsable event-list-section" v-if="!filter || productType.title.toLowerCase().includes(filter.toLowerCase())">
                        <div class="row">
                            <div class="col-md-6">
                                <p class="col-collapsable event-title item-title-sm">
                                    <strong>{{ __('Product') }}:</strong>
                                    <router-link :to="{ name: 'editProductType', params: { productTypeId: productType.id, productType: productType } }">{{ productType.title }}</router-link>
                                </p>
                                <p class="col-collapsable event-cost item-title-sm"><strong>{{ __('Cost') }}:</strong> ${{ productType.cost }}</p>
                            </div>
                            <div class="col-md-6">
                                <div class="row row-three-buttons">
                                    <div class="btn-navigation button-nav">
                                        <router-link class="btn btn-success btn-block" :to="{ name: 'wizardProductType', params: { productType } }"><span class="button-icon"><i class="fa fa-calendar-check-o"></i></span>{{ __('Add product') }}</router-link>
                                    </div>
                                    <div class="btn-navigation button-nav">
                                        <router-link class="btn btn-edit btn-block" :to="{ name: 'editProductType', params: { productTypeId: productType.id, productType: productType } }"><span class="icon-only"><i class="fa fa-edit"></i> {{ __('Edit') }}</span></router-link>
                                    </div>
                                    <div class="btn-navigation button-nav">
                                        <button @click="duplicate(productType)" class="btn btn-edit btn-block"><span class="icon-only"><i class="fa fa-copy"></i> {{ __('Duplicate') }}</span></button>
                                    </div>
                                </div>
                            </div>
                            <confirm @confirm="destroy(productType)">
                                <button class="btn btn-default delete-link"><span class="icon-only"><i class="fa fa-close"></i></span></button>
                            </confirm>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import helpers from '../mixins/helpers';

export default {
    mixins: [helpers],

    data () {
        return {
            filter: null
        }
    },

    computed: {
        productTypes () {
            return this.$store.state.products.types;
        }
    },

    mounted () {
        this.$store.dispatch('products/fetchTypes');
    },

    methods: {
        async duplicate (productType) {
            this.$store.dispatch('products/duplicate', productType);
        },

        async destroy (productType) {
            this.$store.dispatch('products/destroy', productType);
        }
    }
}
</script>

<style>

</style>
