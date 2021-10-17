<template>
    <div class="row" v-if="product">
        <div class="col-md-2"></div>
        <div class="col-md-8">
            <div class="card-box">
                <ProductDetails :product="product" :isOwner='isOwner' />
                <template v-if="!isOwner && user">
                    <div class="row justify-content-center mb-3">
                        <strong class="col-3 pt-2">{{ __('Quantity') }}: </strong>
                        <select v-model="quantity" class="form-control col-2">
                            <option
                                v-for="i in product.quantity"
                                :value="i"
                                :key="i"
                                :disabled="i > product.quantity - product.sold_product_items"
                            >{{ i }}</option>
                        </select>
                    </div>
                    <pay-buttons
                        :description="`Payment for ${product.product_type.title}`"
                        :cost="product.product_type.cost"
                        :cash="product.product_type.payment_cash"
                        :stripe="product.product_type.payment_credit_card"
                        :credits="product.product_type.payment_club_credit"
                        packageOrdersType="product"
                        :packageOrdersId="product.id"
                        @pay="pay"
                        />
                </template>
                <div v-if="!user" class="col-12 text-center">
                    <a :href="proceedUrl">{{ __('Login To proceed') }}</a>
                </div>
            </div>
            <div v-if="product.bookings" class="detail-header bkd-slots-hdr mb-1">
                <h3>{{ __('PURCHASES') }} ({{ product.sold_product_items }} / {{ product.quantity }})</h3>
            </div>
            <div v-for="(booking, i) in product.bookings" :key="i" class="list-collapsable event-list-section">
                <div @click="onBookingChoosed(booking)" class="row slot-item" style="cursor: pointer;">
                    <div class="" style="padding: 0 10px;">
                        <p class="col-collapsable event-slot">{{ i+1 }}</p>
                        <div style="display: flex;">
                            <p v-if="booking.user" class="col-collapsable event-title item-title-sm"><strong>{{ __('Customer') }}:</strong>
                                {{ booking.user.account.first_name }} {{ booking.user.account.last_name }}
                            </p>
                            <p class="col-collapsable event-title item-title-sm ms-2"><strong>{{ __('Quantity') }}:</strong>
                                {{ booking.quantity }}
                            </p>
                        </div>
                        <p class="col-collapsable">
                            <span v-if="booking.last_message">
                                <strong>{{ __('Last message') }}:</strong> {{ fromNow(booking.last_message.created_at) }},
                            </span>

                            <strong>{{ __('Total') }}:</strong> {{ booking.messages_count }} {{ __('message(s)') }}
                        </p>
                        <p class="col-collapsable" v-if="booking.last_message">
                            <b>{{ booking.last_message.user.account.first_name }} {{ booking.last_message.user.account.last_name }}</b> {{ booking.last_message.preview }}
                        </p>
                        <p class="col-collapsable event-cost item-title-sm"><strong>{{ __('Payment Method') }}:</strong>
                            <payment-status-manage
                                :payment-status="booking.payment_status"
                                :booking="booking.booking_id"
                            />
                        </p>
                    </div>
                    <div>
                        <span v-if="booking.cancelled" class="badge-original badge-secondary canceled">{{ __('Canceled') }}</span>
                        <span v-if="booking.completed" class="badge-original badge-secondary completed">{{ __('Completed') }}</span>
                    </div>
                    <div v-if="!booking.cancelled && !booking.completed" style="position: initial; top: 8px; right: 8px; margin-left: 10px; display: flex">
                        <confirm @confirm="completeBooking(booking)" style="display: inline-table; padding: 0.6rem 0;">
                            <button class="btn btn-success">{{ __('Complete') }}</button>
                        </confirm>
                        <confirm @confirm="cancelBooking(booking)">
                            <button class="btn btn-default delete-link" style="position: relative; top: 0; right: 0;"><span class="icon-only"><small>{{ __('cancel') }}</small> <i class="fa fa-close"></i></span></button>
                        </confirm>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import axios from 'axios'
    import { mapActions, mapState } from 'vuex';
    import ProductDetails from '../components/ProductDetails.vue';
    import helpers from '../mixins/helpers';
    import filters from '../mixins/filters';

    export default {
        mixins: [ helpers, filters ],

        data () {
            return {
                product: this.$route.params.product && JSON.parse(this.$route.params.product),
                quantity: 1
            }
        },

        components: {
            ProductDetails
        },

        computed: {
            ...mapState({ user: 'user' }),

            isOwner () {
                return this.user && this.user.user_id === this.product.user_id;
            },

            proceedUrl() {
                return "/auth/login?redirect_url=" + encodeURI(window.location.href);
            }
        },

        async mounted () {
            // Load it even if product is already in params
            // to get last message and messages_count
            if (!this.product || this.isOwner) {
                const response = await this.callApi({
                    method: 'get',
                    url: `/api/products/${this.$route.params.productId}`,
                    params: { with_bookings: true }
                });

                this.product = response.data.product;
            }
        },

        methods: {
            ...mapActions([ 'callApi' ]),
            ...mapActions({ fetchPurchases: 'products/fetchPurchases', fetchPackageOrders: 'fetchPackageOrders' }),

            async pay (currency, data) {
                const response = await this.callApi({
                    method: 'put',
                    url: `/api/products/${this.product.id}/buy`,
                    data: {
                        with: currency,
                        quantity: this.quantity,
                        ...data
                    }
                });

                if (response.data.success) {
                    currency == 'package_credit' && this.fetchPackageOrders();

                    this.$router.push({
                        name: 'productChat',
                        params: {
                            bookingId: response.data.booking.booking_id
                        }
                    });
                }
            },

            onBookingChoosed (booking) {
                this.$router.push({
                    name: 'productChat',
                    params: {
                        bookingId: booking.booking_id,
                        booking: JSON.stringify({ ...booking, bookable: this.product })
                    }
                });
            },

            async cancelBooking (booking) {
                const response = await axios.put(`/api/booking/video/cancel/${booking.booking_id}`);
                booking.cancelled = true;
            },

            async completeBooking (booking) {
                const response = await axios.put(`/api/booking/video/complete/${booking.booking_id}`);
                booking.completed = true;
            }
        }
    }
</script>

<style>

</style>
