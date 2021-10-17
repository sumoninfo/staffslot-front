<template>
<div class="row">
  <Preloader v-if="loading" />
  <div class="col-md-3"></div>
  <div class="col-md-6">
    <div v-if="slot" class="card-box slot-details">
      <h3 class="text-center">{{ slot.title }}</h3>
      <br>
      <p class="text-center">{{ slot.description }}</p>
      <div class="promo-video text-center mb-2">
        <div v-for="video,k in slot.videos" :key="k" style="display: inline-table; margin: 1px;">
          <video-thumb v-if="video" @click="playingVideo = video" :video="video" style="width: 275px; height: 155px;" />
        </div>
      </div>
      <br>
      <table class="table">
        <tbody>
          <tr>
            <td class="confirm-slot-field"><strong>{{ __('Location') }}</strong></td>
            <td>{{ slot.location_place }} ({{ slot.location_address }})</td>
          </tr>
          <tr>
            <td class="confirm-slot-field"><strong>{{ __('Notes') }}</strong></td>
            <td>{{ slot.notes }}</td>
          </tr>
          <tr>
            <td class="confirm-slot-field"><strong>{{ __('Cancellation Policy') }}</strong></td>
            <td>{{ slot.cancellation_policy }}</td>
          </tr>
          <tr>
            <td class="confirm-slot-field"><strong>{{ __('Duration') }}</strong></td>
            <td>{{ slot.duration }}</td>
          </tr>
          <tr v-if="slot.multidays && slot.multidays.length">
            <td class="confirm-slot-field"><strong>{{ __('Days & Times') }}</strong></td>
            <td>
              <ul>
                <li v-for="slotTimes,i in slot.multidays" :key="i">
                  {{ slotTimes.day }} {{ slotTimes.start_time }} {{ slotTimes.end_time }}
                </li>
              </ul>
            </td>
          </tr>
          <tr v-else-if="slot.ongoing">
            <td><strong>{{ __('Ongoing') }}</strong></td>
            <td>
              <p><span style="font-size: 0.9rem; display: inline;">{{ __('from') }}:</span> {{ slot.event_day }} {{ slot.start_time }}
              </p>
              <p><span style="font-size: 0.9rem; display: inline;">{{ __('to') }}:</span> {{ slot.end_day }} {{ slot.end_time }}</p>
            </td>
          </tr>
          <tr v-else>
            <td class="confirm-slot-field"><strong>{{ __('Day') }}</strong></td>
            <td>{{ slot.event_day }}</td>
          </tr>
          <tr>
            <td class="confirm-slot-field"><strong>{{ __('Time') }}</strong></td>
            <td>{{ slot.start_time }} - {{ slot.end_time }}</td>
          </tr>
          <tr>
            <td class="confirm-slot-field"><strong>{{ __('Cost') }}</strong></td>
            <td>${{ slot.cost_pretty }}</td>
          </tr>
          <tr>
            <td class="confirm-slot-field"><strong>{{ __('Available slots') }}</strong></td>
            <td>
              <span class="text-left" v-if="!slot.available_slots">{{ __('No Available Slots. Fully Booked.') }}</span>
              <span v-else>{{ slot.available_slots }}/{{ slot.slots }}</span>
            </td>
          </tr>
          <tr v-if="slot.event.waiver_url">
            <td class="confirm-slot-field"><strong>{{ __('Slot waiver') }}</strong></td>
            <td><a target="blank" :href="slot.event.waiver_url">{{ slot.event.waiver_url }}</a></td>
          </tr>
          <tr v-if="slot.event.doc_url">
            <td class="confirm-slot-field"><strong>{{ __('Other') }}</strong></td>
            <td><a target="blank" :href="slot.event.doc_url">{{ slot.event.doc_url }}</a></td>
          </tr>
        </tbody>
      </table>
      <br>
      <div v-if="!slot.is_available" class="alert alert-secondary">
        <div v-if="!slot.user.available_after">
          {{slot.user.account.first_name}} {{slot.user.account.last_name}}, {{ __('is temporarily unavailable. Please check back again soon or') }} <a href="{{route('search.showDetails',slot.user_id)}}">{{ __('click here') }}</a> {{ __('to send a message.') }}
        </div>
        <div v-else>
          {{slot.user.account.first_name}} {{slot.user.account.last_name}}, {{ __('is temporarily unavailable for today. Please select a different day or') }} <a href="{{route('search.showDetails',slot.user_id)}}">{{ __('click here') }}</a> {{ __('to send a message.') }}
        </div>
      </div>
      <div v-if="!slot.is_available" class="alert alert-warning">
        {{ __('This pro is temporarily unavailable for booking on this day. Please contact the Pro for other options.') }}
      </div>
      <div v-if="slot.deadline_passed" class="alert alert-danger">
        {{ __('The booking deadline has passed for this event. Please contact the Pro for other options') }}.
      </div>
      <form v-if="user && bookable" id="booking-form">
        <div class="form-group row">
            <label for="customer_notes" class="col-8 col-form-label">{{ __('Note for pro (optional)') }}</label>
            <textarea id="customer_notes" name="customer_notes" class="col-11 form-control ml-2" maxlength="250"></textarea>
        </div>
        <div class="row justify-content-center mb-3">
            <strong class="col-3 pt-2">{{ __('Slot Qty') }}: </strong>
            <select class="form-select col-2" name="count" v-model="quantity" style="width: 60px;">
                <option
                  v-for="i in maxSlots"
                  :key="i"
                  :value="i"
                  :disabled="i > slot.available_slots"
                >
                  {{ i }}
                </option>
            </select>
        </div>
      </form>
      <pay-buttons
        v-if="user && bookable"
        :packagesSellerName="slot.user.account.full_name"
        :packagesLink="{ name: 'availablePackages', params: {publicId: slot.user.account.public_id} }"
        :packageOrders="packageOrders"
        :description="`Payment for ${slot.title}`"
        :cost="slot.cost"
        :cash="slot.payment_cash"
        :stripe="slot.payment_credit_card"
        :credits="slot.payment_club_credit"
        @pay="pay"
      />
      <GuestPayButtons
        v-if="!user && bookable"
        :item="slot"
        :canBookAsGuest="true"
        @bookAsGuestSuccess="bookAsGuestSuccess"
      />
      <h3 class="text-center" v-if="!slot.available_slots">This slot is fully booked.</h3>
    </div>
  </div>
  <div class="col-md-3"></div>
</div>
</template>

<script>
import axios from 'axios'
import { defineComponent } from 'vue'
import helpers from '../mixins/helpers.js'
import GuestPayButtons from '../components/Controls/GuestPayButtons.vue'
import Preloader from '../components/Preloader.vue'

export default defineComponent({
  name: 'ConfirmSlot',
  mixins: [ helpers ],
  components: { GuestPayButtons, Preloader },

  data() {
    return {
      slot: null,
      packageOrders: null,
      quantity: 1,
      loading: true
    }
  },
  computed: {
    user() {
      return this.$store.state.user
    },
    bookable() {
      return this.slot.is_available && !this.slot.deadline_passed && this.slot.available_slots
    },
    maxSlots() {
      return this.slot.bookings_per_person || this.slot.slots
    }
  },
  async mounted() {
    if (this.$route.query.session_id && this.$route.query.m) {
      const guest = JSON.parse(decodeURIComponent(escape(window.atob(this.$route.query.m))))
      this.bookAsGuest({ id: this.$route.query.session_id, ...guest });
    }
    this.loading = true
    const response = await axios.get(`/api/booking/confirm-slot/${this.$route.params.id}/${this.$route.params.packageOrderId || ''}`)
    this.slot = response.data.slot;
    this.packageOrders = response.data.packageOrders;
    this.loading = false
  },
  methods: {
    async pay (currency, data) {
      const response = await this.$store.dispatch('callApi', {
        method: 'post',
        url: `/api/slot/${this.slot.slot_id}/book`,
        data: {
          with: currency,
          count: this.quantity,
          ...data
        }
      });

      if (response.data.success) {
        this.$store.dispatch('fetchBookings');
        this.$store.commit('setFlashMessage', 'The slot successfully booked')
        this.$router.push({ name: 'bookingList' });
      }
    },
    async bookAsGuest (data) {
      const response = await axios.put(`/api/slot/${this.$route.params.id}/book-as-guest`, {
          with: 'credit_card',
          ...data
      });

      if (response.data.success){
          this.bookAsGuestSuccess()
          this.$router.replace({ query: null });
      } else {
          this.$store.commit('pushError', response.data)
      }
    },
    bookAsGuestSuccess() {
      this.$store.commit('setFlashMessage', 'The slot successfully booked')
    }
  }
})
</script>
