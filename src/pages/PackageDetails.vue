<template>
  <Preloader v-if="loading" />
  <ts-package-details v-if="pkg" :package="pkg" />
  <pay-buttons
    v-if="pkg"
    :description="`Payment for ${pkg.package_name}`"
    :cost="pkg.cost"
    :cash="pkg.cash_enabled"
    :stripe="pkg.credit_card_enabled"
    :credits="pkg.club_credit_enabled"
    @pay="pay"
  />

</template>

<script>
import { defineComponent } from 'vue'
import Preloader from '../components/Preloader.vue'

export default defineComponent({
  name: 'PackageDetails',

  components: { Preloader },

  data() {
    return {
      loading: false,
      pkg: null
    }
  },

  async mounted() {
    this.loading = true
    const response = await this.$store.dispatch('callApi', {
      method: 'get',
      url: `/api/package/view/${this.$route.params.packageId}`,
    });
    this.pkg = response.data.timeSlotsPackage;
    this.loading = false
  },

  methods: {
    async pay(method) {
      let url;

      switch (method) {
        case 'free':
          url = '/api/package/buy/free'
          break;
        case 'cash':
          url = '/api/package/buy/cash'
          break;
        case 'credit_card':
          url = '/api/package/buy/card'
          break;
        case 'club_credit':
          url = '/api/package/buy/club-credit'
          break;
      }

      const response = await this.$store.dispatch('callApi', {
        method: 'post',
        url,
        data: {
          package_id: this.pkg.id
        }
      });

      if (response.data.success == true) {
        this.$store.dispatch('fetchPackageOrders')
        this.$store.commit('setFlashMessage', 'Package purchase complete. Select the package below to start')
        this.$router.push({ name: 'packageOrders' });
      }
    }
  }
})
</script>
