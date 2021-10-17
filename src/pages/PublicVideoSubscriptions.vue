<template>
    <div class="col-12">
        <div v-if="!loading && !subscriptions.length" class="super-center text-center">
            <h4>{{ __('There are no video subscriptions yet') }}</h4>
        </div>
        <div
            v-for="subscription in subscriptions"
            :key="subscription.id"
            class="card package-box"
        >
            <div class="row">
            <div class="col-md-10 col-sm-12">
                <h4 class="pro-title">{{ __('Pro') }}:<a>{{ subscription.pro_name }}</a></h4>
                <h2 class="package-title">
                    <router-link :to="linkToSubscription(subscription)">{{ subscription.name }}</router-link>
                </h2>
                <p>{{ __('Tags') }}:</p>
                <div class="row d-flex">
                    <div
                        v-for="tag in subscription.tags"
                        :key="tag.id"
                        class="col-auto px-0 pb-1 mb-2"
                    >
                        <span class="label label-primary mt-1">
                            <span>{{ tag.name }}</span>
                        </span>
                    </div>
                </div>
                <p v-if="subscription.expiration_message">{{ __('Expiration terms') }}: <span>{{ subscription.expiration_message }}</span></p>
                <p v-if="subscription.renewal_message" class="text-primary">{{ subscription.renewal_message }}</p>
                <p>{{ __('cost') }}: <strong>${{ subscription.cost }}</strong></p>
            </div>
            <div class="col-md-2 col-sm-12">
                <router-link
                    class="btn btn-success mt-2"
                    :to="linkToSubscription(subscription)"
                >{{ __('Details') }}</router-link>
            </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import helpers from '../mixins/helpers';
import subscription from '../transformers/subscription';

export default {
    mixins: [helpers],

    data () {
        return {
            subscriptions: []
        }
    },

    computed: {
        loading () { return this.$root.loading }
    },

    async mounted () {
        this.emitter.emit('isLoading', true);
        const response = await axios(`/api/${this.$route.params.publicId}/subscriptions`);
        this.subscriptions = response.data.subscriptions.map( x => subscription(x) );
        this.emitter.emit('isLoading', false);
    },

    methods: {
        linkToSubscription (subscription) {
            return {
                name: 'videoSubscriptionDetails',
                params: {
                    videoSubscription: JSON.stringify(subscription),
                    videoSubscriptionId: subscription.id
                }
            }
        }
    }
}
</script>

<style>

</style>