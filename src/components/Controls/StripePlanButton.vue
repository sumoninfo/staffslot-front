<template>
    <div @click="show">
        <slot></slot>
    </div>
</template>

<script>
    import axios from 'axios'
    import helpers from '../../mixins/helpers'

    export default {
        mixins: [helpers],
        props: {
            title: {
                type: String
            },
            planId: {
                type: String
            },
            amount: {
                type: Number
            },
        },

        data () {
            return {
                handler: null
            }
        },

        mounted () {
            this.handler = StripeCheckout.configure({
                key: process.env.MIX_STRIPE_KEY,
                locale: 'auto',
                token: this.onSubmit
            })
        },

        methods: {
            show (event) {
                event.preventDefault()

                this.handler.open({
                    name: this.title,
                    image: '/images/stripe.png',
                    amount: this.amount
                });
            },

            onSubmit (token) {
                EventBus.$emit('loadingStart');
                axios.post('/api/subscription/confirm', {
                    stripeToken: token.id,
                    plan_id: this.planId
                }).then(response => {
                    window.location = '/'
                }).catch(e => {
                    alert('Something went wrong')
                }).finally(() => {
                    EventBus.$emit('loadingStop');
                })
            }
        }
    }
</script>

<style>

</style>
