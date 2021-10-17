<template>
  <div v-if="errorMessages && errorMessages.length" class="error-messages">
    <ul class="list-unstyled m-0 p-0">
      <li v-for="message,i in errorMessages" :key="i">{{ printMessage(message) }}</li>
    </ul>
    <button @click="dismiss" class="btn btn-danger">{{__('Dismiss')}}</button>
  </div>
</template>
<script>
import { defineComponent } from 'vue'
import helpers from '../mixins/helpers'

export default defineComponent({
  mixins: [ helpers ],
  computed: {
    errorMessages() {
      return this.$store.state.errorMessages;
    }
  },
  methods: {
    dismiss() {
      this.$store.commit('clearErrors')
    },
    printMessage(message) {
      if (message.errors) {
        return [message.message, ...Object.keys(message.errors).map(key =>
          message.errors[key])].join(' ')
      } else if (message.message) {
        return message.message
      } else {
        return message
      }
    }
  }
})
</script>
