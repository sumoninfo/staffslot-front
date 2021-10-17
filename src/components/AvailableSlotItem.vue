<template>
  <div class="list-collapsable event-list-section">
    <div class="row">
      <div class="col-md-8">
        <p class="col-collapsable event-title item-title-sm"><strong>{{ __('Event') }}:</strong>
          <router-link :to="{ name: 'bookSlot', params: { id: slotItem.slot_id }}" v-if="!isFull(slotItem)">
            {{ slotItem.title }}
          </router-link>
          <a v-else>{{ slotItem.title }}</a>
        </p>
        <p class="col-collapsable event-location-name item-title-sm"><strong>{{ slotItem.location_place }}</strong></p>
        <p class="col-collapsable event-minutes item-title-sm" style="width: 100%;"> {{ slotItem.description }}</p>
        <p v-if="slotItem.ongoing" class="col-collapsable event-minutes item-title-sm"><strong>{{ __('from') }}:</strong> {{
          slotItem.event_day }}<br> {{ slotItem.start_time }}<br></p>
        <p v-if="slotItem.ongoing" class="col-collapsable event-minutes item-title-sm"><strong>{{ __('to') }}:</strong> {{
          slotItem.end_day }}<br> {{ slotItem.end_time }}</p>
        <p v-if="!slotItem.ongoing" class="col-collapsable event-minutes item-title-sm"><strong>{{ __('when') }}:</strong> {{
          slotItem.event_day }}<br> {{ slotItem.start_time }} - {{ slotItem.end_time }}</p>
        <p class="col-collapsable event-cost item-title-sm"><strong>{{ __('Cost') }}:</strong> ${{ slotItem.cost }}</p>
        <p v-if="slotItem.slots !== slotItem.bookings_count" class="available-slots-field"><strong>{{ __('Available slots')
            }}:</strong> {{ slotItem.slots - (slotItem.bookings_count || slotItem.bookings.length) }}/{{ slotItem.slots }}</p>
        <p v-if="slotItem.slots === slotItem.bookings_count" class="available-slots-field"><strong>{{ __('Available slots')
            }}:</strong> {{ __('Fully Booked') }}</p>
        <ul class="solts-visualizer" :class="{ full: isFull(slotItem) }">
          <li v-for="i in slotItem.slots" :key="i" :class="{ booked: i <= slotItem.bookings_count }"
            :style="`width: ${1/slotItem.slots * 100}%;`"></li>
        </ul>
      </div>
      <div class="col-md-4">
        <div class="row row-three-buttons">
          <div class="btn-navigation button-nav" v-if="!isFull(slotItem)">
            <router-link
              class="btn btn-success slot-button"
              :to="{
                name: 'bookSlot',
                params: {
                  id: slotItem.slot_id
                }
              }"
            >
              {{ __('Select slot') }}
            </router-link>
          </div>
          <div class="btn-navigation button-nav" v-else>
            <a class="btn btn-default slot-button" disabled>
              {{ __('Fully booked') }}
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import helpers from '../mixins/helpers'

export default defineComponent({
  name: 'AvailableSlotItem',

  mixins: [ helpers ],

  props: {
    slotItem: {
      type: Object
    }
  },

  methods: {
    isFull (slot) {
      return slot.bookings_count >= slot.slots;
    }
  }
})
</script>
