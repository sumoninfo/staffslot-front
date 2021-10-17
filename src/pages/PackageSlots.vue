<template>
  <div class="row justify-content-center">
    <div class="col-md-10">
      <div class="card-box" style="margin-bottom: 10px;">
        <slot-filter
          :events="events"
          @on-change="getSlots"
        />
    </div>
    <Preloader class="mt-5" v-if="loading" />
        <AvailableSlotItem
          v-for="slot in slots"
          :key="slot.slot_id"
          :slotItem="slot"
        />
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import AvailableSlotItem from '../components/AvailableSlotItem.vue'
import Preloader from '../components/Preloader.vue'

export default defineComponent({
  name: 'PackageSlots',

  components: { AvailableSlotItem, Preloader },

  data() {
    return {
      events: [],
      slots: [],
      loading: false
    }
  },

  async mounted() {
    this.loading = true;
    const response = await this.$store.dispatch('callApi', {
      method: 'get',
      url: `/api/package/events/${this.$route.params.packageOrderId}`,
    });
    this.events = response.data.events;
    this.slots = response.data.available_slots;
    this.videoSlots = response.data.available_video_slots;
    this.products = response.data.available_products;
    this.loading = false;
  },

  methods: {
    getSlots() {

    }
  }
})
</script>
