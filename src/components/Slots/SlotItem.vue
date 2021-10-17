<template>
    <div class="list-collapsable event-list-section">
        <div v-if="!inactive" class="row">
            <div class="col-sm-12 col-md-6 col-lg-6">
              <p v-if='managed' class="col-collapsable">{{slotitem.user.account.full_name}}</p>
              <p class="col-collapsable event-title item-title-sm">
                <router-link :to="{
                  name: 'slotDetails',
                  params: { slotId: slotitem.slot_id }
                }">{{ slotitem.title }}</router-link>
              </p>
              <p class="col-collapsable event-location-name item-title-sm">
              <strong><span v-text="slotitem.location_place"></span></strong>
              </p>
              <p class="col-collapsable event-minutes item-title-sm"><strong>{{ __('Start & End') }}</strong>
                <span class="me-1" v-text="slotitem.event_day"></span>
                <span v-text="slotitem.start_time"></span>
                <br>
                <span class="me-1" v-text="slotitem.end_day"></span>
                <span v-text="slotitem.end_time"></span>
              </p>
              <p class="col-collapsable event-cost item-title-sm"><strong>{{ __('Booked') }}:</strong> <a :href="slotPageLink"> {{slotitem.bookings_count}}/{{ slotitem.slots }}</a></p>
              <p>
                <span v-if="slotitem.is_private" class="label label-success">{{ __('PRIVATE') }}</span>
                <span v-if="!slotitem.is_private" class="label label-primary">{{ __('PUBLIC') }}</span>
              </p>
            </div>

            <div class="col-sm-12 col-md-4">
                <div v-if="slotitem.bookings_count>0">
                    <a class="h6 text-primary" href="#" data-bs-toggle="collapse" :data-bs-target="'#booking-'+type+'-'+slotitem.slot_id">{{ __('View Bookings') }}</a>
                    <div :id="'booking-'+type+'-'+slotitem.slot_id" class="collapse">
                        <ol>
                            <li v-for="booking in slotitem.bookings" :key="booking.booking_id">
                                <span v-if="booking.user" v-text='booking.user.account.full_name'></span>
                                <span v-if="booking.guest">{{ booking.guest.name }}</span>
                            </li>
                        </ol>
                    </div>
                </div>
            </div>

            <div class="col-sm-12 col-md-2 col-lg-2">
              <div class="row row-copy-book pull-right" style="width: auto">
                <div class="btn-navigation button-nav">
                  <button v-show="slotitem.slots >slotitem.bookings_count" class="btn btn-sm btn-link btn-book-customer mb-1" v-on:click="bookForCustomer"><span class="button-icon"><i class="fa  fa-plus-square"></i></span>{{ __('Book Customers') }}</button>
                  <ClipboardButton class="btn btn-sm btn-link btn-clipboard mb-1" :clipboard-text="confirmSlotLink"><span class="button-icon"><i class="fa fa-copy"></i></span><span class="button-text">{{ __('Copy Link') }}</span></ClipboardButton>
                  <button
                          v-show="slotitem.slots >slotitem.bookings_count"
                          class="btn-invite-customer btn  btn-sm  btn-secondary mb-1"
                          v-on:click="inviteCustomer('email')">
                      <span class="button-icon"><i class="fa fa-envelope"></i></span>{{ __('Email Invite') }}
                  </button>
                  <button
                          v-if="slotitem.user.account.role!=null && slotitem.user.account.role.name!='pro-free'"
                          v-show="slotitem.slots >slotitem.bookings_count"
                          class="btn-invite-customer btn btn-sm  btn-secondary mb-1"
                          v-on:click="inviteCustomer('sms')">
                      <span class="button-icon"><i class="fa fa-commenting-o"></i></span>{{ __('SMS Invite') }}
                  </button>
                </div>
              </div>
            </div>
            <confirm @confirm="deleteSlot(slotitem.slot_id)">
              <a class="btn btn-default delete-link" href="#"><span class="icon-only"><i class="fa fa-close"></i></span></a>
            </confirm>
            <ul class="solts-visualizer">
              <li
                v-for="si,k in slotitem.slots"
                :key="k"
                :class="{booked:si <= slotitem.bookings_count}"
                :style="'width:'+ (1/slotitem.slots * 100) +'%;'"
              ></li>
            </ul>
        </div>
        <div v-if="inactive" class="row">
            <div class="col-md-4 col-sm-12">
              <p class="col-collapsable event-title item-title-sm"><strong>{{ __('Event') }}:</strong> <a :href="slotPageLink" v-text="slotitem.title"></a></p>
            </div>
            <div class="col-md-3 col-sm-12">
              <p class="col-collapsable event-minutes item-title-sm">
                <strong>{{ __('Start & End') }}</strong>
                <span class="me-1" v-text="slotitem.event_day"></span>
                <span v-text="slotitem.start_time"></span>
                <br>
                <span class="me-1" v-text="slotitem.end_day"></span>
                <span v-text="slotitem.end_time"></span>
              </p>
            </div>

            <div class="col-sm-12 col-md-4">
                <div v-if="slotitem.bookings_count>0">
                    <a class="h6 text-primary" href="#" data-bs-toggle="collapse" :data-bs-target="'#booking-'+type+'-'+slotitem.slot_id">{{ __('View Bookings') }}</a>
                    <div :id="'booking-'+type+'-'+slotitem.slot_id" class="collapse">
                        <ol>
                            <li v-for="booking in slotitem.bookings" :key="booking.booking_id">
                                <span v-if="booking.user" v-text='booking.user.account.full_name'></span>
                                <span v-if="booking.guest">{{ booking.guest.name }}</span>
                            </li>
                        </ol>
                    </div>
                </div>
            </div>

            <div class="col-md-1 col-sm-12 justify-content-end">
                <span class="row h-100">
                  <span class="m-auto" v-text="finishStatus"></span>
                </span>
            </div>
            <ul class="solts-visualizer">
              <li
                v-for="si,k in slotitem.slots"
                :key="k"
                :class="{booked:si <= slotitem.bookings_count}"
                :style="'width:'+ (1/slotitem.slots * 100) +'%;'">
              </li>
            </ul>
        </div>
    </div>
</template>

<script>
    import $ from 'jquery'
    import helpers from '../../mixins/helpers'
    import ClipboardButton from '../Controls/ClipboardButton.vue'

    export default {
        mixins: [helpers],
        props:['slotitem','type','inactive','managed'],
        data: function () {
            return {
            };
        },
        components: { ClipboardButton },
        computed:{
            slotPageLink:function () {
              return "/slot/details/"+this.slotitem.slot_id;
            },
            confirmSlotLink: function() {
              const link = this.$router.resolve({
                  name: 'bookSlot',
                  params: {
                      id: this.slotitem.slot_id
                  }
              })
              return window.location.origin + link.href
            },
            finishStatus:function () {
                if (this.slotitem.disabled==0) {
                    return "Finished";
                } else {
                    return "Canceled";
                }
            }
        },
        methods:{
            bookForCustomer:function bookForCustomer() {
              this.emitter.emit('bookForCustomer', this.slotitem)

              if (this.slotitem.payment_cash && this.slotitem.cost > 0) {
                $('#btn-book-customer-cash').show();
                $('#btn-book-customer-free').hide();
              }else if(this.slotitem.cost == 0){
                $('#btn-book-customer-free').show();
                $('#btn-book-customer-cash').hide();
              }

              if (this.slotitem.payment_club_credit && this.slotitem.cost > 0) {
                $('#btn-book-customer-club').show();
              }else{
                $('#btn-book-customer-club').hide();
              }
            },
            inviteCustomer:function inviteCustomer(_type) {
              this.emitter.emit('inviteCustomer', {item: this.slotitem, _type: _type})
            },
            async deleteSlot(id) {
              const response = await this.$store.dispatch('callApi', {
                method: 'get',
                url: `/api/slot/cancel/${id}`,
              });

              if (response.data.success) {
                this.$store.commit('setFlashMessage', 'Successfully canceled slot and all bookings in relation to this slot');
                this.$store.dispatch('fetchSlots')
              }
            }
        },
    };
</script>
