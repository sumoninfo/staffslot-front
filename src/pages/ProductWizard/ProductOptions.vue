<template>
    <div class="location-box">
        <h6>{{ __('Product type') }} &gt; <span v-html="product.title"></span></h6>
        <hr>
        <errors :list="errors"/>
        <div class="form-group">
            <label for="">{{ __('How many products are available for sale?') }}</label>
            <input type="text" class="form-control" v-model="quantity">
            <hr>
            <div class="text-right">
                <button type="button" class="btn btn-warning" @click="$router.go(-1)"><i class="fa fa-chevron-left"></i> {{ __('Back') }}</button>
                <button type="submit" class="btn btn-success" @click="goNext"><span>{{ __('Next') }} <i class="fa fa-chevron-right"></i></span></button>
            </div>
        </div>
    </div>
</template>

<script>
    import helpers from '../../mixins/helpers';

    export default {
        mixins: [ helpers ],

        data () {
            return {
                errors: [],
                quantity: null,
            }
        },

        mounted () {
            this.quantity = this.product.quantity;
        },

        computed: {
            product () {
                // TODO: redirect to first wizard page if there is no selected event
                return this.$store.state.wizard.product;
            },
        },

        methods: {
            goNext () {
                if (this.quantity == '' || this.quantity == null) {
                    this.errors.push('Please specify how many products are avaiable for sale.');
                    return;
                }

                this.$store.dispatch('wizard/setProduct', {
                    ...this.product,
                    quantity: this.quantity
                });

                this.$router.push({ name: 'wizardProductImages' });
            }
        }
    }
</script>
