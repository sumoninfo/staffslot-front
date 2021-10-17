<template>
<div class="col-12">
	<p><a data-bs-toggle="collapse" href="#collapseExample" aria-expanded="false" aria-controls="collapseExample"><i class="fa fa-play-circle-o" aria-hidden="true"></i> {{ __('Booking History tutorial') }}</a> | <a href="https://www.timeslot.pro/support/" target="_blank" class="support-link"><i class="fa fa-support" aria-hidden="true"></i> <span class="button-text">{{ __('Support') }}</span></a></p>
    <div class="collapse" id="collapseExample">
       <p>{{ __('This page lists customers that have booked a time slot. View the event name, date time, cost, payment method and payment status. Update the payment status on each slot by clicking on the payment label') }}.</p>
    </div>
	<div class="title-area">
		<p>{{ __('This is your historical list of bookings') }}.</p>
	</div>
		<div class="justify-content-end" style="display: flex">
				<h6 class="me-2">{{ __('Sort') }}:</h6>
				<select class="form-control w-auto me-2" v-model="orderBy" name="orderBy" id="bh-order-by">
					<option value="created">{{ __('Date Booked') }}</option>
					<option value="event_date">{{ __('Event Date') }}</option>
					<option value="event_name">{{ __('Event Name') }}</option>
				</select>
				<select class="form-control w-auto me-2" v-model="orderType" name="orderType" id="bh-order-type">
					<option value="ASC">{{ __('Ascending') }}</option>
					<option value="DESC">{{ __('Descending') }}</option>
				</select>
				<button @click="onSort" class="btn btn-primary btn-sm" type="submit">
					<i class="fa fa-search"></i>
				</button>
		</div>
	<div class="row">
        <div class="col-12 card d-none d-md-block h6">
            <div class="row">
                <div class="col-md-2 col-sm-6">
					{{ __('Date Booked') }}
				</div>
                <div class="col-md-2 col-sm-6">
					{{ __('Event Date') }}
				</div>
                <div class="col-md-2 col-sm-6">
					{{ __('Customer Name') }}
				</div>
                <div class="col-md-2 col-sm-6">
					{{ __('Event Name') }}
				</div>
                <div class="col-md-2 col-sm-6">
					{{ __('Cost') }}
				</div>
                <div class="col-md-2 col-sm-6">{{ __('Status') }}</div>
            </div>
        </div>
	</div>
    <div v-for="item in history" :key="item.id" class="col-12 card order-entry">
        <!--item_row-->
        <div class="row">
            <div class="col-md-2 col-sm-6 order-date">
                <span class="d-md-none d-sm-block h6">{{ __('Date Booked') }}:</span>
                {{ item.created_at}}
            </div>

            <div class="col-md-2 col-sm-6 order-title">
                <span class="d-md-none d-sm-block h6">{{ __('Event Date') }}:</span>
                <span v-if="item.type === 'slot'">
                    {{ item.bookable.event_day }} {{ item.bookable.start_time }}
                </span>
            </div>

            <div class="col-md-2 col-sm-6 order-customer-name">
                <span class="d-md-none d-sm-block h6">{{ __('Customer') }}: </span>
                <router-link v-if="item.user" :to="{ name: 'customerDetails', params: { userId: item.user_id } }">{{ item.user.account.full_name }}</router-link>
                <span v-else-if="item.guest">{{ item.guest.name }}</span>
                <span v-else>{{ __('Deleted user') }}</span>
                {{ item.guest && '(guest)' }}
            </div>

            <div class="col-md-2 col-sm-6 order-title">
                <span class="d-md-none d-sm-block h6">{{ __('Event Name') }}: </span>
                <a v-if="item.type === 'slot'" class="event-link" :href="`/slot/details/${item.bookable.slot_id}`">{{ item.title }}</a>
                <a v-if="item.type === 'video-slot'" class="event-link" :href="`/video/slot/${item.bookable.id}`">{{ item.title }}</a>
                <a v-if="item.type === 'video-subscription'" class="event-link" :href="`/video/subscriptions/${item.bookable.id}`">{{ item.title }}</a>
                <a v-if="item.type === 'package'" class="event-link" :href="`/package/view/${item.bookable_id}`">{{ item.title }}</a>
                <p><strong>{{ item.type }}</strong></p>
            </div>

            <div class="col-md-2 col-sm-6">
                <span class="d-md-none d-sm-block h6">{{ __('Cost') }}: </span>

                <span v-if="item.stripe_charge">
                    $<span class="order-amount">{{ item.stripe_charge.amount / 100 }}</span>
                </span>
                <span v-else>
                    <span v-if="item.type === 'slot'" class="order-amount">${{ item.bookable.cost / 100 }}</span>
                    <span v-else-if="item.type === 'video-slot'" class="order-amount">${{ item.bookable.cost }}</span>
                    <span v-else-if="item.cost" class="order-amount">${{ item.cost }}</span>
                    <span v-else class="order-amount">{{ __('free') }}</span>
                </span>
            </div>

            <div class="col-md-2 col-sm-6">
                <payment-status-manage :payment-status="item.payment_status" :booking="item.id" />
            </div>
        </div>
    </div>
    <div class="text-center mt-2">
        <span v-if="loading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
    </div>
    <pages @on-changed="onPaginationChanged" v-model="pagination" />
</div>
</template>

<script>
import axios from 'axios'
import helpers from '../mixins/helpers';
import bookingTransformer from '../transformers/booking';

export default {
    mixins: [helpers],

    data () {
        return {
            history: [],
            pagination: {},
            orderBy: 'created',
            orderType: 'DESC',
            loading: false
        }
    },

    mounted () {
        this.fetchHistory();
    },

    methods: {
        async fetchHistory () {
            this.loading = true;
            this.history = [];
            const { page, per_page } = this.pagination;
            const response = await axios.get('/api/payment-history', { params: { page, per_page, order_by: this.orderBy, order_type: this.orderType } });
            const {data, ...pagination} = response.data.bookings;
            this.history = data.map(x => bookingTransformer(x));
            this.pagination = pagination;
            this.loading = false;
        },

        onPaginationChanged () {
            this.fetchHistory();
        },

        onSort () {
            this.page = 1;
            this.fetchHistory();
        }
    }
}
</script>

<style>

</style>