<template>
  <Preloader v-if="loading" />
  <div v-if="booking" class="row">
    <div class="col-md-2"></div>
    <div class="col-md-8">
      <div class="page-title-area">
        <h5>{{ __("Here are the details of your event.") }}</h5>
      </div>
      <div class="card-box">
        <div class="event-detail-header">
          <h3>{{ booking.slot.title }}</h3>
          <br />
          <p>{{ booking.slot.description }}</p>
          <div class="promo-video text-center mb-2">
            <div v-for="video,k in booking.slot.videos" :key="k" style="display: inline-table; margin: 1px;">
              <video-thumb v-if="video" @click="playingVideo = video" :video="video"
                style="width: 275px; height: 155px;" />
            </div>
          </div>
        </div>
        <br />
        <table class="table">
          <tbody>
            <tr>
              <td>
                <strong>{{ __("Pro") }}</strong>
              </td>
              <td>
                {{ booking.slot.user.account.first_name }}
                {{ booking.slot.user.account.last_name }}
              </td>
            </tr>
            <tr>
              <td>
                <strong>{{ __("Contact details") }}</strong>
              </td>
              <td v-if="booking.slot.user.account.contact_number">
                {{ booking.slot.user.account.contact_number }}
              </td>
              <td v-else>{{ __("Not available") }}</td>
            </tr>

            <tr>
              <td>
                <strong>{{ __("Location") }}</strong>
              </td>
              <td>
                {{ booking.slot.location_place }} ({{
                  booking.slot.location_address
                }})
              </td>
            </tr>
            <tr>
              <td>
                <strong>{{ __("Notes") }}</strong>
              </td>
              <td>{{ booking.slot.notes }}</td>
            </tr>
            <tr>
              <td>
                <strong>{{ __("Cancellation Policy") }}</strong>
              </td>
              <td>{{ booking.slot.event.cancellation_policy }}</td>
            </tr>
            <tr>
              <td>
                <strong>{{ __("Duration") }}</strong>
              </td>
              <td>{{ booking.slot.duration }}</td>
            </tr>
            <tr v-if="booking.slot.multidays && booking.slot.multidays.length">
              <td>
                <strong>{{ __("Days") }}</strong>
              </td>
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
            <tr v-else>
              <td>
                <strong>{{ __("Day") }}</strong>
              </td>
              <td>{{ booking.slot.day }}</td>
            </tr>
            <tr>
              <td>
                <strong>{{ __("Time") }}</strong>
              </td>
              <td>{{ booking.slot.start }} - {{ booking.slot.end }}</td>
            </tr>
            <tr>
              <td>
                <strong>{{ __("Cost") }}</strong>
              </td>
              <td>${{ booking.slot.cost_pretty }}</td>
            </tr>
          </tbody>
        </table>
        <div class="cancel-info">
          <p class="cancel-info-text">{{ __('To cancel this slot please contact your pro.') }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { defineComponent } from "vue";
import helpers from "../mixins/helpers";
import Preloader from '../components/Preloader.vue'

export default defineComponent({
  name: "BookingDetails",
  mixins: [helpers],
  components: { Preloader },

  data() {
    return {
      booking: null,
      loading: false
    };
  },

  mounted() {
    this.fetchBooking();
  },

  methods: {
    async fetchBooking() {
      this.loading = true;
      const response = await axios.get(
        `/api/booking/${this.$route.params.bookingId}`
      );
      this.booking = response.data.booking;
      this.loading = false;
    },
  },
});
</script>
