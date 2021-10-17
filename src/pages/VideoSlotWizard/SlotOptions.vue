<template>
  <div class="location-box">
    <h6>{{ __('Video Event') }} &gt;<span v-html="slot.title"></span></h6>
    <hr>
    <errors :list="errors"/>
    <div class="form-group">
      <label>{{ __('How many video slots are avaiable for sale?') }}</label>
      <input v-if="!unlimited" type="text" class="form-control" v-model="slotsCount">
      <div class="form-check form-switch ms-2">
        <label>Unlimited</label>
        <input class="form-check-input mt-2" type="checkbox" v-model="unlimited">
      </div>
      <hr>
      <div class="text-end">
        <button type="button" class="btn btn-warning me-1" @click="$router.go(-1)"><i class="fa fa-chevron-left"></i>
          Back
        </button>
        <button type="submit" class="btn btn-success" @click="goNext"><span>Next <i
          class="fa fa-chevron-right"></i></span></button>
      </div>
    </div>
  </div>
</template>

<script>
import helpers from "../../mixins/helpers.js"

export default {
  mixins: [ helpers ],
  data() {
    return {
      errors: [],
      slotsCount: null,
      unlimited: false
    }
  },

  mounted() {
    this.slotsCount = this.slot.slotsCountForSale;
    this.unlimited = this.slot.unlimited ? true : false;
  },

  computed: {
    slot() {
      // TODO: redirect to first wizard page if there is no selected event
      return this.$store.state.wizard.videoSlot;
    },
  },

  methods: {
    goNext() {
      if (!this.unlimited && (this.slotsCount == '' || this.slotsCount == null)) {
        this.errors.push('Please specify how many video slots are avaiable for sale.');
        return;
      }

      this.$store.dispatch('wizard/setVideoSlot', {
        ...this.slot,
        slotsCountForSale: this.slotsCount,
        unlimited: this.unlimited
      });
      this.$router.push('/wizard/video/select-promo-video');
    }
  }
}
</script>