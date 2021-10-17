<template id="pro-customer-list">
    <div class="col-12">
        <div class="row">
          <div v-if="is_loading" class="col-12 card text-center">
            {{ __('Loading') }}
          </div>
          <div class="col-12">
              <!--Profile-->
              <div class="card">

                  <div class="card-body">
                      <div class="row d-flex align-items-baseline">
                          <div class="col-md-3">
                              <img class="img-fluid card-img-top" :src="getProfilePhoto(customer)" alt="user">
                          </div>
                          <div class="col-md-9 h-100 mt-auto">
                              <div class="row">
                                  <h2 class="col-12" v-text="customer.account.full_name"></h2>

                                  <div class="col-auto">
                                      <i class="fa fa-envelope" aria-hidden="true"></i>
                                      <a :href="'mailto:' + customer.email">{{ customer.email }}</a><br />
                                  </div>

                                  <div class="col-auto">
                                      <i class="fa fa-phone" aria-hidden="true"></i>
                                      <a :href="customerPhoneLink" v-text="customerPhone"></a><br />
                                  </div>

                              </div>

                              <div class="row">
                                  <div class="col-12">
                                      <button class="btn btn-success mt-2" @click="addCustomerToLists(customer)">
                                          <span class="button-icon"><i class="fa fa-plus"></i></span>{{ __('Add to list') }}
                                      </button>
                                  </div>
                              </div>

                          </div>
                      </div>
                  </div>

              </div>

          </div>
        </div>

        <!--income and booking overview-->
        <div class="col-12 px-0">
            <div class="card ">

                <div class="row ps-2 pt-2"  v-if="lastbooking?.slot">
                    <div class="col-3">
                        <strong>{{ __('Last Booking') }}</strong>
                    </div>
                    <div class="col-9">
                        <a :href="slotUrl" class="h6 text-primary">{{lastbooking.slot.title}}</a>
                        <div>{{lastBookingDate}}</div>
                        <div>{{daysSinceLastBooking}}</div>
                    </div>
                </div>
                <hr>
                <div class="row ps-2">
                    <div class="col-4">
                        <strong>{{ __('Total Bookings') }}</strong>
                    </div>
                    <div class="col-8">
                        <h6>{{totalBooking}}</h6>
                    </div>
                </div>
                <hr>

                <div class="row ps-2">
                    <div class="col-9 offset-3">
                        <div class="row">
                            <div class="col-4">
                                <span class="">{{ __('Total') }}:</span>
                            </div>

                            <div class="col-4">
                                <span class="">{{ __('Paid') }}:</span>
                            </div>

                            <div class="col-4">
                                <span class="">{{ __('Pending') }}:</span>
                            </div>
                        </div>
                    </div>
                </div>
                <hr>

                <div class="row ps-2">
                    <div class="col-3">
                        <strong>{{ __('Booking Revenue') }}</strong>
                    </div>

                    <div class="col-9">
                        <div class="row">
                            <div class="col-4">
                                <span class="h6 text-end">${{bookingRevenueTotal}}</span>
                            </div>
                            <div class="col-4">
                                <span class="h6 text-center">${{bookingRevenue.paid}}</span>
                            </div>
                            <div class="col-4">
                                <span class="h6 text-center">${{bookingRevenue.pending}}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <hr>

                <div class="row ps-2">
                    <div class="col-3">
                        <strong>{{ __('Package Revenue') }}</strong>
                    </div>

                    <div class="col-9">
                        <div class="row">
                            <div class="col-4">
                                <span class="h6 text-end">${{packageRevenueTotal}}</span>
                            </div>
                            <div class="col-4">
                                <span class="h6 text-center">${{packageRevenue.paid}}</span>
                            </div>
                            <div class="col-4">
                                <span class="h6 text-center">${{packageRevenue.pending}}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <hr>

                <div class="row ps-2 pb-2">
                    <div class="col-3">
                        <strong>{{ __('Total Revenue') }}</strong>
                    </div>

                    <div class="col-9">
                        <div class="row">
                            <div class="col-4">
                                <span class="h6 text-end">${{totalRevenue.total}}</span>
                            </div>
                            <div class="col-4">
                                <span class="h6 text-center">${{totalRevenue.paid}}</span>
                            </div>
                            <div class="col-4">
                                <span class="h6 text-center">${{totalRevenue.pending}}</span>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>

        <!--bookings-->

        <div class="bg-light col-12 mt-5 p-1">
            <h1 class="text-center">{{ __('Bookings') }}</h1>
        </div>

        <div class="col-12 px-0">
            <customer-booking-list :customer-id="customer.user_id"></customer-booking-list>
        </div>
        <customer-to-invite></customer-to-invite>
    </div>
</template>

<script>
    import axios from 'axios'
    import helpers from '../../mixins/helpers'
    import moment from 'moment'

    export default {
        mixins: [helpers],
        props:['customer'],
        data() {
          return {
            errors: [],
            bookings: [],
            is_loading: false,
            lastbooking:{},
            totalBooking:0,

            bookingRevenue:{},
            packageRevenue:{},
          }
        },
        methods: {
          getProfilePhoto(_user) {
            if (_user.account.profile_photo!="" && _user.account.profile_photo!=null) {
              return '/storage/uploads/' + _user.account.profile_photo;
            } else {
              return '/images/default-profile-time-slot-pro.png'
            }
          },
          addCustomerToLists(customer){
            this.emitter.emit("addCustomerToLists",customer);
          },
          getIncomeOverview(){
              axios.get("/api/customers/"+this.customer.user_id +"/income-info")
              .then( response => {
                  // console.log(response.data);
                  this.lastbooking = response.data.lastbooking;
                  this.totalBooking = response.data.totalBooking;

                  this.bookingRevenue = response.data.bookingRevenue;
                  this.packageRevenue = response.data.packageRevenue;
              });
          },
        },
        computed:{
            lastBookingDate(){
                if (this.lastbooking) {
                    return moment(this.lastbooking.created_at).format("ddd MM/DD/YYYY");
                }
            },
            daysSinceLastBooking(){
                var lastBookingDate = moment(this.lastbooking.created_at);
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
                return "/slot/details/"+this.lastbooking.bookable_id;
            },

            bookingRevenueTotal(){
                return parseInt(this.bookingRevenue.paid) + parseInt(this.bookingRevenue.pending);
            },

            packageRevenueTotal(){
                return parseInt(this.packageRevenue.paid) + parseInt(this.packageRevenue.pending);
            },

            totalRevenue(){
                return {
                    total: parseInt(this.bookingRevenueTotal) + parseInt(this.packageRevenueTotal),
                    paid: parseInt(this.bookingRevenue.paid) + parseInt(this.packageRevenue.paid),
                    pending: parseInt(this.bookingRevenue.pending) + parseInt(this.packageRevenue.pending),
                };
            },
            customerPhone(){
                if (this.customer.account.contact_number) {
                    return this.customer.account.contact_number;
                }else{
                    return 'no phone number';
                }
            },
            customerPhoneLink(){
                if (this.customer.account.contact_number) {
                    return 'tel:'+this.customer.account.contact_number;
                }else{
                    return false;
                }
            },

        },
        created(){
            this.getIncomeOverview();
        },
    }
</script>
