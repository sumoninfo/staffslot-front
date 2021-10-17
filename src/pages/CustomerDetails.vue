<template>
  <pro-customer-card v-if="customer" :customer="customer" />
</template>

<script>
  import { defineComponent } from 'vue'
  import axios from 'axios'

  export default defineComponent({
    data() {
      return {
        customer: null
      }
    },

    async mounted () {
      const response = await axios.get(`/api/customers/${this.$route.params.userId}`)
      this.customer = response.data.user
    }
  })
</script>
