<template>
    <div class="row">
        <div class="col-12">
            <p>{{ __('Pro') }}: {{ subscription.bookable.pro_name }}</p>
            <h2 v-if="active" class="package-title"><router-link :to="{
                    name: 'myVideoSubscriptionsWatch',
                    params: {
                        subscriptionId: subscription.booking_id,
                        subscription: JSON.stringify(subscription)
                    }
                }"
            ><span>{{ subscription.bookable.name }}</span></router-link></h2>
            <h2 v-else><span>{{ subscription.bookable.name }}</span></h2>
            <p class="mt-2">{{ __('Purchased') }}: {{ subscription.created_at }}</p>
            <p v-if="subscription.access_ends">{{ __('Access ends') }}: {{ subscription.access_ends }}</p>
            <p v-if="subscription.bookable.expiration_message" class="mt-1">{{ __('Expiration') }}: {{ subscription.bookable.expiration_message }}</p>
            <p v-if="subscription.renewal">{{ __('Renewals') }}: {{ subscription.renewal_count }} / {{ subscription.renewal_limit || '∞' }}</p>
        </div>
        <div class="col-12">
            <h5>{{ __('Tags') }}:</h5>
            <ul class="event-list-scrollable list-unstyled">
                <li v-for="tag in subscription.bookable.tags"
                    :key="tag.id"
                >
                    <label class="label label-primary">
                        {{ tag.name }}
                    </label>
                </li>
            </ul>
        </div>
        <div v-if="active" class="col-12 text-center">
            <router-link
                :to="{
                    name: 'myVideoSubscriptionsWatch',
                    params: {
                        subscriptionId: subscription.booking_id,
                        subscription: JSON.stringify(subscription)
                    }
                }"
                tag="button"
                class="package-status text-center status-success pt-2 pb-1"
                style="font-size: 0.8rem;"
            >{{ __('WATCH VIDEOS') }}</router-link>
        </div>
        <confirm @confirm="cancel">
            <button v-if="active" class="btn btn-default delete-link"><span class="icon-only"><i class="fa fa-close"></i></span></button>
        </confirm>
    </div>
</template>

<script>
import helpers from '../../mixins/helpers';

export default {
    mixins: [helpers],

    props: {
        subscription: Object
    },

    computed: {
        active () {
            return !this.subscription.expired &&
                !this.subscription.cancelled &&
                !this.subscription.disabled;
        }
    },

    methods: {
        cancel () {
            this.$store.dispatch('videoSubscriptions/cancel', this.subscription);
        }
    }
}
</script>
