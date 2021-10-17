<template>
    <div class="col-12 px-0">
        <div :class="'card '+cardActivityClass">
            <div class="row">

                <div class="col-md-4">
                    <div class="col">
                        <a :href="slotLink"
                            class="h5 text-primary"
                            :style="(booking.bookable && booking.bookable.deleted_at) ? 'text-decoration: line-through;' : ''">{{ booking.title }}</a>
                        <p><strong>{{ booking.type }}</strong></p>
                        <h6 v-if="booking.type === 'slot'">{{eventDateTime}}</h6>
                    </div>
                </div>

                <div class="col-2 ml-2">
                    <div>{{ __('Cost') }}:</div>
                    <strong>{{cost}}</strong>
                </div>

                <div class="col-5">
                    <div>{{ __('Booking') }}</div>
                    <strong>{{bookingDate}}</strong>
                </div>

                <div class="col-4">
                    <span>
                        <payment-status-manage :payment-status="booking.payment_status" :booking="booking.booking_id" ></payment-status-manage>
                    </span>
                </div>


            </div>
        </div>
    </div>
</template>
<script>
        import moment from 'moment'
        import helpers from '../../mixins/helpers'

        export default{
            props:['booking'],
            mixins: [helpers],
            data(){
                return{};
            },
            computed:{
                cost(){
                    if ((this.booking.cost !== null ? this.booking.cost : this.booking.bookable.cost)>0) {
                        return '$'+ (this.booking.cost !== null ? this.booking.cost_pretty :  this.booking.bookable.cost_pretty);
                    }else{
                        return 'Free';
                    }
                },
                bookingDate(){
                    return moment(this.booking.created_at).format("ddd MM/DD/YYYY");
                },
                eventDateTime(){
                    return this.booking.bookable.event_day +" "+ this.booking.bookable.start_time;
                },
                cardActivityClass(){
                    if (this.booking.cancelled>0) {
                        return "bg-free";
                    }
                    return "";
                },
                slotLink(){
                    switch (this.booking.type) {
                        case 'slot':
                            return `/slot/details/${this.booking.bookable.slot_id}`;
                            break;

                        case 'video-slot':
                            return `/video/slot/${this.booking.bookable.id}`;
                            break;

                        case 'video-subscription':
                            return `/video/subscriptions/${this.booking.bookable.id}`;
                            break;

                        case 'package':
                            return `/package/view/${this.booking.bookable_id}`;
                            break;

                        default:
                            break;
                    }
                },
            },
            methods:{},
            mounted(){},
        }
</script>
