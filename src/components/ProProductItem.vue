<template>
    <div class="list-collapsable event-list-section text-start"> 
        <div class="row">
            <div class="col-sm-12 col-md-6 col-lg-6">
                <p class="col-collapsable event-title item-title-sm">
                    <router-link
                        @click="onProductChoosed"
                        :to="{
                            name: 'productDetails',
                            params: { productId: product.id, product: JSON.stringify(product) }
                        }">{{ product.product_type.title }}</router-link>
                </p>
            </div>
            <confirm v-if="!product.disabled" @confirm="$emit('on-cancel')">
                <button class="btn btn-default delete-link"><span class="icon-only"><i class="fa fa-close"></i></span></button>
            </confirm>
        </div>
        <div class="row">
            <div v-if="product.bookings.length > 0" class="col-collapsable event-cost item-title-sm w-100">
                <a class="h6 text-primary" href="#" data-bs-toggle="collapse" :data-bs-target="'#product-' + product.id">{{ __('View Buyers') }}</a>
                <div :id="'product-' + product.id" class="collapse">
                    <ol>
                        <li v-for="booking in product.bookings" :key="booking.booking_id">
                            <span>{{ booking.user.account.full_name }} {{ booking.quantity > 1 ? 'x'+booking.quantity : '' }}</span>
                        </li>
                    </ol>
                </div>
            </div>
        </div>
            <div class="row last-message">
                <template v-if="product.last_message">
                    <span style="chat-msg-txt">{{ __('Last message') }}: {{ fromNow(product.last_message.created_at) }} <router-link :to="{ name: 'productChat', params: { bookingId: product.last_message.chatable_id, highlightedMessageId: product.last_message.id  }}"> <b>{{ product.last_message.user.account.first_name }} {{ product.last_message.user.account.last_name }}</b> {{ product.last_message.preview }} </router-link></span>
                </template>
            </div>
        <div class="row">
            <p class="col-collapsable event-cost item-title-sm">
                <strong>{{ __('Quantity') }}:</strong> {{ product.quantity }}
            </p>
            <ClipboardButton class="btn btn-sm btn-link btn-clipboard mb-1 mt-1" :clipboard-text="productUrl" style="position: absolute; right: 10px; bottom: 35px;">
                <span class="button-icon"><i class="fa fa-copy"></i></span>
                <span class="button-text">{{ __('Copy Link') }}</span>
            </ClipboardButton>
            <ul class="solts-visualizer">
                <li
                    v-for="i in product.quantity"
                    :key="i"
                    :class="{ booked: i <= product.sold_product_items }"
                    :style="'width:'+ (1/product.quantity * 100) +'%;'"></li>
            </ul>
        </div>
    </div>
</template>

<script>
    import filters from '../mixins/filters'
    import helpers from '../mixins/helpers';
    import ClipboardButton from './Controls/ClipboardButton.vue'

    export default {
        mixins: [ filters, helpers ],

        props: {
            product: Object
        },

        components: {
            ClipboardButton
        },

        computed: {
            productUrl () {
                return base_url().replace(/\/$/, '') +
                    this.$router.resolve({
                        name: 'productDetails',
                        params: {
                            productId: this.product.id
                        }
                    }).href;
            }
        },

        methods: {
            onProductChoosed () {
            }
        }
    }
</script>

<style>

</style>
