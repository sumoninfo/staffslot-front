<template>
  <div id="app" class="container">
    <h3>{{__('Time Slot Requests')}}</h3>
    <p><a data-bs-toggle="collapse" href="#collapseExample" aria-expanded="false" aria-controls="collapseExample"><i class="fa fa-play-circle-o" aria-hidden="true"></i> {{ __('Slot Request Tutorial') }}</a> | <a href="https://www.timeslot.pro/support/" target="_blank" class="support-link"><i class="fa fa-support" aria-hidden="true"></i> <span class="button-text">Support</span></a></p>
    <div class="collapse" id="collapseExample">
    <p>{{ __('Customers can send time slot reqeusts from your profile page. See the date and customer request below. Please reply to each') }}.</p>
    </div>
    <p>{{__('List of time slot requests submitted by customers. Please reply to each request')}}.</p>
    <Preloader v-if="loading" />
    <slot-request v-for="(slotRequest,index) in slotRequests" :request="slotRequest" :key="'slotRequest_'+index"></slot-request>
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
        slotRequests: [],
        loading: false
      }
    },

    async mounted() {
      this.loading = true
      const response = await this.$store.dispatch('callApi', {
        method: 'post',
        url: `/api/request/get`
      });

      if (response.data.success) {
        this.slotRequests = response.data.slotRequests
      }
      this.loading = false
    }
  })
</script>
