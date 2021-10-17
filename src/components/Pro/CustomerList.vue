<template id="pro-customer-list">
    <div class="col-12">
        <div class="row">
            <div v-if="is_loading" class="col-12 card text-center">
                {{ __('Loading') }}
            </div>

            <div
                v-for="customer,i in sortedCustomer"
                :key="i"
                class="col-lg-3 col-md-3 col-sm-12">
                <pro-customer-item :customer="customer"></pro-customer-item>
            </div>
            <customer-to-invite></customer-to-invite>
        </div>
    </div>
</template>

<script>
    import axios from 'axios'
    import '../../scripts/custom.js'
    import helpers from '../../mixins/helpers'

    export default {
        mixins: [helpers],
        template: '#pro-customer-list',
        data() {
            return {
                errors: [],
                bookings: [],
                customers: [],
                guests: [],
                is_loading: false
            }
        },

        created: function () {
            this.getBookings()
        },

        computed: {
            sortedCustomer() {
                return [...window.nestedSort("last_booking.created_at",this.customers, -1), ...this.guests];
            }
        },

        methods: {
            getBookings: function () {
                this.customers = []
                this.is_loading = true

                axios.get('/api/customers/get-customers')
                    .then((response) => {
                      this.customers = response.data.customers;
                      this.guests = response.data.guests;
                    })
                    .catch((e) => {
                      this.errors.push(e)
                    })
                    .finally(() => (this.is_loading = false))
            },
        }

    }
</script>
