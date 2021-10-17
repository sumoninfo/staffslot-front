<template>
  <br />
  <div id='package-content' class="container" v-if="pkg">
    <div class="card">
      <h3 class="text-center">{{ __('Package Details') }}</h3>
      <table class="table package-table">
        <tbody>
          <tr>
            <th>{{ __('Package') }}:</th>
            <td>{{pkg.package_name}}</td>
          </tr>
          <tr>
            <th>{{ __('Type of Time Slot(s)') }}:</th>
            <td>
              <ul class="px-0 event-list">
                <li
                  class="list-item mt-2"
                  v-for="packageEvent,id in pkg.events"
                  :key="id"
                >
                  <span class="label label-primary"><i v-if="packageEvent.type == 'video'" class="fa fa-video-camera"></i>
                    {{ packageEvent.title }}</span>
                </li>
              </ul>
            </td>
          </tr>
          <tr>
            <th>{{ __('Package Type') }}:</th>
            <td>{{packageType}}</td>
          </tr>
          <tr>
            <th>{{ __('Package Expires') }}:</th>
            <td>{{packageEpiry}} </td>
          </tr>
          <tr>
            <th>{{ __('Package Cost') }}:</th>
            <td>{{packageCost}} <span v-if='pkg.recurring' class="text-primary" v-text="packageRenewInfo"></span>
            </td>
          </tr>
          <tr>
            <th>{{ __('Package Description') }}:</th>
            <td>
              <p class="package-description text left" v-text="pkg.description"></p>
            </td>
          </tr>
        </tbody>
      </table>
      <h3 class="text-center">{{ __('Status') }}</h3>
      <p v-if="packageOrder.is_canceled" class="alert alert-danger"> {{ __('this order was canceled') }}</p>
      <table class="table package-table">
        <tbody>
          <tr>
            <th>{{ __('Pro Name') }}</th>
            <td v-text="packageOrder.package.account.first_name +' '+ packageOrder.package.account.last_name"></td>
          </tr>
          <tr>
            <th>{{ __('Payment Status') }}</th>
            <td>
              <label class="label label-primary" v-html="paymentDetails"></label>
            </td>
          </tr>
          <tr>
            <th>{{ __('Usage') }}</th>
            <td v-html="packageUsage"></td>
          </tr>
          <tr>
            <th>{{ __('Purchased') }}</th>
            <td v-text='formatDate(packageOrder.purchase_date)'></td>
          </tr>
          <tr>
            <th>{{ __('Expires') }}</th>
            <td v-text='formatDate(packageOrder.expiration)'></td>
          </tr>
          <tr>
            <th>{{ __('Renews') }}</th>
            <td>
              <span v-html="packageRenewal"></span>
              <button v-if="packageOrder.renew_count !== 0" class="btn btn-link"
                v-on:click="cancelSubscriptionPopup">{{ __('cancel') }}</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="row mt-4" v-if="bookings.length>0">
      <div class="col-12">
        <h1 class="text-center">{{ __('Bookings') }}</h1>
      </div>
      <div
        v-for="(booking,bindex) in bookings"
        :key="bindex"
        class="col-12"
      >
        <div class="card">
          <div class="row" v-if="booking.slot">
            <div class="col-6" v-text="booking.slot.event_day"></div>
            <div class="col-6" v-text="booking.slot.title"></div>
          </div>
          <div class="row" v-if="booking.video_slot">
            <div class="col-6" v-text="formatDateWithDay(booking.created_at)"></div>
            <div class="col-6" v-text="booking.video_slot.title"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <Preloader class="mt-5" v-if="loading" />
</template>

<script>
import axios from 'axios'
import { defineComponent } from 'vue'
import moment from 'moment-timezone'
import Swal from 'sweetalert2'
import Preloader from '../components/Preloader.vue'
import helpers from '../mixins/helpers'

export default defineComponent({
  name: 'PackageOrderDetails',
  mixins: [ helpers ],
  components: { Preloader },

  data() {
    return {
      loading: false,
      pkg: null,
      packageOrder: null,
      bookingCounts: null,
      bookings: null,
    }
  },

  async mounted() {
    this.loading = true;
    const response = await this.$store.dispatch('callApi', {
      method: 'get',
      url: `/api/package/order/${this.$route.params.packageOrderId}`,
    });
    this.pkg = response.data.timeSlotsPackage
    this.packageOrder = response.data.packageOrder
    this.bookingCounts = this.booking_count
    this.bookings = response.data.bookings
    this.loading = false;
  },

  computed: {
    user() {
      return this.$store.state.user
    },

    packageType: function packageType() {
      if (this.pkg.slots_count) {
        return " includes " + this.pkg.slots_count + " total slots";
      } else {
        return " Has unlimited credits";
      }
    },

    packageCost: function packageCost() {
      if (this.packageOrder.cost) {
        return '$' + this.packageOrder.cost;
      } else if (this.pkg.cost) {
        return this.pkg.cost_pretty;
      } else {
        return 'Free';
      }
    },

    packageEpiry: function packageEpiry() {
      var str = "";
      if (this.pkg.expiry_type == "interval") {
        str = this.pkg.expiry + " after purchase";
      } else if (this.pkg.expiry_type == "date") {
        str = "on " + this.formatDate(this.pkg.expiry);
      } else {
        str = "never";
      }
      return str;
    },

    packageRenewInfo: function packageRenewInfo() {
      if (this.pkg.recurring > 1) {
        return "(This package will renew after every " + this.pkg.expiry + ", for " + this.pkg.recurring + " times)";
      } else if (this.pkg.recurring == 1) {
        return "(This package will renew once after " + this.pkg.expiry + ")";
      }
      else if (this.pkg.recurring == -1) {
        return "(This package will renew after every " + this.pkg.expiry + ")";
      }
    },

    paymentDetails: function paymentDetails() {
      if (this.packageOrder.payment_type == 'free') {
        return 'free';
      } else if (this.packageOrder.payment_type == 'cash') {
        if (this.packageOrder.paid) {
          return 'cash paid';
        } else {
          return 'cash not paid';
        }
      } else if (this.packageOrder.payment_type == 'club_credit') {
        if (this.packageOrder.paid) {
          return 'club credit paid';
        } else {
          return 'club credit not paid';
        }
      } else {
        if (this.packageOrder.paid) {
          return 'credit-card paid';
        } else {
          return 'credit-card not paid';
        }
      }
    },

    packageUsage: function packageUsage() {
      var text;
      text = this.packageOrder.used_slots + ' / ';
      if (this.packageOrder.allocated_slots) {
        text += this.packageOrder.allocated_slots;
      } else {
        text += '∞';
      }
      return text;
    },

    packageRenewal: function packageRenewal() {
      if (this.pkg.recurring > 0) {
        return (this.pkg.recurring - this.packageOrder.renew_count) + ' / ' + this.pkg.recurring;
      } else if (this.pkg.recurring === -1) {
        return (this.pkg.recurring - this.packageOrder.renew_count) + ' / &infin;';
      } else {
        return 'N/A';
      }
    }
  },

  methods: {
    formatDate(date){
      return moment.utc(date).tz(this.user.account.timezone).format("MM/DD/YYYY");
    },

    formatDateWithDay(date){
      return moment.utc(date).tz(this.user.account.timezone).format('ddd MM/DD/YYYY');
    },

    cancelSubscriptionPopup: async function cancelEventPopup() {
      let selected_order = this.packageOrder.id;
      let order = this.packageOrder;
      const result = await Swal.fire({
        title: 'Cancel auto renewal?',
        text: "You won't be able to revert this!",
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'Cancel',
        confirmButtonClass: 'btn btn-primary',
        cancelButtonClass: 'btn btn-default',
        // buttonsStyling: false
      })
      if (result.isConfirmed) {
        this.ajaxLoading = true;
        axios.get("/package/order/cancel-subscription/" + selected_order)
          .then((response) => {
            axios.get('/api/package/orders'); // to save result in cache
            // pressing history back button doesn't actually call API
            // it takes data from cache
            const store = JSON.parse(window.localStorage.vuex);
            store.packageOrders.find(x => x.id == order.id).renew_count = 0;
            window.localStorage.setItem('vuex', JSON.stringify(store));
            order.renew_count = 0;
            this.ajaxLoading = false;
            this.$store.commit('setFlashMessage', 'This package will not auto renew now.')
          });
      }
    },
  }
})
</script>

<style type="text/css">
  .package-table th{
    width: 20%;
  }
  .stripe-button-el {
    display: none !important;
  }
  .payment-section{
    margin: 20px auto;
  }
  .payment-section form {
    display: inline-block;
  }
  .package-table {
    font-size: 1em;
  }
  .event-list li {
    margin: 2px auto;
    list-style:none;
  }
</style>
