<template>
    <div id="app" class="row justify-content-center">
        <div class="col-md-8">
            <div class="page-title-area">
                <h6>{{ __('Create &amp; save product types to add as products.') }}</h6>
            </div>
            <div class="event-form">
                <div v-if="errorMessage" class="row alert alert-danger form-error-message">
                    {{ errorMessage }}
                </div>
                <div v-if="successMessage" class="row alert alert-success form-success-message">
                    {{ successMessage }}
                </div>
                <div class="form-group">
                    <label class="event-label">{{ __('Title') }}</label>
                    <input class="form-control" placeholder="Enter the event title here" type="text" name="title"  v-model="productType.title">
                    <div class="form-control-feedback text-danger" v-if="formErrors.title">{{ formErrors.title[0] }}</div>
                </div>
                <div class="form-group">
                    <label class="event-label">{{ __('Description') }}</label>
                    <textarea class="form-control" name="description" placeholder="Enter a description about the product here that tells the customer what they can expect with this time slot." v-model="productType.description"></textarea>
                    <div class="form-control-feedback text-danger" v-if="formErrors.description">{{ formErrors.description[0] }}</div>
                </div>
                <div class="form-group">
                    <label class="event-label">{{ __('Notes') }}</label>
                    <textarea class="form-control" name="notes" placeholder="Include any extra notes about this productType." v-model="productType.notes"></textarea>
                </div>
                <div class="form-group">
                    <label class="event-label">{{ __('Cancellation Policy') }}</label>
                    <textarea class="form-control" name="cancellation_policy" placeholder="Enter cancellation policy." v-model="productType.cancellation_policy"></textarea>
                </div>
                <hr />
                <div class="form-group">
                    <label class="event-label">{{ __('Per Product Cost (USD)') }}</label>
                    <input class="form-control" type="number" name="cost" placeholder="e.g. 15.00 or 5.99" v-model="productType.cost">
                    <div class="form-control-feedback text-danger" v-if="formErrors.cost">{{ formErrors.cost[0] }}</div>
                </div>
                <hr />
                <div class="form-group">
                    <label class="event-label">{{ __('Other doc') }}</label>
                    <input class="form-control" placeholder="Enter url for a document you want customers to view..." v-model="productType.doc_url">
                    <small class="form-text">({{ __('optional') }})</small>
                </div>
                <hr />
                <div class="form-group">
                    <payment-types v-model="paymentTypes" />
                </div>
                <div class="col-auto">
                    <loading-button :loading="loading" @click="save" class="btn btn-primary">{{ __('Save') }}</loading-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import helpers from '../mixins/helpers';
import paymentTypesComponent from '../components/PaymentTypes.vue';

export default {
    mixins: [helpers],

    components: {
        'payment-types': paymentTypesComponent
    },

    data () {
        return {
            productType: {},
            paymentTypes: {},
            formErrors: {},
            errorMessage: null,
            successMessage: null,
            loading: false
        }
    },

    async mounted () {
        if (this.$route.params.productTypeId) {
            this.editing = true;

            if (this.$route.params.productType) {
                this.productType = this.$route.params.productType;
            } else {
                this.loading = true;
                await this.$store.dispatch('products/fetchTypes');
                this.productType = this.$store.state.products.types.find(x => x.id == this.$route.params.productTypeId)
                this.loading = false;
            }

            this.paymentTypes = {
                payment_cash: this.productType.payment_cash,
                payment_club_credit: this.productType.payment_club_credit,
                payment_credit_card: this.productType.payment_credit_card,
            }
        }
    },

    methods: {
        async save () {
            const url = this.productType.id ? `/api/product/types/${this.productType.id}`:
                '/api/product/types/create';

            try {
                this.loading = true;
                const response = await axios.put(url,
                    { ...this.productType, ...this.paymentTypes });

                if (response.data.success) {
                    this.$router.push({ name: 'productTypes' },
                        () => setTimeout(() =>
                            this.emitter.emit('flashMessage', this.productType.id ?
                                'Product type successfully updated.' :
                                'Product type successfully created.'), 200));

                } else {
                    this.errorMessage = response.data.message;
                }
            } catch (error) {
                console.log(error);
                if (error.response && error.response.status === 422) {
                    this.formErrors = error.response.data.errors;
                    this.errorMessage = error.response.data.message;
                } else {
                    this.errorMessage = error.message;
                }
            } finally { this.loading = false }
        }
    }
}
</script>

<style>

</style>
