<template id="package-order">
    <div class="row bg-white package-order" style="position: relative">
        <div class="col-md-4 col-sm-12">
            <p>{{ __('Pro') }}: {{proFullName}}</p>
            <h2 class="package-title"><router-link :to="{ name: 'packageOrderDetails', params: { packageOrderId: order.id }}"><span v-text="order.package.package_name"></span></router-link></h2>
            <!-- <a :href="'/package/order/view/'+order.id" class="btn btn-default"><i class="fa fa-eye"></i></a> -->
            <p class="mt-2">{{ __('Purchased') }}: {{orderDate}}</p>
            <p class="mt-1">{{ __('Expiration') }}: {{packageExpiration}}</p>
            <p class="mt-1">{{ __('Recurring package') }}: {{packageIsReccuring}}
                <confirm
                    @confirm="cancelSubscriptionPopup"
                    v-if="order.renew_count !== 0"
                >
                    <button class="btn btn-link">{{ __('cancel') }}</button>
                </confirm>
            </p>
        </div>
        <div class="col-md-5 col-sm-12">
            <h5>{{ __('Events') }}:</h5>
            <ul class="event-list-scrollable list-unstyled">
                <li
                    v-for="event,i in order.events"
                    :key="i"
                >
                    <label class="label label-primary">
                        <i v-if="event.type == 'video'" class="fa fa-video-camera"></i>
                        <i v-if="event.type == 'product'" class="fa fa-truck"></i>
                        {{ event.title }}
                    </label>
                </li>
            </ul>
        </div>
        <div class="col-12 col-md-3 col-sm-12 pkg-data">
            <div class="package-status">
                <h5 class="mt-2">{{ __('Booking Credits Used') }}:</h5>
                <h2>{{usageStatus}}</h2>
            </div>
            <div v-if="!order.is_canceled" v-on:click="viewPackageEvents" :class="{'package-status text-center':true, 'status-success':!orderExpired, 'status-danger':orderExpired}" :for="'order_'+order.id">
                <router-link v-if="!order.expired" class="text-white pt-2" :id="'order_'+order.id" :to="{ name: 'packageSlots', params: { packageOrderId: order.id }}">{{packageStatus}}</router-link>
                <a v-else class="text-white pt-2" :id="'order_'+order.id">{{packageStatus}}</a>
            </div>
            <div v-else :class="{'package-status text-center':true, 'status-disabled':true}" :for="'order_'+order.id">
                <a class="text-white pt-2" disabled>{{packageStatus}}</a>
            </div>
        </div>
        <!-- <div class="col-md-3 col-sm-12 mt-2">
            <div :disabled="order.is_canceled" v-on:click="viewPackageEvents" :class="{'package-status text-center':true, 'status-success':!orderExpired, 'status-danger':orderExpired}" :for="'order_'+order.id">
                <a class="text-white pt-2" :id="'order_'+order.id" :href="packageOrderLink" >{{packageStatus}}</a>
            </div>
        </div> -->
        <div v-if="active && packageIsReccuring && order.used_slots == order.allocated_slots" class="still-active label label-success mt-1 mr-1">{{ __('Active') }}</div>
    </div>
</template>

<script>
    import axios from 'axios'
    import helpers from '../mixins/helpers'
    import Swal from 'sweetalert2'

    export default {
        mixins: [helpers],
        props:['order', 'active'],
        template: '#package-order',
        data:function(){
            return{};
        },
        computed:{

            proFullName: function proFullName(){
                return this.order.package.account.first_name +' '+ this.order.package.account.last_name;
            },
            packageIsReccuring:function packageIsReccuring(){
                if (this.order.renew_count !==0) {
                    this.order.package.isRecurring =true;
                    return 'yes';
                } else {
                    this.order.package.isRecurring =false;
                    return 'no';
                }
            },
            usageStatus: function usageStatus(){
                var usage = "";
                usage = this.order.used_slots+"/";
                if(this.order.allocated_slots){
                    usage += this.order.allocated_slots;
                }else{
                    usage += '∞';
                }
                return usage;
            },
            packageStatus: function packageStatus(){
                if (this.order.is_canceled) {
                    return "Canceled";
                }
                if (this.orderExpired) {
                    return "Expired";
                }else{
                    return "Book This Item";
                }
            },
            orderExpired: function orderExpired(){
                return this.order.is_expired;
            },
            packageExpiration: function packageExpiration(){
                if (!this.order.expiration) {
                    return "none";
                }
                return this.order.expiration;
            },
            orderDate(){
                return this.order.purchase_date;
            },

        },
        methods:{
            viewPackageEvents: function viewPackageEvents(){
                if (this.order.expired) {
                    return;
                }
                // window.location="/package/events/"+this.order.id;
            },
            cancelSubscriptionPopup: function cancelEventPopup(){
                let selected_order = this.order.id;
                let order = this.order;
                this.ajaxLoading=true;
                axios.get("/api/package/order/cancel-subscription/"+selected_order)
                    .then((response) =>{
                        order.renew_count = 0;
                        this.ajaxLoading=false;
                        Swal.fire(
                            'Canceled!',
                            'This package will not auto renew now.',
                            'success'
                        )
                    });
            },
        }
    };
</script>

<style scoped>
    .still-active {
        position: absolute;
        right: 10px;
        top: 10px;
        width: auto;
    }
</style>
