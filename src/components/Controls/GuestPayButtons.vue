<template>
  <div class="col-12 text-center">
    <button
      @click="login"
      class="btn btn-primary mt-2 me-2"
    >
      {{ __('Login to proceed') }}
    </button>
    <button
      v-if="canBookAsGuest"
      @click="bookAsGuest"
      class="btn btn-primary mt-2"
    >
      {{ __('Book as Guest') }}
    </button>
  </div>
</template>

<script>
  import { defineComponent } from 'vue'
  import helpers from '../../mixins/helpers';
  import BookAsGuest from '../Modals/BookAsGuest.vue'

  export default defineComponent({
    mixins: [helpers],

    props: {
      canBookAsGuest: Boolean,
      item: Object
    },
    data () {
      return {
      }
    },
    created () {

    },
    methods: {
      login() {
        const { name, params } = this.$route
        this.$store.dispatch('uiState/set', { redirectAfterLogin: { name, params } })
        this.$router.push({ name: 'login' })
      },
      bookAsGuest() {
        this.$store.dispatch('modals/show', { component: BookAsGuest, props: { item: this.item }, on: { success: this.bookAsGuestSuccess } })
      },
      bookAsGuestSuccess() {
        this.$emit('bookAsGuestSuccess')
      }
    }
  })
</script>
