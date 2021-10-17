<template>
    <div class="list-collapsable event-list-section">
      <div class="row">
        <div class="col-md-9 col-lg-10">
          <p class="col-collapsable event-title item-title-sm">
            <router-link :to="bookingDetailLink">{{ bookingitem.slot.title }}</router-link>
          </p>
          <p class="col-collapsable event-location-name item-title-sm"><span v-text="bookingitem.slot.location_place"></span></p>
          <p class="col-collapsable event-minutes item-title-sm" >
          <strong>{{ __('Pro Name') }}:</strong>{{ bookingitem.slot.user.account.first_name }} {{ bookingitem.slot.user.account.last_name }}</p>
          <p v-if="type=='past'" class="col-collapsable event-cost item-title-sm"><strong>{{ __('Cost') }}:</strong>{{bookingCost}}</p>
          <p v-else class="col-collapsable event-cost item-title-sm"><strong>{{ __('Payment') }}:</strong>{{bookingitem.payment_status.type}} {{bookingitem.payment_status.paid}}</p>

          <p class="col-collapsable event-minutes item-title-sm" style="width:100%;">
              <strong>{{ __('Slot Start & End') }}:</strong>
              {{ bookingitem.slot.event_day }} {{ bookingitem.slot.start_time }}<br />
              {{ bookingitem.slot.end_day }} {{ bookingitem.slot.end_time }}
          </p>

        </div>

        <div class="col-md-3 col-lg-2">
          <span v-if="bookingitem.cancelled == 1" class="booking-cancel">{{bookingStatus}}</span>
          <span v-else class="booking-active">{{bookingStatus}}</span>
        </div>

      </div>
    </div>
</template>

<script>
    import helpers from '../../mixins/helpers'

    export default {
        props:['bookingitem','type'],
        mixins: [helpers],
        data: function () {
            return {
            };
        },
        computed:{
          bookingDetailLink(){
            return {
              name: 'bookingDetails',
              params: {
                bookingId: this.bookingitem.booking_id
              }
            };
          },
          bookingStatus(){
            if (this.bookingitem.cancelled) {
              return "Canceled";
            } else if(this.type=="past"){
              return "Finished";
            }else{
              return "Active";
            }
          },
          bookingCost(){
            if (this.bookingitem.slot.cost) {
              return "$"+ (this.bookingitem.slot.cost_pretty);
            }else{
              return "Free";
            }
          },
        },
        methods:{
        },
        mounted() {
            // console.log("mounted booking item");
        }
    };
</script>
