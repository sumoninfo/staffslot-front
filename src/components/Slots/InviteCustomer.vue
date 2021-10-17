<template>
    <div>
        <div id="customer-invite-modal" class="modal" tabindex="-1" role="dialog">
            <div class="modal-dialog" role="document">
                <div class="modal-content bg-light">
                    <div class="modal-header">
                        <h5 class="modal-title cust-list-title">{{ __('Select a Customer to Invite!') }} </h5>
                        <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div id="customer-invite-modal-content" class="modal-body cust-list-modal modal-scroll-60">
                        <div class="container-fluid">
                            <div class="alert alert-danger" v-if="errorMsg!=''" v-text="errorMsg"></div>
                            <p v-if="ajaxLoading"><i class="fa fa-cog fa-spin"></i> {{ __('sending invite') }}...</p>
                            <div v-if="customers.length<1 && !ajaxLoading" class="alert alert-secondary">{{ __('You may only book customers that have previously booked you. Please ask the customer to book a time slot as a customer, then you will be able to book for them') }}.
                            </div>
                            <div class="row">
                                <autocomplete
                                    v-model="toInvite.inviteList"
                                    placeholder="Select list to invite"
                                    :isMultiple="true"
                                    :items="inviteList"
                                    :mapper="{title: 'name', key: 'id'}"
                                    @close="inviteListselected"
                                    style="width: 100%"
                                />
                                <div
                                    v-for="(customer, index) in customers"
                                    :key="customer.user_id"
                                    class="customer-item"
                                    :class="{'bg-light text-muted': invite_type=='sms' && customer.account.contact_number==null}"
                                >
                                    <div v-if="customer!=null && customer.account!=null">
                                        <input :disabled="invite_type=='sms' && customer.account.contact_number==null" class="cust-modal-select mt-1" v-model="toInvite.customers[customer.user_id]" :value="customer.user_id"
                                            type="checkbox" :id="'invite-customer'+customer.user_id" />
                                        <label class="cust-modal-name mt-1" :for="'invite-customer'+customer.user_id">
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
                            <button v-if="invite_type=='email' || invite_type=='all'" id="btn-invite-customer-email" type="button" class="btn btn-primary mt-1 me-1" :disabled="ajaxLoading" v-on:click="inviteSlot('email')">
                                <span v-if="ajaxLoading">
                                    <i class="fa fa-gear fa-spin"></i> {{ __('Inviting') }}...
                                </span>
                                <span v-else>
                                    <i class="fa fa-envelope"></i> {{ __("Invite via Email") }}
                                </span>
                            </button>
                            <button v-if="invite_type=='sms' || invite_type=='all'" id="btn-invite-customer-sms" type="button" class="btn btn-success mt-1 me-1" :disabled="ajaxLoading" v-on:click="inviteSlot('sms')">
                                <span v-if="ajaxLoading">
                                    <i class="fa fa-gear fa-spin"></i> {{ __('Inviting') }}...
                                </span>
                                <span v-else>
                                    <i class="fa fa-envelope"></i> {{ __('Invite via SMS') }}
                                </span>
                            </button>

                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div id="customer-invite-profile-modal" class="modal">
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
import $ from 'jquery'
import axios from 'axios'
import helpers from '../../mixins/helpers'

export default {
    mixins: [helpers],
    data () {
        return {
            ajaxLoading: false,
            toInvite: {
                slot: 0,
                package: 0,
                customers: {
                },
                inviteLists:[],
                invite_type: ''
            },
            slotSelected: null,
            invite_type:'email',
            errorMsg: '',
            customers: [],
            inviteList: [],
            customerSelected: null,
        }
    },
    watch: {
        'toInvite.inviteList'() {
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

            if(this.toInvite.customers)
            for (var property in this.toInvite.customers) {
                if (Object.prototype.hasOwnProperty.call(this.toInvite.customers, property) && this.toInvite.customers[property]) {
                    count++;
                }
            }

            return count;
        },
    },
    mounted () {
        // this.getCustomers()

        this.emitter.on('inviteCustomer', payload => {
            const {item,_type} = payload
            const item_type = payload.item_type || 'slot'
            this.slotSelected = item;

            this.toInvite.type = item_type;

            if (item_type === 'slot') {
              this.toInvite.slot = item.slot_id
            } else if (item_type === 'video') {
                this.toInvite.videoSlot = item.id
            } else if (item_type === 'package') {
              this.toInvite.package = item.id
            } else if (item_type === 'videoSubscription') {
              this.toInvite.videoSubscription = item.id
            }
            this.invite_type = _type;
            $('#customer-invite-modal').modal('show');
            this.getCustomers();
            this.getInviteList();
            this.toInvite.customers={};
        })
    },
    methods: {
        onViewProfile (_index) {
            this.customerSelected = this.customers[_index]
            $('#customer-invite-profile-modal').modal('show')
        },
        inviteSlot (invite_type) {
            if (this.ajaxLoading) {
                return;
            }
            this.toInvite.invite_type = invite_type
            this.ajaxLoading = true
            this.errorMsg = ""

            axios.post('/api/booking/invite-customer', this.toInvite)
                .then((response) => {
                    this.ajaxLoading = false
                    if (response.data.error) {
                        $('#customer-invite-modal').modal('show')
                        this.errorMsg = response.data.msg
                        document.getElementById("customer-invite-modal-content").scrollTop = 0
                    } else {
                        $('#customer-invite-modal').modal('hide')
                        this.$store.commit('setFlashMessage', response.data.msg)
                    }
                })
                .catch(error => console.log(error))
        },
        getCustomers () {
          axios.post('/api/customers/my-customers', {slot:this.toInvite.slot,package:this.toInvite.package})
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
            if (!this.toInvite.inviteList)
                return

            for (var i = 0; i < this.toInvite.inviteList.length; i++) {
                var customers =this.toInvite.inviteList[i].customers;
                for (var j = 0; j < customers.length; j++) {
                    this.toInvite.customers[customers[j].user_id] = true;
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
</style>
