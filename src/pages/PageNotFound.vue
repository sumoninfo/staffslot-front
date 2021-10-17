<template>
  <div class="super-center">
    <h1 class="text-center">404</h1>
    <h2>{{ __('Page not found') }}</h2>
  </div>
</template>

<script>
  import { defineComponent } from 'vue'
  import helpers from '../mixins/helpers'

  export default defineComponent({
    mixins: [ helpers ],
  })
</script>
