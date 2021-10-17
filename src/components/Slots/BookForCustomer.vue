<template>
    <div>
        <div id="customer-select-modal" class="modal" tabindex="-1" role="dialog">
            <div class="modal-dialog" role="document">
                <div class="modal-content bg-light">
                    <div class="modal-header">
                        <h5 class="modal-title cust-list-title">{{ __('Select a Customer to Book') }}</h5>
                        <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div id="customer-select-modal-content" class="modal-body cust-list-modal modal-scroll-60">
                        <div class="container-fluid">
                            <div class="alert alert-danger" v-if="errorMsg!=''" v-text="errorMsg"></div>
                            <p v-if="ajaxLoading"><i class="fa fa-cog fa-spin"></i> {{ __('booking') }}...</p>
                            <div v-if="customers.length<1 && !ajaxLoading" class="alert alert-secondary">{{ __('You may only book customers that have previously booked you. Please ask the customer to book a time slot as a customer, then you will be able to book for them') }}.
                            </div>
                            <div class="row">
                                <autocomplete
                                    v-model="toBook.inviteList"
                                    placeholder="Select list to book"
                                    :isMultiple="true"
                                    :items="inviteList"
                                    :mapper="{title: 'name', key: 'id'}"
                                    @close="inviteListselected"
                                    style="width: 100%"
                                />
                                <div class="customer-item" v-for="(customer, index) in customers" :key="customer.user_id">
                                    <div v-if="customer!=null && customer.account!=null">
                                        <input class="cust-modal-select mt-1" v-model="toBook.customers[customer.user_id]" :value="customer.user_id"
                                            type="checkbox" :id="'customer'+customer.user_id" />
                                        <label class="cust-modal-name mt-1" :for="'customer'+customer.user_id">
                                            <span v-text="customer.account.full_name"></span>
                                        </label>
                                        <label class="cust-profile-link mt-1 pull-right"><span class="button-icon"><i
                                                    class="fa fa-user-o"></i></span><span class="button-text"><a href="#"
                                                    class="profile-link mt-1" v-on:click="onViewProfile(index)">{{ __('view profile') }}</a></span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <div class="row">
                            <select class="form-control col mt-auto" v-model="toBook.quantity">
                                <option v-for="i in 10" :key="i" :value="i" v-text="i" :disabled="availableSlots<i"></option>
                            </select>
                            <button id="btn-book-customer-free" type="button" class="btn btn-primary ms-1 mt-1" v-on:click="bookSlot('free')" :disabled="ajaxLoading">
                                <span v-if="ajaxLoading">
                                    <i class="fa fa-gear fa-spin"></i> {{ __('Booking') }}...
                                </span>
                                <span v-else>
                                    {{ __('Book for free') }}
                                </span>
                            </button>
                            <button id="btn-book-customer-cash" type="button" class="btn btn-primary ms-1 mt-1" v-on:click="bookSlot('cash')" :disabled="ajaxLoading">
                                <span v-if="ajaxLoading">
                                    <i class="fa fa-gear fa-spin"></i> {{ __('Booking') }}...
                                </span>
                                <span v-else>
                                    <i class="fa fa-dollar"></i> {{ __('Book Cash') }}
                                </span>
                            </button>
                            <button id="btn-book-customer-club" type="button" class="btn btn-success ms-1 mt-1" v-on:click="bookSlot('club_credit')" :disabled="ajaxLoading">
                                <span v-if="ajaxLoading">
                                    <i class="fa fa-gear fa-spin"></i> {{ __('Booking') }}...
                                </span>
                                <span v-else>
                                    <i class="fa fa-diamond"></i> {{ __('Book Club Credit') }}
                                </span>
                            </button>

                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div id="customer-profile-modal" class="modal">
            <div class="modal-dialog">
                <div class="modal-content">
                    <!-- Modal body -->
                    <div class="modal-body">
                        <div class="row justify-content-center">
                            <div class="col-lg-8 col-md-10 col-sm-12">
                                <profile-card v-if="customerSelected!=null" :user="customerSelected"></profile-card>
                            </div>
                        </div>
                        <div class="col-12 text-center">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">{{ __('close') }}</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import $ from 'jquery'
import helpers from '../../mixins/helpers'

export default {
    mixins: [helpers],
    data () {
        return {
            ajaxLoading: false,
            toBook: {
                slot: 0,
                package:0,
                customers: {
                },
                inviteList:[],
                quantity: 1,
                payment_type: ''
            },
            slotSelected: null,
            packageSelected: null,
            errorMsg: '',
            customers: [],
            inviteList:[],
            customerSelected: null
        }
    },
    watch: {
        'toBook.inviteList'() {
            this.inviteListselected()
        }
    },
    computed: {
        availableSlots: function () {
            if (this.slotSelected != null) {
                var selected_customers = this.totoalSelectedCustomers ? this.totoalSelectedCustomers : 1;
                var available_slots = (this.slotSelected.slots - this.slotSelected.bookings_count);
                var slot_distribution = Math.floor(available_slots / selected_customers);
                return slot_distribution;
            } else {
                return 0;
            }
        },
        totoalSelectedCustomers:function(){
            var count = 0;

            if(this.toBook.customers)
            for (var property in this.toBook.customers) {
                if (Object.prototype.hasOwnProperty.call(this.toBook.customers, property) && this.toBook.customers[property]) {
                    count++;
                }
            }

            return count;
        },
    },
    async mounted () {
        // this.getCustomers()

        this.emitter.on('bookForCustomer', (item,item_type='slot') => {
          if (item_type === 'slot') {
            this.toBook.slot = item.slot_id;
            this.slotSelected = item
          } else if (item_type === 'video') {
              this.toBook.videoSlot = item.id;
              this.slotSelected = item
          } else if (item_type === 'videoSubscription') {
              this.toBook.videoSubscription = item.id;
              this.slotSelected = item
          } else {
            this.toBook.package = item.id;
            this.packageSelected = item
          }
            this.getCustomers();
            this.getInviteList();
            $('#customer-select-modal').modal('show')
        })
    },
    methods: {
        onViewProfile (_index) {
            this.customerSelected = this.customers[_index]
            $('#customer-profile-modal').modal('show')
        },
        bookSlot (_payment_type) {
            if (this.ajaxLoading) {
                return;
            }
            this.toBook.payment_type = _payment_type
            this.ajaxLoading = true
            this.errorMsg = ""

            axios.post('/api/booking/book-customer', this.toBook)
                .then((response) => {
                    this.ajaxLoading = false
                    if (response.data.error) {
                        $('#customer-select-modal').modal('show')
                        this.errorMsg = response.data.msg
                        document.getElementById("customer-select-modal-content").scrollTop = 0
                    } else {
                        $('#customer-select-modal').modal('hide')
                        this.$store.commit('setFlashMessage', response.data.msg)
                        this.$store.dispatch('fetchSlots')
                    }
                })
                .catch(error => console.log(error))
        },
        getCustomers () {
            axios.post('/api/customers/my-customers', {slot:this.toBook.slot,package:this.toBook.package})
            .then(response => {
                this.customers = response.data.customers
            });
        },
        getInviteList(){
          axios.post('/api/invite-list/get', {})
          .then(response => {
              this.inviteList = response.data
          });
        },
        inviteListselected(){
            for (var i = 0; i < this.toBook.inviteList.length; i++) {
                var customers =this.toBook.inviteList[i].customers;
                for (var j = 0; j < customers.length; j++) {
                    this.toBook.customers[customers[j].user_id] = true;
                }
            }
        },
    }
}
</script>

<style scoped>
    .customer-item {
        width: 100%;
        background-color: white;
        border: 1px solid #ddd;
        border-radius: 3px;
        padding: 10px;
        margin-top: 10px;
    }

    .modal-footer {
      display: flex;
      justify-content: flex-end;
      align-items: stretch;
      width: 100%;
    }

    .form-control {
      width: auto !important;
      height: 38px !important;
    }
</style>
