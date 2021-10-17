<template id='packageOrder1'>
    <div class="col-12" v-if="package">
        <div class="row">
            <div class="col-12">
                <span class="text-muted"><strong>{{ __('Package name') }}:</strong></span> <span v-text="package.package_name"></span>
            </div>
            <div class="col-12">
                <span class="text-muted">{{ __('Customer name') }}:</span>
                <span v-text="customerName"></span>
            </div>
            <div class="col-6">
                <span class="text-muted">{{ __('Cost') }}:</span>
                <span v-html="packageCost"></span>
            </div>
            <div class="col-6">
                <span>{{ __('Purchased') }}:{{orderDate}}</span>
            </div>
            <div class="col-6">
                <span>{{ __('Usage') }}:</span>
                <span v-html="packageUsage"></span>
            </div>
            <div class="col-6">
                <span v-if="packagetype=='active'">{{ __('Expires') }}:</span>
                <div v-if="packagetype=='active'" v-text="packageExpiration"></div>
            </div>
            <div class="col-3 text-end">
                <span v-on:click="changePaymentStatus" :class="paymentLabelType" v-html="paymentStatus"></span>
            </div>
            <div class="col-9 text-right">
                <router-link :to="viewPackageLink" class="btn btn-view"><i class="fa fa-eye"></i>{{ __('view details') }}</router-link>
                <a v-if="!order.is_expired && !order.is_canceled" class="btn btn-edit pull-right" v-on:click="cancelEventPopup"><span class="icon-only"><i class="fa fa-close"></i></span></a>
            </div>
            <div v-if="stillActive" class="still-active label label-success w-auto">{{ __('Active') }}</div>
        </div>
    </div>
</template>
<script>
    import axios from 'axios'
    import helpers from '../mixins/helpers'
    import moment from 'moment'
    import Swal from 'sweetalert2'

    var selected_order=0;
    //tempaltes
    export default {
        mixins: [helpers],
        props:['package','order','packagetype'],
        template: '#packageOrder1',
        data:function(){
            return{};
        },
        computed:{
            customerName: function customerName(){
                return this.order.account.first_name +' '+this.order.account.last_name;
            },
            packageCost(){
                if (this.order.cost) {
                    return '$'+this.order.cost;
                } else if(this.package.cost) {
                    return this.package.cost_pretty;
                } else {
                    return 'Free';
                }
            },
            packageUsage: function packageUsage(){
                return this.order.used_slots+' / '+ (this.order.allocated_slots ? this.order.allocated_slots : "&infin;");
            },

            stillActive: function packageUsage(){
                return  this.packagetype == 'active' && this.order.used_slots == this.order.allocated_slots;
            },

            packageExpiration: function packageExpiration(){
                if (this.order.expiration=='0000-00-00') {
                    return "never";
                }
                return moment(this.order.expiration).format("MM-DD-YYYY");
            },
            paymentStatus: function paymentStatus(){
                if (this.order.payment_type=='credit_card') {
                    if (this.order.paid) {
                        return 'credit-card paid';
                    } else {
                        return 'credit-card not paid';
                    }
                }else if(this.order.payment_type=='free'){
                    return 'free';
                }else if(this.order.payment_type=='cash'){
                    if (this.order.paid) {
                        return 'cash paid';
                    } else {
                        return 'cash not paid';
                    }
                }else if(this.order.payment_type=='club_credit'){
                    if (this.order.paid) {
                        return 'club credit paid';
                    } else {
                        return 'club credit not paid';
                    }
                }
            },
            paymentLabelType: function paymentLabelType(){
                var label ='label';
                if(this.order.payment_type=='free'){
                    label += " label-info";
                }else if(this.order.paid){
                    label +=" label-success";
                }else{
                    label += " label-danger";
                }
                return label;
            },
            viewPackageLink: function viewPackageLink(){
                return { name: 'packageOrderDetails', params: { packageOrderId: this.order.id }};
            },
            orderDate(){
                return moment(this.order.purchase_date).format("MM/DD/YYYY");
            },
        },
        methods:{
            cancelEventPopup: async function cancelEventPopup(){
                selected_order = this.order.id;
                let order = this.order;
                var _self = this;
                const result = await Swal.fire({
                    title: 'Are you sure?',
                    text: "You won't be able to revert this!",
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Yes',
                    cancelButtonText: 'Cancel',
                    confirmButtonClass: 'btn btn-primary',
                    cancelButtonClass: 'btn btn-default',
                    // buttonsStyling: false
                });
                if (result.isConfirmed) {
                    axios.get("/api/package/order/cancel/"+selected_order).then(function(response){
                        order.is_canceled = 1;
                        _self.bus.$emit("reloadPackageOrderData");
                        this.$store.commit('setFlashMessage', 'Package has been canceled.')
                    });
                };
            },
            changePaymentStatus: async function changePaymentStatus(){
                if ( !(this.order.payment_type=='cash' || this.order.payment_type=='club_credit') || this.order.paid) {
                    return;
                }
                selected_order = this.order.id;
                let order = this.order;
                const result = await Swal.fire({
                    title: 'Did you get paid?',
                    text: "You won't be able to revert this!",
                    type: 'info',
                    showCancelButton: true,
                    confirmButtonText: 'Yes',
                    cancelButtonText: 'Cancel',
                    confirmButtonClass: 'btn btn-success',
                    cancelButtonClass: 'btn btn-default',
                    // buttonsStyling: false
                })
                if (result.isConfirmed){
                    axios.get("/api/package/order/paid/"+selected_order).then(function(response){
                        //set paid true
                        order.paid=1;
                    });
                }
            },
        }
    };
</script>

<style scoped>
    .still-active {
        position: absolute;
        right: 10px;
        top: 10px;
    }
</style>
