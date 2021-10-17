<template>
    <div class="col-12 card package-order-card">
        <div class="row">
            <div class="col-12">
                <span class="text-muted"><strong>{{ __('Subscription name') }}:</strong></span>
                <span>{{ subscription.name }}</span>
            </div>
            <div class="col-12">
                <span class="text-muted">{{ __('Customer name') }}:</span>
                <span>{{ booking.user.account.full_name }}</span>
            </div>
            <div class="col-12">
                <span class="text-muted">{{ __('Cost') }}:</span>
                <span>${{ booking.cost_pretty || subscription.cost_pretty }}</span>
            </div>
            <div class="col-12">
                <span class="text-muted">{{ __('Purchased') }}: </span><span>{{ booking.created_at }}</span>
            </div>
            <div v-if="booking.access_ends" class="col-12">
                <span class="text-muted">{{ __('Access ends') }}: </span><span>{{ booking.access_ends }}</span>
            </div>
            <div v-if="booking.bookable.expiration_message" class="col-12">
                <span class="text-muted mt-1">{{ __('Expiration') }}: </span><span>{{ booking.bookable.expiration_message }}</span>
            </div>
            <div v-if="booking.renewal" class="col-12">
                <span class="text-muted">{{ __('Renewals') }}: </span><span>{{ booking.renewal_count }} / {{ booking.renewal_limit || '∞' }}</span>
            </div>
            <div v-if="booking.expiration_message" class="col-12">
                <span class="text-muted">{{ __('Expires') }}:</span>
                <span>{{ booking.expiration_message }}</span>
                <span v-if="booking.renewal_message" class="text-primary">({{ booking.renewal_message }})</span>
            </div>
        </div>
        <div class="row text-end">
            <div class="col-12">
            <payment-status-manage :paymentStatus="booking.payment_status" :booking="booking.booking_id" />
            <router-link
                :to="{
                    name: 'videoSubscriptionDetails',
                    params: {
                        videoSubscriptionId: subscription.id,
                        videoSubscription: JSON.stringify(subscription)
                    }
                }"
                class="btn btn-view"
            >
                <i class="fa fa-eye"></i>{{ __('view details') }}
            </router-link>
            <confirm @confirm="cancel(booking)">
            <a v-if="!booking.expired && !booking.cancelled" class="btn btn-edit pull-right">
                <span class="icon-only"><i class="fa fa-close"></i></span>
            </a>
            </confirm>
        </div>
        </div>
    </div>
</template>

<script>
import bookingTransformer from '../../transformers/booking';
import subscriptionTransformer from '../../transformers/subscription';
import helpers from '../../mixins/helpers'

export default {
    mixins: [helpers],
    props: {
        data: Object
    },

    computed: {
        subscription () {
            return subscriptionTransformer(this.data.bookable)
        },

        booking () {
            return bookingTransformer(this.data)
        }
    },

    methods: {
        async cancel (booking) {
            this.$emit('cancel', booking)
        }
    }
}
</script>

<style>

</style>
