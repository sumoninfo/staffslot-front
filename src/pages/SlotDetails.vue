<template>
  <Preloader v-if="loading" />
  <div v-if="slot" class="row">
    <div class="col-md-2"></div>
    <div class="col-md-8">
      <div class="page-title-area" style="display: none;">
        <p>{{ __('Check on time slot booking status and manage attendees.') }}</p>
      </div>
      <div class="card-box">
        <div class="event-detail-header">
          <h3>{{ slot.title }}</h3>
          <br>
          <p>{{ slot.description }}</p>
          <div class="promo-video text-center mb-2" v-if="slot.videos?.length">
            <div v-for="video of slot.videos" :key="video.id" style="display: inline-table; margin: 1px;">
              <video-thumb @click="playingVideo = video" :video="video"
                style="width: 275px; height: 155px;" />
            </div>
          </div>
          <div class="images text-center mb-2" v-if="slot.images?.length">
            <div v-for="image of slot.images" :key="image.id" style="display: inline-table; margin: 1px;">
              <image-thumb :image="image" />
            </div>
          </div>
        </div>
        <br>
        <p>
        <ul class="solts-visualizer">
          <li v-for="si,k in slot.slots" :key="k" :class="{booked:si <= activeBookingsCount}"
            :style="'width:'+ (1/slot.slots * 100) +'%;'"></li>
        </ul>
        </p>
        <br>
        <table class="table">
          <tbody>
            <tr>
              <td class="confirm-slot-field"><strong>{{ __('Location') }}</strong></td>
              <td>{{ slot.location_place }} ({{ slot.location_address }})</td>
            </tr>
            <tr>
              <td><strong>{{ __('Notes') }}</strong></td>
              <td>{{ slot.notes }}</td>
            </tr>
            <tr>
              <td><strong>{{ __('Cancellation Policy') }}</strong></td>
              <td>{{ slot.cancellation_policy }}</td>
            </tr>
            <tr>
              <td><strong>{{ __('Duration') }}</strong></td>
              <td>{{ slot.duration }}</td>
            </tr>
            <tr v-if="slot.multidays">
              <td><strong>{{ __('Days & Times') }}</strong></td>
              <td>
                <p v-for="(day, i) in booking.slot.multidays" :key="i">
                  {{
                  day["day"] +
                  " " +
                  day["start_time"] +
                  " - " +
                  day["end_time"]
                  }}
                </p>
              </td>
            </tr>
            <tr v-else-if="slot.ongoing">
              <td><strong>{{ __('Ongoing') }}</strong></td>
              <td>
                <p><span style="font-size: 0.9rem; display: inline;">{{ __('from') }}:</span> {{ slot.day }} {{ slot.start }}</p>
                <p><span style="font-size: 0.9rem; display: inline;">{{ __('to') }}:</span> {{ slot.end_day }} {{ slot.end }}</p>
              </td>
            </tr>
            <tr v-else>
              <td><strong>{{ __('Day') }}</strong></td>
              <td>{{ slot.day }}</td>
            </tr>
            <tr>
              <td><strong>{{ __('Time') }}</strong></td>
              <td>{{ slot.start }} - {{ slot.end }}</td>
            </tr>
            <tr>
              <td><strong>{{ __('Cost') }}</strong></td>
              <td>${{ slot.cost_pretty }}</td>
            </tr>
            <tr>
              <td colspan="2">
                <ClipboardButton class="btn btn-clipboard"
                  :clipboard-text="bookSlotLink"><span class="button-icon"><i
                      class="fa fa-copy"></i></span><span class="button-text">{{ __('Copy Link') }}</span></ClipboardButton>
                <button v-show="slot.slots > slot.bookings.filter(b => !b.cancelled).length" class="btn-book-customer btn btn-secondary"
                  v-on:click="bookForCustomer(slot)"><span class="button-icon"><i
                      class="fa fa-plus-square"></i></span>{{ __('Book Customers') }}</button>
                <button class="btn-invite-customer btn btn-secondary" v-on:click="inviteCustomer('email')"><span
                    class="button-icon"><i class="fa fa-envelope"></i></span>{{ __('Email Invite') }}</button>
                <button v-if="!slot.user.account.role || slot.user.account.role.name!='pro-free'"
                  class="btn-invite-customer btn btn-secondary" v-on:click="inviteCustomer('sms')"><span
                    class="button-icon"><i class="fa fa-commenting-o"></i></span>{{ __('SMS Invite') }}</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="detail-header bkd-slots-hdr mb-1">
        <h3>{{ __('BOOKINGS') }} ({{ activeBookingsCount }} / {{ slot.slots }})</h3>
      </div>
      <template v-if="slot.bookings">
        <div v-for="booking,key in slot.bookings" :key="key" class="list-collapsable event-list-section"
          data-booking="{{ $booking->booking_id }}">
          <div class="row">
            <div class="col-md-6 col-lg-6">
              <p class="col-collapsable event-slot">{{ key+1 }}</p>
              <div class="col-collapsable event-title item-title-sm"><strong>{{ __('Customer') }}: </strong>
                <a v-if="booking.user" href="#" data-bs-toggle="modal" :data-bs-target="`#model${key}`">{{
                  booking.user.account.first_name }} {{ booking.user.account.last_name }}</a>
                <a v-else href="#" data-bs-toggle="modal" :data-bs-target="`#model${key}`">{{ booking.guest.name
                  }}<span class="ms-1 badge bg-secondary">Guest</span></a>
                <div class="modal" :id="`model${key}`" tabindex="-1" role="dialog">
                  <div class="modal-dialog" role="document">
                    <div class="modal-content">
                      <div class="modal-header">
                        <h5 class="modal-title">{{ __('Client Info') }}</h5>
                        <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
                          <span aria-hidden="true">&times;</span>
                        </button>
                      </div>
                      <div class="modal-body">
                        <template v-if="booking.user">
                          <p>{{ __('Name') }}: {{ booking.user.account.first_name }} {{
                            booking.user.account.last_name }}</p>
                          <p>{{ __('Email') }}: {{ booking.user.email }}</p>
                          <p>{{ __('Contact number') }}: {{ booking.user.account.contact_number }}</p>
                        </template>
                        <template v-else>
                          <p>{{ __('Name') }}: {{ booking.guest.name }}</p>
                          <p>{{ __('Email') }}: {{ booking.guest.email }}</p>
                          <p>{{ __('Contact number') }}: {{ booking.guest.phone }}</p>
                        </template>
                      </div>
                      <div class="modal-footer">
                        <a v-if="booking.user"
                          href="{{ route('profile.showPublicProfile', booking.user.account.public_id) }}"
                          class="btn btn-success">{{ __('View profile') }}</a>
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">{{
                          __('Close') }}</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <p class="col-collapsable event-minutes item-title-sm"><strong>{{ __('Booked on') }}:</strong>
                {{ booking.booked_on }}</p>
              <p class="col-collapsable event-cost item-title-sm"><strong>{{ __('Payment Method') }}:</strong>
                <payment-status-manage :payment-status="booking.payment_status" :booking="booking.booking_id" />
                <span v-if="booking.cancelled != 0">{{ __('Canceled') }}</span>
              </p>
            </div>
            <div class="col-md-6 col-lg-4">
              <p v-if="booking.booked_by == user.user_id"><span class="label label-success">{{ __('Self Booked') }}</span>
              </p>
              <p v-if="booking.booked_by === booking.guest_id"><span class="label label-success">{{ __('Guest Booking') }}</span>
              </p>
              <p v-else-if="booking.booked_by === -1"><span class="label label-primary">{{ __('Auto Booked') }}</span></p>
              <template v-else>
                <p class="note-title">{{ __('Customer Note') }}</p>
                <p class="well">
                  {{ booking.customer_note }}
                </p>
              </template>
            </div>
            <span v-if="booking.cancelled == 1" class="ms-2">{{ __('Canceled') }}</span>
            <confirm v-else @confirm="cancel(booking.booking_id)">
              <button class="btn btn-default delete-link cancel-link">
                <span class="icon-only">
                  <small>{{ __('cancel') }}</small>
                  <i class="fa fa-close"></i>
                </span>
              </button>
            </confirm>
          </div>
        </div>
        <p v-if="activeBookingsCount < slot.slots">{{ __('Open bookings are available for this event.') }} {{
          __('Share time slots with customers to get booked') }}.</p>
      </template>
    </div>
    <div>
      <book-for-customer />
    </div>
    <div>
      <invite-customer />
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { defineComponent } from 'vue'
import helpers from '../mixins/helpers.js'
import ClipboardButton from '../components/Controls/ClipboardButton.vue'
import ImageThumb from '../components/ImageThumb.vue'
import Preloader from '../components/Preloader.vue'
import $ from 'jquery'

export default defineComponent({
  mixins: [ helpers ],
  components: { ClipboardButton, ImageThumb, Preloader },
  data() {
    return {
      activeBookingsCount: 0,
      slot: null,
      loading: false
    }
  },
  computed: {
    user () {
      return this.$store.state.user
    },
    bookSlotLink() {
      const link = this.$router.resolve({
          name: 'bookSlot',
          params: {
              id: this.slot.slot_id
          }
      })
      return window.location.origin + link.href
    }
  },
  async mounted() {
    this.fetch()
  },
  methods: {
    async fetch() {
      this.loading = true;
      const response = await axios.get(`/api/slot/${this.$route.params.slotId}`);
      this.slot = response.data.slot;
      this.activeBookingsCount = response.data.no_of_active_bookings;
      this.loading = false;
    },
    bookForCustomer (slot) {
      this.emitter.emit('bookForCustomer', slot)

      if (+slot.payment_cash) {
        $('#btn-book-customer-cash').show();
        $('#btn-book-customer-free').hide();
      }else{
        $('#btn-book-customer-free').show();
        $('#btn-book-customer-cash').hide();
      }

      if (slot.payment_club_credit) {
        $('#btn-book-customer-club').show();
      }else{
        $('#btn-book-customer-club').hide();
      }
    },
    inviteCustomer(_type){
        this.emitter.emit('inviteCustomer', {item: this.slot, _type})
    },
    async cancel(bookingId) {
      const response = await this.$store.dispatch('callApi', {
        method: 'get',
        url: `/api/slot/booking/cancel/${bookingId}`,
      });

      if (response.data.success) {
        this.$store.commit('setFlashMessage', this.__('Booking was successfully canceled'));
        this.fetch();
        this.$store.dispatch('fetchSlots')
      }
    }
  }
})
</script>
