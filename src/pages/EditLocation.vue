<template>
  <Preloader v-if="loading" />
  <div v-else class="row">
    <div class="col-md-3"></div>
    <div class="col-md-6">
      <div class="page-title-area">
        <p>{{ __('Event types can be quickly add as a time slot on your calendar. Creating a "preset" event is helpful when you do a certain event more than once.') }}</p>
      </div>
      <div class="location-box">
        <br>
        <div class="form-group">
          <label>{{ __('Location Name') }}</label>
          <input class="form-control" type="text" name="place" v-model="location.place">
        </div>
        <div class="form-group">
          <label>{{ __('Full Address (address,city,state,zip)') }}</label>
          <input class="form-control" type="text" name="address" v-model="location.address">
        </div>
        <div class="form-check form-switch">
          <input class="form-check-input" type="checkbox" v-model="location.default">
          <label class="form-check-label" for="flexSwitchCheckChecked">{{ __('Default') }}</label>
        </div>
        <div class="form-group">
          <loading-button
            :loading="submitting"
            @click="submit"
            class="btn btn-primary"
          >{{ editing ? __('Update') : __('Add') }}</loading-button>
        </div>
      </div>
    </div>
    <div class="col-md-3"></div>
  </div>
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
        location: {},
        loading: false,
        submitting: false
      }
    },
    computed: {
      editing() {
        return !!this.$route.params.locationId;
      }
    },
    mounted() {
      if(this.editing) {
        this.fetch(this.$route.params.locationId)
      }
    },
    methods: {
      async fetch(locationId) {
        this.loading = true
        const response = await this.$store.dispatch('callApi', {
          method: 'get',
          url: `/api/location/edit/${locationId}`,
        });
        this.loading = false

        if (response.data.success) {
          this.location = response.data.location
          this.location.default = !!this.location.default
        }
      },
      async submit() {
        this.submitting = true
        const url = this.editing ? '/api/location/update' : '/api/location/create'
        const response = await this.$store.dispatch('callApi', {
          method: 'post',
          url,
          data: { ...this.location }
        });
        this.submitting = false

        if (response.data.success) {
          if (this.editing)
            this.$store.commit('setFlashMessage', 'Location was successfully updated')
          else
            this.$store.commit('setFlashMessage', 'Location was successfully added')

          this.$router.go(-1);
        }
      }
    }
  })
</script>
