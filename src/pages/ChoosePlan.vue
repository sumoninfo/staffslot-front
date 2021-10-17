<template>
<div class="row">
  <div class="col-md-12">
    <div class="text-center">
      <h2 class="pt-2">{{__('CHOOSE A PRO ACCOUNT')}}</h2>
      <p>or <a href="https://www.timeslot.pro/support" target="_blank">{{__('Contact support')}}</a> {{__('to switch from paid to free account.')}}</p>
      <div class="get-started-cta">
        <div class="row pricing-plan pt-2">
          <div class="col-md-12">
            <ChoosePlan />
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
  import { defineComponent } from 'vue'
  import helpers from '../mixins/helpers'
  import ChoosePlan from '../components/ChoosePlan.vue'

  export default defineComponent({
    mixins: [ helpers ],
    components: { ChoosePlan }
  })
</script>
