<template>
    <div class="row">
        <div class="col-md-2"></div>
        <div class="col-md-8">
            <div class="card-box">
                <ProductDetails v-if="product" :product="product" :booking="booking" />
                <hr v-if="slotOwner && isActive">
                <div v-if="slotOwner && isActive" class="text-end">
                    <payment-status-manage class="pull-left" :paymentStatus="booking.payment_status" :booking="booking.booking_id" />
                    <confirm @confirm="completeBooking(booking)" style="display: inline-table;">
                        <button class="btn btn-success btn-xs">{{ __('Complete') }}</button>
                    </confirm>
                    <confirm @confirm="cancelBooking(booking)" style="display: inline-table;">
                        <button class="btn btn-danger btn-xs">{{ __('Cancel') }}</button>
                    </confirm>
                </div>
                <hr v-if="product">
                <div v-if="booking && !isActive" class="text-center">
                    <span class="chat-message status">{{ __('The product order is') }} {{ this.booking.cancelled ? 'cancelled' : 'completed' }}.</span>
                    <p v-if="slotOwner">
                        <button class="btn btn-success mt-2" @click="reopenBooking(booking)">{{ __('Reopen') }}</button>
                    </p>
                </div>
                <div v-if="slotOwner && isActive"><b>{{ __('Customer name') }}</b> {{ booking.user.account.full_name }}</div>
                <chat v-if="booking" :read-only="!isActive" :booking="booking" />
            </div>
        </div>
    </div>
</template>

<script>
    import axios from 'axios'
    import { mapState } from 'vuex';
    import ProductDetails from '../components/ProductDetails.vue';
    import Chat from '../components/Chat/Chat.vue';
    import bookingTransformer from '../transformers/booking';

    export default {
        data () {
            return {
                product: null,
                booking: null,
                loading: true
            }
        },

        computed: {
            ...mapState({ user: s => s.user }),

            slotOwner () {
                return this.user && this.product && this.product.user_id == this.user.user_id;
            },

            isActive () {
                return this.booking && !this.booking.cancelled && !this.booking.completed;
            }
        },

        components: {
            ProductDetails,
            Chat
        },

        async mounted () {
            if (this.$route.params.booking) {
                this.booking = JSON.parse(this.$route.params.booking);
                this.product = this.booking.bookable;
            } else {
                let response = await axios.get(`/api/booking/video/${this.$route.params.bookingId}`);
                this.booking = bookingTransformer(response.data.booking);
                response = await axios.get(`/api/products/${this.booking.bookable_id}`);
                this.product = response.data.product;
            }
        },

        methods: {
            async cancelBooking (booking) {
                const response = await axios.put(`/api/booking/video/cancel/${booking.booking_id}`);
                booking.cancelled = true;
            },

            async completeBooking (booking) {
                const response = await axios.put(`/api/booking/video/complete/${booking.booking_id}`);
                booking.completed = true;
            },

            async reopenBooking (booking) {
                const response = await axios.put(`/api/booking/video/reopen/${booking.booking_id}`);
                booking.completed = false;
                booking.cancelled = false;
            }

        }
    }
</script>

<style>

</style>
