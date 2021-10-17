<template>
  <modal :large="true" :is-visible="true" modal-id="book-as-guest">
    <template v-slot:header>
        {{ __('Guest Booking Form') }}
    </template>
    <book-as-guest @success="success" :slot-obj="item"></book-as-guest>
  </modal>
</template>

<script>
  import { defineComponent } from 'vue'
  import helpers from '../../mixins/helpers'

  export default defineComponent({
    mixins: [ helpers ],
    props: {
      item: Object,
    },
    methods: {
      success() {
        this.$emit('close')
        this.$emit('success')
      }
    }
  })
</script>
