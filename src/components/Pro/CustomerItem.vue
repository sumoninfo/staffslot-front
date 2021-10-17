<template>
    <div class="card">
        <h5 v-if="customer.account" v-text="customer.account.first_name + ' ' + customer.account.last_name"></h5>
        <h5 v-else v-text="customer.name"></h5>

        <hr>
        <div class="row">
            <div class="col-auto">
                <i class="fa fa-envelope" aria-hidden="true"></i>
            </div>
            <div class="col">
                <a :href="'mailto:' + customer.email">{{ customer.email }}</a>
            </div>
        </div>

        <div class="row">
            <div class="col-auto">
                <i class="fa fa-phone" aria-hidden="true"></i>
            </div>
            <div class="col">
                <a :href="customerPhoneLink" v-text="customerPhone"></a>
            </div>
        </div>

        <hr>
        <div class="row" v-if="booking && booking.slot">
            <div class="col-3">
                <strong>{{ __('Last') }}<br>{{ __('Booked') }}:</strong>
            </div>
            <div class="col-9">
                <a :href="slotUrl">{{booking.slot && booking.slot.title}}</a>
                 <div>{{bookingDate}}</div>
                 <div>{{daysSinceLastBooking}}</div>
            </div>
        </div>

        <hr v-if="booking && booking.slot">
        <button v-if="customer.account" class="btn btn-success btn-block mt-2" @click="addCustomerToLists()">
          <span class="button-icon"><i class="fa fa-plus"></i></span>{{ __('Add to list') }}
        </button>

        <router-link v-if="customer.account" class="btn btn-info btn-block mt-2" :to="{ name: 'customerDetails', params: { userId: customer.user_id }}">
          <span class="button-icon"><i class="fa fa-user"></i></span>{{ __('View details') }}
        </router-link>

        <a v-if="customer.account" class="btn btn-info btn-block mt-2" :href="'/profile/' + customer.account.public_id" target="_blank">
          <span class="button-icon"><i class="fa fa-user"></i></span>{{ __('View Profile') }}
        </a>

    </div>
</template>

<script>
    import moment from 'moment'
    import helpers from '../../mixins/helpers'

    export default {
        mixins: [helpers],
        props:['customer'],
        data() {
          return {
            is_loading: false,
          }
        },
        computed:{
            booking() {
                return this.customer.last_booking;
            },
            bookingDate(){
                var bookingDate = moment(this.booking.created_at);
                return bookingDate.format("ddd MM/DD/YYYY");
            },
            daysSinceLastBooking(){
                var lastBookingDate = moment(this.booking.created_at);
                var days = moment().diff(lastBookingDate,'days');
                if (days<1) {
                    return "Today";
                } else if(days==1){
                    return "Yesterday";
                } else {
                    return days +" days ago";
                }
            },
            slotUrl(){
                return "/slot/details/"+this.booking.bookable_id;
            },
            customerPhone(){
                if (this.customer.account && this.customer.account.contact_number || this.customer.phone) {
                    return this.customer.account && this.customer.account.contact_number || this.customer.phone;
                }else{
                    return 'no phone number';
                }
            },
            customerPhoneLink(){
                if (this.customer.account && this.customer.account.contact_number || this.customer.phone) {
                    return 'tel:'+(this.customer.account && this.customer.account.contact_number || this.customer.phone);
                }else{
                    return false;
                }
            },
        },

        methods: {
          addCustomerToLists(){
            this.emitter.emit("addCustomerToLists",this.customer);
          },
        }
    }
</script>
