<template>
    <span @click="show">
        <slot></slot>
    </span>
</template>

<script>
    import helpers from '../../mixins/helpers'

    export default {
        mixins: [helpers],

        props: {
            title: {
                type: String,
                default: 'Time Slot Pro LLC'
            },

            description: {
                type: String,
                default: null
            },

            amount: {
                type: Number
            },

            email: {
                type: String,
                default: null
            },
            metadata: {
                type: Object,
                default: null
            },
            validate: {
                type: Function,
                default: null
            }
        },

        data () {
            return {
                handler: null
            }
        },

        mounted () {
            if (this.$route.query.session_id) {
                this.$emit('onSubmit', { id: this.$route.query.session_id });
            }
        },

        methods: {
            async show (event) {
                event.preventDefault()
                this.$emit('loading', true)

                if (typeof this.validate === 'function') {
                    if (!this.validate()) return;
                }

                const response = await this.$store.dispatch('callApi', {
                    method: 'post',
                    url: `/api/checkout-session`,
                    data: {
                        amount: this.amount,
                        email: this.email,
                        description: this.description,
                        success_url: window.location.href,
                        cancel_url: window.location.href,
                        metadata: this.metadata
                    }
                });

                if (response.data.success) {
                    window.location = response.data.session.url
                }
            }
        }
    }
</script>
