<template>
  <div class="row">
      <Preloader v-if="loading" />
      <div class="col-md-2"></div>
      <div v-if="subscription" class="col-md-8">
        <div class="page-title-area">
          <p>{{ __('Subcription status and invoices.') }}
            <a data-bs-toggle="collapse" href="#collapseExample" aria-expanded="false" aria-controls="collapseExample">{{ __('Click to upgrade or cancel') }}</a>.
          </p>
            <div class="collapse" id="collapseExample">
              <div class="subcription-buttons">
                <div v-if="!subscription.cancelled">
                  <router-link class="btn btn-success me-2" :to="{ name: 'choosePlan' }">{{ __('Upgrade Subscription') }}</router-link>
                  <a id="cancel-subscription-button" class="btn btn-danger cancel-button" data-url="{!! route('subscription.getCancelSubscription') !!}">{{ __('Cancel Subscription') }}</a>
                </div>
                <div v-else>
                  <a class="btn btn-success" href="{{ route('subscription.showSelectSubscription') }}">{{ __('Resubscribe') }}</a>
                </div>
              </div>
            </div>
        </div>
        <div class="card-box">
          <h4 class="card-title">{{ __('Subscription Type') }}</h4>
          <table class="table">
              <thead>
                  <tr>
                      <th>{{ __('Type') }}</th>
                      <th>{{ __('Status') }}</th>
                      <th>{{ __('Expiry') }}</th>
                  </tr>
              </thead>
              <tbody>
                  <tr>
                      <td><strong>{{ subscription.type }}</strong></td>
                      <td>{{ subscription.status }}</td>
                      <td>{{ subscription.expiry }}</td>
                  </tr>
              </tbody>
          </table>
          <div v-if="invoices" class="card-section">
            <h4 class="card-title">{{ __('Invoices') }}</h4>
            <table class="table">
              <thead>
                <tr>
                  <th>{{ __('Type') }}</th>
                  <th>{{ __('Description') }}</th>
                  <th>{{ __('Amount') }}</th>
                  <th>{{ __('Date') }}</th>
                  <th>{{ __('Ref.') }}</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="invoice,i in invoices"
                  :key="i"
                >
                  <td class="invoice-type"><strong>{{ invoice.type }}</strong></td>
                  <td>{{ invoice.description }}</td>
                  <td>${{ invoice.amount }}</td>
                  <td>{{ invoice.date }}</td>
                  <td class="invoice-ref">{{ invoice.referrence }}</td>
                </tr>
              </tbody>
            </table>
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
        subscription: null,
        invoices: null
      }
    },
    async mounted() {
      this.loading = true
      const response = await this.$store.dispatch('callApi', {
        method: 'get',
        url: '/api/subscription'
      });
      this.loading = false

      if (response.data.success) {
        this.subscription = response.data.subscription
        this.invoices = response.data.invoices
      }
    }
  })
</script>
