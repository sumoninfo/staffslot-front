<template>
  <Preloader v-if="loading" />
  <invite-list-table
    v-if="invite_lists"
    :invitelist="invite_lists"
  />
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
        loading: false,
        invite_lists: null
      }
    },

    async mounted() {
      this.loading = true
      const response = await this.$store.dispatch('callApi', {
        method: 'get',
        url: `/api/invite-list`
      })
      this.loading = false

      if (response.data.success)
        this.invite_lists = response.data.my_invite_lists
    }
  })
</script>
