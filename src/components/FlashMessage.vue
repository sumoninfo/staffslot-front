<template>
  <div class="flash-message" v-if="flashMessage">
    {{ flashMessage }}
    <button @click="dismiss" class="btn btn-success">{{__('Dismiss')}}</button>
  </div>
</template>
<script>
import { defineComponent } from 'vue'
import helpers from '../mixins/helpers'

export default defineComponent({
  mixins: [ helpers ],
  computed: {
    flashMessage() {
      return this.$store.state.flashMessage.value
    }
  },
  methods: {
    dismiss() {
      this.$store.commit('setFlashMessage', null)
    }
  }
})
</script>
