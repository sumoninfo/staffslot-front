<template>
    <div>
        <h3 class="text-center">{{ product.product_type.title }}</h3>
        <div class="text-center">
            <span v-if="product.disabled" class="badge-original badge-secondary">{{ __('Canceled') }}</span>
        </div>
        <br>
        <p class="text-center">{{ product.product_type.description }}</p>
        <br>

        <div v-if="product.images.length" class="promo-video text-center mb-2">
            <image-thumb
                v-for="image in product.images"
                :key="image.id"
                :image="image"
            />
        </div>

        <div v-if="product.videos.length" class="promo-video text-center mb-2">
            <div v-for="video in product.videos" :key="video.id" style="display: inline-table; margin: 1px;">
                <video-thumb @click.native="play(video)" v-if="video" :video="video" :show-video-icon="true" style="width: 275px; height: 155px;" />
            </div>
        </div>

        <table class="table" style="margin-bottom: 0.5rem">
            <tbody>
                <tr>
                    <td class="confirm-slot-field"><strong>{{ __('Notes') }}</strong></td>
                    <td>{{ product.product_type.notes }}</td>
                </tr>
                <tr v-if="product.product_type.cancellation_policy">
                    <td class="confirm-slot-field"><strong>{{ __('Cancellation Policy') }}</strong></td>
                    <td>{{ product.product_type.cancellation_policy }}</td>
                </tr>
                <tr v-if="booking">
                    <td class="confirm-slot-field"><strong>{{ __('Quantity Purchased') }}</strong></td>
                    <td>{{ booking.quantity }}</td>
                </tr>
                <tr v-if="isOwner">
                    <td class="confirm-slot-field"><strong>{{ __('Quantity') }}</strong></td>
                    <td>{{ product.quantity }}</td>
                </tr>
                <tr>
                    <td class="confirm-slot-field"><strong>{{ __('Cost') }}</strong></td>
                    <td>{{ formatCurrency(product.product_type.cost_pretty)  }}</td>
                </tr>
                <tr v-if="booking">
                    <td class="confirm-slot-field"><strong>{{ __('Date Purchased') }}</strong></td>
                    <td>{{ booking.created_at }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
    import filters from '../mixins/filters.js';
    import helpers from '../mixins/helpers.js';
    import ImageThumb from './ImageThumb.vue';

    export default {
        mixins: [ filters, helpers ],

        components: {
            ImageThumb
        },

        props: {
            product: Object,

            booking: {
                type: Object,
                default: null
            },

            isOwner: {
                type: Boolean,
                default: false
            }
        }
    }
</script>

<style>

</style>
