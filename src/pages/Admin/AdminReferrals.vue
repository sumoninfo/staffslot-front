<template>
  <h1>{{__('Admin Referrals')}}</h1>
</template>

<script>
  import { defineComponent } from 'vue'
  import helpers from '../../mixins/helpers'

  export default defineComponent({
    mixins: [ helpers ],
  })
</script>
