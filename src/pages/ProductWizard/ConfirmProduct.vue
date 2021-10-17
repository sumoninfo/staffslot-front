<template>
    <div class="location-box">
        <table class="table" style="table-layout: fixed; width: 100%;">
            <thead>
                <tr>
                    <th colspan="2" class="confirm-area">
                        <h5 class="confirm-time-text">{{ __('Confirm Product Details') }}</h5>
                    </th>
                </tr>
            </thead>
            <tbody class="wizard-body confirm-body mt-2">
                <tr v-if="product.images && product.images.length">
                    <td colspan="2">
                        <div class="text-center mb-2">
                            <div v-for="image in product.images" :key="image.id" style="display: inline-table; margin: 1px;">
                                <image-thumb :image="image" width="60%" />
                            </div>
                        </div>
                    </td>
                </tr>
                <tr v-if="product.promoVideo && product.promoVideo.length">
                    <td colspan="2">
                        <div class="text-center mb-2">
                            <div v-for="video in product.promoVideo" :key="video.id" style="display: inline-table; margin: 1px;">
                                <video-thumb v-if="video" :video="video" style="width: 200px; height: 120px;" />
                            </div>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td class="confirm-slot-field"><strong>{{ __('Title') }}</strong></td>
                    <td v-text="product.title"></td>
                </tr>
                <tr>
                    <td class="confirm-slot-field"><strong>{{ __('Description') }}</strong></td>
                    <td v-text="product.description"></td>
                </tr>
                <tr>
                    <td class="confirm-slot-field"><strong>{{ __('Notes') }}</strong></td>
                    <td v-text="product.notes"></td>
                </tr>
                <tr>
                    <td class="confirm-slot-field"><strong>{{ __('Cost per item') }}</strong></td>
                    <td><span>{{ formatCurrency(product.cost) }}</span></td>
                </tr>
                <tr>
                    <td class="confirm-slot-field"><strong>{{ __('Potential earnings') }}</strong></td>
                    <td><span>{{ formatCurrency(product.quantity * product.cost) }}</span></td>
                </tr>
                <tr>
                    <td class="confirm-slot-field"><strong>{{ __('Available for sale') }}</strong></td>
                    <td v-text="product.quantity"></td>
                </tr>
            </tbody>
        </table>

        <div class="text-right">
            <button type="button" class="btn btn-warning" @click="$router.go(-1)"><i class="fa fa-chevron-left"></i> {{ __('Back') }}</button>
            <button type="submit" class="btn btn-success" @click="goNext"><span>{{ __('Confirm and Add') }} <i class="fa fa-chevron-right"></i></span></button>
        </div>
    </div>
</template>

<script>
    import axios from 'axios'
    import filters from '../../mixins/filters'
    import helpers from '../../mixins/helpers'
    import { mapState, mapActions } from 'vuex';
    import ImageThumb from '../../components/ImageThumb.vue';

    export default {
        mixins: [filters, helpers],

        components: {
            ImageThumb
        },

        computed:
            mapState({ product: s => s.wizard.product }),

        methods: {
            ...mapActions({ 'setProduct': 'wizard/setProduct' }),

            async goNext () {
                await axios.post('/api/products', this.product);
                this.setProduct(null);
                this.$router.push('/products', () => setTimeout(()=> this.emitter.emit('flashMessage', 'Product Successfully Created'), 200));
            }
        }
    }
</script>
