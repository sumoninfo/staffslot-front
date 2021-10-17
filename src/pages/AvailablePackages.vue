<template>
  <div class="container">
    <div class="col-12">
      <p>{{ __('Scroll down to view the available Time Slot Packages') }}.</p>
    </div>
    <package-list :packages="packagesActive" />
  </div>
</template>

<script>
  import axios from 'axios'
  import { defineComponent } from 'vue'
  import moment from 'moment-timezone'
  import helpers from '../mixins/helpers'

  export default defineComponent({
    mixins: [ helpers ],
    data () {
      return {
        packages: null,
        packagesAll: null,
        prosAccounts: null
      }
    },

    computed:{
      packagesActive: function packagesActive(){
        if (!this.packages) {
          return[];
        }
        return this.packages.filter(function(pkg){
          return !pkg.sold_out;
        })
      }
    },

    async created () {
      const response = await axios.get(`/api/packages/${this.$route.params.publicId}`)
      this.packages = response.data.packages
      this.packagesAll = response.data.packages
      this.prosAccounts = response.data.pros
      moment.tz.setDefault(response.data.selected_pro.account.timezone);
    },

    methods:{
      filterByPro: function filterByPro(pro_id){
        if (!pro_id) {
          this.packages = this.packagesAll;
          return;
        }
        axios.get('/package/getByPro/'+pro_id).then(function(response){
          this.packages = response.data.packages;
        })
      }
    }
  })
</script>
