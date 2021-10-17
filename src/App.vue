<template>
  <Layout v-if="ready">
    <router-view />
  </Layout>
  <modals-holder />
  <modal :large="true" v-if="playingVideo !== null" :is-visible="true" modal-id="player">
    <player v-if="playingVideo" :video="playingVideo"/>
  </modal>
</template>

<script>
  import { defineComponent } from 'vue'
  import { mapActions, mapState } from 'vuex';
  import videoMixin from './mixins/video'
  import uploadMixin from './mixins/upload'
  import helpers from './mixins/helpers'
  import Layout from './layouts/Main.vue'

  export default defineComponent({
    name: 'App',
    components: { Layout },
    mixins: [ videoMixin, uploadMixin, helpers ].filter(x => x != null),
    data() {
      return {
        ready: false
      }
    },
    computed: {
      ...mapState({
        viewMode: s => s.uiState.viewMode,
        isPro: s => s.uiState.viewMode === 'PRO',
        user: s => s.user
      })
    },
    provide() {
      return {
        initialFetch: this.initialFetch
      }
    },
    async created () {
      this.$store.commit('modals/clear')
      this.$store.commit('clearErrors')
      this.$store.commit('setFlashMessage', null)

      this.ready = true
      if (this.user) {
        this.initialFetch()
      }
    },
    async mounted () {
      if (this.lang && !this.translations) {
        await this.fetchTranslations(this.lang)
      }
    },
    methods: {
      ...mapActions({ setViewMode: 'uiState/setViewMode' }),
      initialFetch() {
        if(this.$route.query['no-preload']){
          const query = {...this.$route.query}
          delete query['no-preload']
          this.$router.replace({ query })
          return
        }
        this.$store.dispatch('notifications/fetch');
        if (this.isPro) {
          this.$store.dispatch('fetchDashboard')
          this.$store.dispatch('fetchEvents')
          this.$store.dispatch('fetchSlots')
          this.$store.dispatch('fetchPackages')
        } else {
          this.$store.dispatch('fetchBookings')
          this.$store.dispatch('fetchPackageOrders')
          this.$store.dispatch('fetchBookmarkPros')
        }
      }
    }
  })
</script>
