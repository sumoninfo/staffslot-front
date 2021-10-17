<template>
  <div class="row">
    <Preloader v-if="loading" />
    <div class="col-md-2"></div>
    <div class="col-md-8">
      <div class="location-title-area">
        <p><a data-bs-toggle="collapse" href="#collapseExample" aria-expanded="false" aria-controls="collapseExample"><i class="fa fa-play-circle-o" aria-hidden="true"></i> {{ __('Locations Tutorial') }}</a> | <a href="https://www.timeslot.pro/support/" target="_blank" class="support-link"><i class="fa fa-support" aria-hidden="true"></i> <span class="button-text">{{__('Support')}}</span></a></p>
        <div class="collapse" id="collapseExample">
          <p>{{ __('Add, edit and delete locations. These events are available when adding time slots and make it easy to select a location from the list') }}.</p>
          <!-- <div class="plyr__video-embed" id="player" style="margin-bottom: 20px;">
              <iframe src="https://www.youtube.com/embed/0-lkh4Pe3Xw?origin=https://plyr.io&amp;iv_load_policy=3&amp;modestbranding=1&amp;playsinline=1&amp;showinfo=0&amp;rel=0&amp;enablejsapi=1" allowfullscreen allowtransparency allow="autoplay"></iframe>
            </div> -->
          <p>{{__('Enter the full address with city, state and zip')}}.</p>
        </div>
        <h3>{{__('Manage Locations')}}</h3>
        <router-link class="btn btn-success" :to="{ name: 'addLocation' }"><span class="button-icon"><i class="fa fa-map-marker"></i></span>{{ __('CREATE A NEW LOCATION') }}</router-link>
      </div>
      <div class="location-box">
        <h3>{{ __('Pick a Location') }}</h3>
        <hr>
        <div
          v-for="location,i in locations"
          :key="i"
          class="list-collapsable event-list-section"
        >
          <div class="row">
            <div class="col-8 location-info">
              <p class="col-collapsable event-title item-title-sm">
                <strong>{{ __('Location Name') }}:</strong> {{ location.place }}
                <span
                  v-if="location.default"
                  class="badge-tag badge-success ml-2"
                >{{ __('Default') }}</span>
              </p>
              <p class="col-collapsable event-title item-title-sm"><strong>{{ __('Address') }}:</strong> {{ location.address }}</p>
            </div>
            <div class="col-4 location-edit">
              <p class="row-two-buttons">
                <router-link
                  class="btn btn-edit pull-right"
                  :to="{
                    name: 'editLocation',
                    params: { locationId: location.location_id }
                  }"
                >
                  <i class="fa fa-pencil"></i> {{ __('Edit') }}
                </router-link>
              </p>
            </div>
            <confirm @confirm="destroy(location.location_id)">
              <button class="btn btn-default delete-link"><span class="icon-only"><i class="fa fa-close"></i></span></button>
            </confirm>
          </div>
        </div>
      </div>
    </div>
    <div class="col-md-2"></div>
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
        loading: false,
        locations: []
      }
    },
    async mounted() {
      this.fetch()
    },
    methods: {
      async fetch() {
        this.loading = true
        const response = await this.$store.dispatch('callApi', {
          method: 'get',
          url: '/api/location/list'
        });
        this.loading = false

        if (response.data.success) {
          this.locations = response.data.locations
        }
      },
      async destroy(id) {
        const response = await this.$store.dispatch('callApi', {
          method: 'get',
          url: `/api/location/delete/${id}`
        });
        this.loading = false

        if (response.data.success) {
          this.$store.commit('setFlashMessage', 'Successfully deleted the location');
          this.fetch();
        }
      }
    }
  })
</script>
