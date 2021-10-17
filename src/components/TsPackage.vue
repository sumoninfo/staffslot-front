<template>
    <div class="card package-box">
    	<div class="row package-cover">
        	<div class="col-12">
				<h5>
					<span class="pull-right"><button v-on:click="deletePackage" class="btn btn-default delete-link"><i class="fa fa-close"></i></button></span>
				</h5>
				<h3 class="package-title">
					<a :href="'/package/view/' +package.id" v-text="package.package_name"></a>
				</h3>
				<div class="row package-details">
					<div class="col-12 col-sm-4 package-pricing">
						<p v-html="packageCost"></p>
            <a v-html="packagePrivacyType"></a>
					</div>
					<div class="col-4">
					</div>
				</div>
			</div>
    	</div>
    	<div class="row">
			<div class="col-12">
				<div class="row package-stats">
					<div class="col-collapsable package-status">
						<div class="package-status-box booked">
							<h6>{{ __('Sold') }}</h6>
							<h5 v-text="package.sold +'/'+ packageQuantity"></h5>
						</div>
					</div>
					<div class="col-collapsable package-status">
						<div class="package-status-box earning">
							<h6>{{ __('Earnings') }}</h6>
							<h5 v-text="earnings"></h5>
						</div>
					</div>
					<div class="col-collapsable package-status text-center">
						<div :class="'package-status-box-small status-'+ packageStatus">
							<!-- <p>Status</p> -->
							<a v-html="packageStatus"></a>
						</div>
					</div>
          
				</div>
			</div>
    	</div>
        <div class="row">
    			<div class="col-12">
            <div class="col-sm-12 col-md-4 col-lg-4">
              <div class="row row-copy-book pull-right">
				<!-- <a :href="'/package/view/' +package.id" class="btn btn-view"><i class="fa fa-calendar-alt"></i> Customer History</a> -->
              <router-link
                class="btn btn-edit"
                :to="{ name: 'editPackage', params: { packageId: package.id }}"
              >
                <i class="fa fa-pencil"></i> {{ __('Edit Pkg') }}
              </router-link>
				<ClipboardButton class="btn btn-sm btn-link btn-clipboard" :clipboard-text="packageViewLink">
					<span class="button-icon">
						<i class="fa fa-copy"></i>
					</span>
					<span class="button-text">{{ __('Copy Link') }}</span>
				</ClipboardButton>
                <div class="btn-navigation button-nav">
                  <button class="btn btn-sm btn-link btn-book-customer" v-on:click="bookForCustomer"><span class="button-icon"><i class="fa  fa-plus-square"></i></span>{{ __('Book Clients') }}</button>
					<button class="btn-invite-customer btn btn-sm  btn-secondary mr-1 mb-1" v-on:click="inviteCustomer('email')"><span class="button-icon"><i class="fa  fa-envelope"></i></span>{{ __('Email Invite') }}</button>
                  <button class="btn-invite-customer btn btn-sm btn-secondary mb-1" v-on:click="inviteCustomer('sms')"><span class="button-icon"><i class="fa fa-commenting-o"></i></span>{{ __('SMS Invite') }}</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
</template>

<script>
    import $ from 'jquery';
    import axios from 'axios'
    import helpers from '../mixins/helpers';
    import Swal from 'sweetalert2'
    import ClipboardButton from './Controls/ClipboardButton.vue'

    export default {
        mixins: [helpers],
    	props:['package'],
    	template:'ts-package',
    	data:function(){
    		return{
    		};
    	},
        components: { ClipboardButton },
    	computed:{
    		packageCost: function packageCost(){
				if (this.package.cost) {
					return '<span>Cost: $' +this.package.cost_pretty +'</span>';
				} else {
					return '<span class="label label-success">Free</span>';
				}
			},
    		packagePrivacyType: function packageCost(){
				if (this.package.is_public) {
					return '<span class="label label-primary-public mt-2">PUBLIC</span>';
				}else{
					return '<span class="label label-success">PRIVATE</span>';
				}
			},
			packageQuantity: function packageQuantity(){
				if (this.package.quantity) {
					return this.package.quantity
				} else {
					return "∞";
				}
			},
			earnings: function earnings(){
				//TODO: add earnings in package model
				return '$'+ this.package.earnings;
			},
			packageStatus: function packageStatus(){
				this.package.status ='active';

				if (this.package.expiry_type=='date') {
					var _date = new Date(this.package.expiry);
					var today = new Date();
					if (_date<today) {
						this.package.status ='inactive';
						return this.package.status;
					}
				}
				//TODO: add sold in package models
				if(this.package.quantity>0 && this.package.quantity<= this.package.sold){
					this.package.status ='sold out';
				}
				return this.package.status;
			},
			packageViewLink() {
				return window.base_url()+"package/view/"+this.package.id;
			},
    	},
    	methods:{
            deletePackage: async function deletePackage(){
    			//ask confirmation
    			//send delete request
    			//show response
    			let package_id = this.package.id;
                const _this = this;
                const result = await Swal.fire({
                    title: 'Delete Package?',
                    text: "This will cancel all active autorenewal. customers will still be able to use remaining credits.",
                    type: 'error',
                    showCancelButton: true,
                    confirmButtonText: 'Delete',
                    cancelButtonText: 'Cancel',
                    confirmButtonClass: 'btn btn-danger',
                    cancelButtonClass: 'btn btn-default',
                    showLoaderOnConfirm: true,
                })
                if (result.isConfirmed) {
                    _this.emitter.emit('loadingStart');
                    axios.delete("/api/time-slots-package/"+package_id).then(function(response){
                        _this.emitter.emit('loadingStop');
                        _this.$store.commit('setFlashMessage', 'The package was deleted!')
                        _this.$store.dispatch('fetchPackages')
                    });
                }
    		},
        bookForCustomer:function bookForCustomer() {
          this.emitter.emit('bookForCustomer', this.package,'package')

          if (this.package.cash_enabled) {
            $('#btn-book-customer-cash').show();
            $('#btn-book-customer-free').hide();
          }else{
            $('#btn-book-customer-free').show();
            $('#btn-book-customer-cash').hide();
          }

          if (this.package.club_credit_enabled) {
            $('#btn-book-customer-club').show();
          }else{
            $('#btn-book-customer-club').hide();
          }
        },
        inviteCustomer:function inviteCustomer(_type,) {
          this.emitter.emit('inviteCustomer', {item: this.package, _type, item_type: 'package'})
        },
    	}
    };
</script>
