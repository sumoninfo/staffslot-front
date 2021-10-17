<template>
  <div class="row">
    <div class="col-md-2"></div>
    <div class="col-md-8">
      <div class="page-title-area">
        <h2 class="section-title mb-4">{{ __('AFFILIATE PROGRAM') }}</h2>
        <p>{{ __('Earn money when your referrals sign-up with a monthly or annual Pro membership subscription.') }} <strong>{{ __('To start, copy &amp; share your referral link below. ') }}</strong></p>
        <div class="text-center justify-content-center">
          <p class="text-center mt-2 mb-2"><a data-bs-toggle="collapse" href="#collapseExample" aria-expanded="false" aria-controls="collapseExample">{{ __('Click to learn more &amp; view affiliate payouts') }}</a>.</p>
          <div class="collapse" id="collapseExample">
            <h6 class="text-center mt-4">{{_('About the TSP Affiliate Program')}}</h6>
            <div class="plyr__video-embed" id="player" style="margin-bottom: 20px;">
              <iframe src="https://www.youtube.com/embed/Ah1V6Fov4LQ?origin=https://plyr.io&amp;iv_load_policy=3&amp;modestbranding=1&amp;playsinline=1&amp;showinfo=0&amp;rel=0&amp;enablejsapi=1" allowfullscreen allowtransparency allow="autoplay"></iframe>
            </div>
            <p class="text-center">{{ __('Get paid as a Time Slot Pro affiliate when your referrals sign-up with an annual or monthly Pro membership subscription. Your referrals are tracked and reported on your Affiliate Dashboard below') }}.</p>
            <h6 class="text-center mt-4">{{__('Affiliate Payout Schedule')}} 2020</h6>
            <p class="text-center"><strong>{{__('Pro Starter')}} {{__('Annual')}}:</strong> {{__('earn')}} $36</p>
            <p class="text-center"><strong>{{__('Pro Starter')}} {{__('Month')}}:</strong> {{__('earn')}} $15</p>
            <hr>
            <p class="text-center"><strong>{{__('Pro Plus')}} {{__('Annual')}}:</strong> {{__('earn')}} $60</p>
            <p class="text-center"><strong>{{__('Pro Plus')}} {{__('Month')}}:</strong> {{__('earn')}} $25</p>
            <hr>
            <p class="text-center"><strong>{{__('Pro Business')}} {{__('Anual')}}:</strong> {{__('earn')}} $132</p>
            <p class="text-center"><strong>{{__('Pro Buseness')}} {{__('Month')}}:</strong> {{__('earn')}} $40</p>
          </div>
        </div>
      </div>
      <div class="page-title-area mt-0">
        <form action="" method="post">
          <div class="form-group row justify-content-center">
            <div class="col-8" v-if="error!=''">
              <div class="alert alert-danger" v-text="error"></div>
            </div>
            <div class="col-sm-8 mt-2">
              <input type="text" id="example-input1-group1" name="public_id" class="form-control" :value="referalUrl" readonly>
            </div>
            <div class="col-md-1 mt-2">
              <ClipboardButton :disabled="!disableSave" type="button" class="btn btn-info btn-clipboard" :clipboard-text="referalUrl">{{ __('Copy Referral Link') }}</ClipboardButton>
            </div>

            <div class="col-8 mt-4">

              <div class="input-group mb-3">
                <input type="text" maxlength="128" v-model="referral_id" class="form-control">
                <div class="input-group-append">
                  <button class="btn btn-success" type="button" :disabled="disableSave" v-on:click="onSave" v-text="saveButtonText"></button>
                </div>
              </div>
              <p>{{__('Customize your affilate code above')}}.</p>
            </div>
          </div>
        </form>
      </div>
      <br>
      <h3 class="referrals-table-title">{{ __('Your Referrals')}}</h3>
      <div v-if="!referrals" class="alert alert-primary alert-referrals">
        <p>{{ __("You don't have any referrals yet. Please share your link to get started.") }}</p>
      </div>
      <table v-else class="table referrals-table">
        <thead>
          <tr>
            <th scope="col">{{ __('Name') }}</th>
            <th scope="col">{{ __('Joined') }}</th>
            <th scope="col">{{ __('Subscription') }}</th>
            <th scope="col">{{ __('Current Reward') }}</th>
            <th scope="col">{{ __('Status') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="referral,i in referrals"
            :key="i"
          >
            <th scope="row">{{ referral.referred_user.account.first_name}} {{ referral.referred_user.account.last_name}}</th>
            <td>{{ referral.referred_user.formatted_created_at_date }}</td>
            <td>{{ referral.formattedSubscription }}</td>
            <td>{{ referral.formattedEarnings }}</td>
            <td>{{ referral.status }}</td>
          </tr>
        </tbody>
      </table>
  </div>
  <div class="col-md-2"></div>
  </div>
</template>

<script>
  import { defineComponent } from 'vue'
  import helpers from '../mixins/helpers'
  import ClipboardButton from '../components/Controls/ClipboardButton.vue'

  export default defineComponent({
    mixins: [ helpers ],
    components: {
      ClipboardButton
    },
    data() {
      return {
        referrals: null,
        loading: false,
      }
    },
    async mounted () {
      this.loading = true
      const response = await this.$store.dispatch('callApi', {
        method: 'get',
        url: '/api/referrals'
      });
      this.loading = false

      if (response.data.success) {
        this.referrals = response.data.referrals.filter(r => r.referred_user)
      }
    },
    methods: {

    }
  })
</script>
