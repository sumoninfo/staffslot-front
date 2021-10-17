<template>
  <div class="row">
    <div class="col-md-2"></div>
    <div class="col-md-8 text-left">
      <p>
          <a data-bs-toggle="collapse" href="#collapseExample" aria-expanded="false" aria-controls="collapseExample"><i class="fa fa-play-circle-o" aria-hidden="true"></i> {{ __('New to Staff Slot™ Click here.') }}</a> |
          <a href="https://www.timeslot.pro/support/" target="_blank" class="support-link">
              <i class="fa fa-support" aria-hidden="true"></i>
              <span class="button-text">Support</span>
          </a>
      </p>
      <div class="collapse" id="collapseExample">
        <p>{{ __('To get started, set your time zone. Next search for a pro and book a time slot or video slot.') }}</p>
        <div class="row">
          <div class="col-md-6 col-sm-12">
              <div class="plyr__video-embed" id="player" style="margin-bottom: 20px;">
                  <iframe src="https://www.youtube.com/embed/3Q0oD5UfPpg?origin=https://plyr.io&amp;iv_load_policy=3&amp;modestbranding=1&amp;playsinline=1&amp;showinfo=0&amp;rel=0&amp;enablejsapi=1" allowfullscreen allowtransparency allow="autoplay"></iframe>
              </div>
          </div>
          <div class="col-md-6 col-sm-12">
              <div class="plyr__video-embed" id="player" style="margin-bottom: 20px;">
                  <iframe src="https://www.youtube.com/embed/0-lkh4Pe3Xw?origin=https://plyr.io&amp;iv_load_policy=3&amp;modestbranding=1&amp;playsinline=1&amp;showinfo=0&amp;rel=0&amp;enablejsapi=1" allowfullscreen allowtransparency allow="autoplay"></iframe>
              </div>
          </div>
        </div>
          <p>{{ __('The goal of TSP is be the most convenient, easy and fastest way for you to book a pro, get booked and stay booked. We take pride in providing the best possible customer service. If you have any questions, please <a href="https://www.timeslot.pro/support/" target="_blank">contact us</a>') }}.</p>
      </div>
    </div>
    <div class="col-md-2"></div>
  </div>
  <div class="row">
    <div class="col-md-2"></div>
    <div class="col-md-8 text-left">
      <div class="timezone-box">
        <div class="row">
          <p class="ml-2">{{ __('Set your time zone to get started')}}.</p>
          <div class="col-8">
            <div class="form-group">
              <select v-model="account.timezone" class="form-control">
                <option value="">{{ __('Choose a time zone') }}...</option>
                <option
                  v-for="timezone,i in timezones"
                  :key="i"
                  :value="timezone.value"
                >{{ timezone.title }}</option>
              </select>
            </div>
          </div>
          <div class="col-4">
            <div class="form-group timezone-update-btn">
              <loading-button :loading="submitting" @click="submit" class="btn btn-timezone">{{ __('Update') }}</loading-button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="col-md-2"></div>
  </div>
  <div class="row">
    <div class="col-md-2"></div>
    <div class="col-md-8">
      <hr>
      <div class="profile-area mt-3 pb-2 pt-1">
        <h3>{{ __('Update your Profile') }}</h3>
      </div>
      <div class="card-box my-profile-box">
        <div class="form-group">
            <label>{{ __('First name') }}</label>
            <input class="form-control" type="text" v-model="account.first_name">
        </div>
        <div class="form-group">
            <label>{{ __('Last name') }}</label>
            <input class="form-control" type="text" v-model="account.last_name">
        </div>
        <div class="form-group">
            <label>{{ __('Business Name') }}</label>
            <input class="form-control" type="text" v-model="account.nickname">
        </div>
        <div class="form-group">
            <label>{{ __('Contact number for SMS Text Alerts') }}</label>
            <input class="form-control" type="text" v-model="account.contact_number">
        </div>
        <div class="form-group">
            <label>{{ __('Country') }}</label>
            <select class="form-control" v-model="account.country">
                <option
                  v-for="country,i in countries"
                  :key="i"
                  :value="country.id"
                  v-text="country.title">
                </option>
            </select>
        </div>
        <div class="form-group">
          <label>{{ __('City') }}</label>
          <input class="form-control" type="text" v-model="account.city">
        </div>
        <div class="form-group" v-if="country">
          <label v-text="stateProvince"></label>
          <select class="form-control" v-model="account.state">
            <option
              v-for="state,i in states"
              :key="i"
              :value="state.code"
              v-text="state.title">
            </option>
          </select>
        </div>
        <div class="form-group">
            <label>{{ __('Zip code') }}</label>
            <input class="form-control" type="text" v-model="account.zip_code">
        </div>
        <template v-if="role.search && isPro">
          <hr>
          <div class="form-group">
              <h3>{{ __('Searchable') }} Pro Profile?</h3>
              <div class="form-check form-switch">
                  <input type="checkbox" class="form-check-input" id="checkbox-s" v-model="account.searchable" true-value="1" false-value="0">
                  <label for="checkbox-s" class="form-check-label"></label>
              </div>
              <p class="mt-2">{{ __('When selected your profile is listed in the TSP public directory. This allows customers to search and find your time slots. If not selected, your profile will be private and you will need to share links to your time slot events and calendar directly to customers via text and email. The public directory listing feature is not available for Pro-Free accounts') }}.</p>
          </div>
        </template>
        <template v-if="role.sms">
          <hr>
          <div class="form-group">
              <h3>{{ __('Text Message New Booking Notifications') }}</h3>
              <div class="form-check form-switch">
                  <input type="checkbox" v-model="account.notify_on_booking" class="form-check-input" true-value="1" false-value="0">
                  <label class="form-check-label" for="is_private_checkbox"></label>
              </div>
          </div>
          <hr>
          <div class="form-group">
            <div class="row">
              <div class="col-sm-6">
                <h3>{{ isPro ? __('Alert About Slots') : __('Alert About Bookings') }}</h3>
              </div>
              <div class="col-sm-6">
                <DurationPicker v-if="isPro" v-model="account.alert_slot_before"/>
                <DurationPicker v-else v-model="account.alert_booking_before"/>
              </div>
            </div>
          </div>
          <div class="form-check form-switch">
            <input v-if="isPro" type="checkbox" v-model="account.alert_slot_enabled" class="form-check-input" true-value="1" false-value="0">
            <input v-else type="checkbox" v-model="account.alert_booking_enabled" class="form-check-input" true-value="1" false-value="0">
          </div>
          <div class="form-group">
            <div class="row">
              <div class="col-sm-6">
                <h3>{{ isPro ? __('Alert About End Of Ongoing Slots') : __('Alert About End Of Ongoing Bookings') }}</h3>
              </div>
              <div class="col-sm-6">
                <DurationPicker v-if="isPro" v-model="account.alert_slot_ending_before"/>
                <DurationPicker v-else v-model="account.alert_booking_ending_before"/>
              </div>
            </div>
            <div class="form-check form-switch">
              <input v-if="isPro" type="checkbox" v-model="account.alert_slot_ending_enabled" class="form-check-input" true-value="1" false-value="0">
              <input v-else type="checkbox" v-model="account.alert_booking_ending_enabled" class="form-check-input" true-value="1" false-value="0">
            </div>
          </div>
        </template>
        <template v-if="isPro">
          <hr>
          <div class="form-group">
            <h3>{{ __('Category (optional)') }}</h3>
            <select class="form-control selectpicker" title="{{ __('Choose a category') }}..." v-model="account.category_id" multiple>
              <option v-for="category,i in parentCategories" :key="i" :value="category.category_id">{{ category.title }}</option>
            </select>
          </div>
          <div class="form-group">
            <label>{{ __('Subcategory (optional)') }}</label>
            <select class="form-control selectpicker" title="{{ __('Choose a sub-category') }}..." v-model="account.subcategory_id" multiple>
              <option v-for="category,i in subCategories" :key="i" :value="category.category_id">{{ category.title }}</option>
            </select>
          </div>
        </template>
        <div class="form-group">
          <loading-button :loading="submitting" @click="submit" class="btn btn-primary">{{ __('Update') }}</loading-button>
        </div>
      </div>
      <hr>
      <div class="profile-area">
        <h3>{{ __('Profile photo') }}</h3>
        <p>{{ __('Add, change or delete your profile photo.') }}</p>
      </div>
      <br>
      <div class="col-12">
        <div style="display: none;" id="profile-photo-error" class="alert alert-danger"></div>
        <div style="display: none;" id="profile-photo-msg" class="alert alert-success"></div>
      </div>
      <template v-if="account.profile_photo">
        <img class="img-responsive profile-photo-img" src="" width="200">
        <div class="row">
          <div class="col-12">
            <a type="button" class="btn-edit-photo btn btn-primary" data-toggle="modal" data-target="#profile-photo-modal">Edit</a>
          </div>
        </div>
      </template>
      <template v-else>
        <img class="img-responsive profile-photo-img" src="" width="200">
      </template>
      <br>
      <br>
      <div class="form-group">
        <p>{{ __('Upload a profile photo') }}</p><input type="file" name="file" id="file">
      </div>
      <div class="form-group">
        <input class="btn btn-default" type="submit" v-model="account.submit">
      </div>
      <hr>
      <div class="profile-section">
        <h3>{{ __('Change password') }}</h3>
        <p>{{ __('Change your account password.') }}</p>
      </div>
      <br>
      <div class="form-group">
        <label>{{ __('Current password') }}</label>
        <input class="form-control" type="password" v-model="account.current_password">
      </div>
      <div class="form-group">
        <label>{{ __('New password') }}</label>
        <input class="form-control" type="password" v-model="account.new_password">
      </div>
      <div class="form-group">
        <label>{{ __('Confirm new password') }}</label>
        <input class="form-control" type="password" v-model="account.new_password_confirmation">
      </div>
      <div class="form-group">
        <button type="submit" class="btn btn-primary">{{ __('Change') }}</button>
      </div>
    </div>
    <div class="col-md-2"></div>
  </div>

<!--photo_modal-->
<div id="profile-photo-modal" class="modal" tabindex="-1" role="dialog">
  <div class="modal-dialog modal-lg" role="document">
    <div class="modal-content">
      <div class="modal-body">
        <div class="row">
          <div class="image-crop-container col-12">
            <img v-if="account.profile_photo" id="profile-photo-img" class="img-full profile-photo-img" src="">
            <p v-else>No profile photo uploaded</p>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button id="crop-rotate-left" type="button" class="btn btn-info"><i class="fa fa-rotate-left"></i></button>
        <button id="crop-rotate-right" type="button" class="btn btn-info"><i class="fa fa-rotate-right"></i></button>
        <button id="rest-crop" type="button" class="btn btn-default">Reset</button>
        <button id="save-photo" type="button" class="btn btn-success">Save</button>
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
      </div>
    </div>
  </div>
</div>

<!--/photo_modal-->

</template>

<script>
  import { defineComponent } from 'vue'
  import { mapState } from 'vuex';
  import helpers from '../mixins/helpers'
  import DurationPicker from '../components/Controls/DurationPicker.vue'

  export default defineComponent({
    mixins: [ helpers ],
    components: { DurationPicker },
    data() {
      return {
        loading: false,
        submitting: false,
        stateProvince: null,
        alertBefore: null,
        country: null,
        state: null,
        account: {},
        categories: [],
        parentCategories: [],
        subCategories: [],
        countries: [],
        states: [],
        allStates: [],
        timezones: [],
        account: {
          category_id: [],
          subcategory_id: [],
          // alert_slot_before: {},
          // alert_booking_before: {},
          // alert_slot_ending_before: {},
          // alert_booking_ending_before: {},
        },
        role: {
          sms: true,
          search: true
        }
      }
    },
    watch: {
      country (val) {
        const country = this.countries.find(c => c.id == val)
        const state = this.allStates.find(s => s.code === this.account.state)
        this.states = this.allStates.filter(s => s.country_id == this.country)
        this.state = state && state.code
        this.stateProvince = country && (country.code === 'CA') ? this.__('Province') : this.__('State')
      },
      'account.category_id' (val) {
        this.subCategories = []
        val.forEach(c => {
          const sc = this.categories.find(x => x.category_id === c);
          if (sc.sub_categories) {
            this.subCategories.push(...sc.sub_categories)
          }
        })
      }
    },
    computed: {
      ...mapState({
        viewMode: s => s.uiState.viewMode,
        isPro: s => s.uiState.viewMode === 'PRO',
        user: s => s.user
      })
    },
    mounted () {
      this.fetch();
    },
    methods: {
      async fetch() {
        const response = await this.$store.dispatch('callApi', {
          method: 'get',
          url: `/api/account/${this.user.user_id}`
        })

        if (response.data.success) {
          this.account = response.data.profile
          this.account.category_id = (this.account.categories || []).filter(c => !c.parent).map(c => c.category_id)
          this.account.subcategory_id = (this.account.categories || []).filter(c => c.parent).map(c => c.category_id)
          this.categories = response.data.categories
          this.parentCategories = this.categories.filter(c => c.parent === null)
          this.countries = response.data.countries
          this.allStates = response.data.states
          this.timezones = response.data.timezones
          const country = this.countries.find(c => c.id == response.data.profile.country_id )
          this.country = country && country.id
        }
      },
      async submit() {
        this.submitting = true
        this.transform()
        const response = await this.$store.dispatch('callApi', {
          method: 'post',
          url: `/api/account/update/${this.account.account_id}`,
          data: this.account
        });
        this.submitting = false

        if (response.data.success) {
          this.$store.commit('setFlashMessage', 'Successfully updated the account');
        }
      },
      transform() {
        this.account.alert_slot_before_days = this.account.alert_slot_before.days
        this.account.alert_slot_before_hours = this.account.alert_slot_before.hours
        this.account.alert_slot_before_minutes = this.account.alert_slot_before.minutes
        this.account.alert_booking_before_days = this.account.alert_booking_before.days
        this.account.alert_booking_before_hours = this.account.alert_booking_before.hours
        this.account.alert_booking_before_minutes = this.account.alert_booking_before.minutes
        this.account.alert_slot_ending_before_days = this.account.alert_slot_ending_before.days
        this.account.alert_slot_ending_before_hours = this.account.alert_slot_ending_before.hours
        this.account.alert_slot_ending_before_minutes = this.account.alert_slot_ending_before.minutes
        this.account.alert_booking_ending_before_days = this.account.alert_booking_ending_before.days
        this.account.alert_booking_ending_before_hours = this.account.alert_booking_ending_before.hours
        this.account.alert_booking_ending_before_minutes = this.account.alert_booking_ending_before.minutes
      }
    }
  })
</script>
