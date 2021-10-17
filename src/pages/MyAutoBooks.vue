<template>
  <div class="col-12">
    <h2>{{__('AutoBook List')}}</h2>
    <p><a data-bs-toggle="collapse" href="#collapseExample" aria-expanded="false" aria-controls="collapseExample"><i class="fa fa-play-circle-o" aria-hidden="true"></i> {{ __('AutoBook Tutorial') }}</a> | <a href="https://www.timeslot.pro/support/" target="_blank" class="support-link"><i class="fa fa-support" aria-hidden="true"></i> <span class="support-text">{{__('Support')}}</span></a></p>
    <div class="collapse" id="collapseExample">
    <p>{{ __('Customers create AutoBooks to instantly book your time slots. The customer picks the event type, day(s) of the week and time(s). When your create a matching slot, the slot is instantly booked for that customer. Click the red "cancel" button to cancel the customer\'s autobooking') }}.</p>
      <div class="plyr__video-embed" id="player" style="margin-bottom: 20px;">
        <iframe src="https://www.youtube.com/embed/lynB_9e2Dbo?origin=https://plyr.io&amp;iv_load_policy=3&amp;modestbranding=1&amp;playsinline=1&amp;showinfo=0&amp;rel=0&amp;enablejsapi=1" allowfullscreen allowtransparency allow="autoplay"></iframe>
      </div>
    </div>
    <Preloader v-if="loading" />
    <pro-autobook-list :list="autoBookEvents" />
  </div>
</template>

<script>
  import { defineComponent } from 'vue'
  import helpers from '../mixins/helpers'
  import Preloader from '../components/Preloader.vue'

  export default defineComponent({
    mixins: [ helpers ],
    components: { Preloader },

    data() {
      return {
        autoBookEvents: null,
        loading: false
      }
    },

    async mounted() {
      this.loading = true
      const response = await this.$store.dispatch('callApi', {
        method: 'get',
        url: `/api/my-autobooks`,
      });
      this.autoBookEvents = response.data.autoBookEvents;
      this.loading = false
    }
  })
</script>
