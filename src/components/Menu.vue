<template>
  <ul class="list-inline float-end mb-0">
    <li class="list-inline-item dropdown notification-list list-email">
      <p>{{user.email }}</p>
    </li>
    <li class="list-inline-item dropdown notification-list">
      <notifications style="margin-right: -16px"></notifications>
    </li>
    <li class="list-inline-item dropdown notification-list">
      <a
        class="nav-link dropdown-toggle waves-effect waves-light nav-user"
        data-bs-toggle="dropdown"
        href="#"
        role="button"
        aria-haspopup="false"
        aria-expanded="false"
      >
        <img v-if="user.avatar"
             :src="`https://app.timeslot.pro/storage/uploads/${user.avatar}`"
             alt="user"
             class="rounded-circle"
        />
        <img v-else
             src="/images/default-profile-time-slot-pro.png"
             alt="user"
             class="rounded-circle"
        />
      </a>
      <div
        class="dropdown-menu dropdown-menu-right profile-dropdown"
        aria-labelledby="Preview"
      >
        <router-link v-if="user.admin"
          :to="{ name: 'adminRoot' }"
          class="dropdown-item notify-item"
        >
          <i class="fa fa-wrench"></i> <span>{{ __("Admin Tools") }}</span>
        </router-link>
        <router-link v-if="user.admin"
          :to="{ name: 'adminSubscribers' }"
          class="dropdown-item notify-item"
          ><i class="fa fa-vcard"></i>
          <span>{{ __("Pro Subscribers") }}</span>
        </router-link>
        <router-link v-if="user.admin"
          :to="{ name: 'adminSubscriptions' }"
          class="dropdown-item notify-item"
          ><i class="fa fa-cc-stripe"></i>
          <span>{{ __("Pro Subscriptions") }}</span>
        </router-link>
        <router-link v-if="user.admin"
          :to="{ name: 'adminReferrals' }"
          class="dropdown-item notify-item"
          ><i class="fa fa-money"></i> <span>{{ __("All Referrals") }}</span>
        </router-link>
        <router-link v-if="user.admin"
          :to="{ name: 'adminReferrers' }"
          class="dropdown-item notify-item"
          ><i class="fa fa-certificate"></i>
          <span>{{ __("All Active Affiliates") }}</span>
        </router-link>
        <router-link v-if="user.admin"
          :to="{ name: 'adminPayments' }"
          class="dropdown-item notify-item"
          ><i class="fa fa-cc"></i> <span>{{ __("CC Payments") }}</span>
        </router-link>
        <hr />
        <router-link v-if="isPro"
          :to="{ name: 'myManagers' }"
          class="dropdown-item notify-item"
        >
          <i class="fa fa-handshake-o"></i>
          <span>{{ __("My Managers") }}</span>
        </router-link>
        <router-link v-if="user.account.can_manage"
          :to="{ name: 'manageDashboard' }"
          class="dropdown-item notify-item"
        >
          <i class="md md-dashboard"></i>
          <span>{{ __("Manager Dashboard") }}</span>
        </router-link>
        <router-link v-if="user.account.can_manage"
          :to="{ name: 'managePros' }"
          class="dropdown-item notify-item"
        >
          <i class="md md-contacts"></i>
          <span>{{ __("Manage My Pros") }}</span>
        </router-link>
        <hr />
        <router-link
          v-if="isPro"
          :to="{ name: 'payment-history' }"
          class="dropdown-item notify-item"
        >
          <i class="fa fa-history"></i>
          <span>{{ __("Bookings History") }}</span>
        </router-link>
        <router-link v-if="isPro"
          href="{{ route('customers.showCustomers') }}"
          :to="{ name: 'customers' }"
          class="dropdown-item notify-item"
        >
          <i class="fa fa-vcard-o"></i>
          <span>{{ __("My Customers") }}</span>
        </router-link>
        <router-link
          v-if="isPro"
          :to="{ name: 'dashboard' }"
          class="dropdown-item notify-item"
        >
          <i class="fa fa-dashboard"></i>
          <span>{{ __("Pro Dashboard") }}</span>
        </router-link>

        <router-link
          v-if="isPro"
          :to="{ name: 'manageSubPros' }"
          class="dropdown-item notify-item"
        >
          <i class="fa fa-ticket"></i>
          <span>{{ __("Manage Sub-Pros") }}</span>
        </router-link>

        <router-link
            v-if="isPro"
            :to="{ name: 'manageStaff' }"
            class="dropdown-item notify-item"
        >
          <i class="fa fa-list-ul"></i>
          <span>{{ __("Manage Staff") }}</span>
        </router-link>

        <router-link v-if="isPro"
          :to="{ name: 'slotList' }"
          class="dropdown-item notify-item"
        >
          <i class="fa fa-calendar-check-o"></i>
          <span>{{ __("My Time Slots") }}</span>
        </router-link>
        <router-link v-if="isPro"
          :to="{ name: 'eventList' }"
          class="dropdown-item notify-item"
        >
          <i class="fa fa-list-ul"></i>
          <span>{{ __("Manage Events") }}</span>
        </router-link>
        <router-link v-if="isPro && user.has_packages"
          :to="{ name: 'packageDashboard' }"
          class="dropdown-item notify-item"
        >
          <i class="fa fa-ticket"></i> <span>{{ __('My Packages') }}</span>
        </router-link>
        <router-link
          v-if="isPro && user.has_video_slots"
          to="/video/slots"
          class="dropdown-item notify-item"
        >
          <i class="fa fa-play-circle"></i> <span>{{ __('My Video Slots') }}</span>
        </router-link>
        <router-link
          v-if="isPro && user.has_video_slots"
          to="/video/events"
          class="dropdown-item notify-item"
        >
          <i class="fa fa-list"></i> <span>{{ __('My Video Events') }}</span>
        </router-link>
        <router-link
          v-if="isPro && user.has_video_subscriptions"
          to="/video/subscriptions"
          class="dropdown-item notify-item"
        >
          <i class="fa fa-film"></i> <span>{{ __('Video Subscriptions') }}</span>
        </router-link>
        <router-link
          v-if="isPro && user.has_products"
          :to="{ name: 'products' }"
          class="dropdown-item notify-item"
        >
          <i class="fa fa-truck"></i>
          <span>{{ __('My Products') }}</span>
        </router-link>
        <router-link
          v-if="isPro"
          :to="{ name: 'inviteList' }"
          class="dropdown-item notify-item"
        >
          <i class="fa fa-group"></i>
          <span>{{ __("Manage Invite Lists") }}</span>
        </router-link>
        <router-link
          v-if="!isPro"
          :to="{ name: 'autoBook' }"
          class="dropdown-item notify-item"
        >
          <i class="fa fa-magic"></i> <span>{{ __("Auto-Book") }}</span>
        </router-link>
        <router-link
          v-if="isPro"
          :to="{ name: 'myAutoBooks' }"
          class="dropdown-item notify-item"
        >
          <i class="fa fa-magic"></i>
          <span>{{ __("Client Auto-Books") }}</span>
        </router-link>
        <router-link
          v-if="isPro"
          :to="{ name: 'embedCode' }"
          class="dropdown-item notify-item"
        >
          <i class="fa fa-external-link"></i>
          <span>{{ __("Embed Time Slot List") }}</span>
        </router-link>
        <router-link
          v-if="isPro"
          :to="{ name: 'request' }"
          class="dropdown-item notify-item"
        >
          <i class="fa fa-inbox"></i>
          <span>{{ __("Time Slot Requests") }}</span>
        </router-link>
        <a
          v-if="isPro && user.availability_manager"
          href="{{ route('availableManager.index') }}"
          class="dropdown-item notify-item"
        >
          <i class="fa fa-power-off"></i>
          <span>{{ __("Availability Manager") }}</span>
        </a>
        <router-link
          v-if="isPro"
          :to="{ name: 'customEmail' }"
          class="dropdown-item notify-item"
        >
          <i class="fa fa-send-o"></i>
          <span>{{ __("Invite Customers") }}</span>
        </router-link>
        <router-link
          v-if="isPro"
          :to="{ name: 'locationList' }"
          class="dropdown-item notify-item"
        >
          <i class="fa fa-map-marker"></i> <span>{{ __('My Locations') }}</span>
        </router-link>

        <router-link
          v-if="isPro"
          :to="{ name: 'paymentSettings' }"
          class="dropdown-item notify-item"
        >
          <i class="fa fa-credit-card"></i>
          <span>{{ __("Payment Settings") }}</span>
        </router-link>
        <router-link
          v-if="isPro"
          :to="{ name: 'subscription'}"
          class="dropdown-item notify-item"
        >
          <i class="fa fa-ticket"></i>
          <span>{{ __("Subscription") }}</span>
        </router-link>
        <router-link v-else
          :to="{ name: 'choosePlan' }"
          class="dropdown-item notify-item"
        >
          <i class="fa fa-handshake-o"></i>
          <span>{{ __("Upgrade to Pro") }}</span>
        </router-link>
        <router-link
          :to="{ name: 'calendarSync' }"
          class="dropdown-item notify-item"
        >
          <i class="fa fa-google"></i>
          <span>{{ __('Calendar Sync') }}</span>
        </router-link>
        <router-link
          :to="{ name: 'account'}"
          class="dropdown-item notify-item"
        >
          <i class="fa fa-user-o"></i>
          <span>{{ __("My Account") }}</span>
        </router-link>
        <router-link
          v-if="isPro"
          :to="{ name: 'accountSettings'}"
          class="dropdown-item notify-item"
        >
          <i class="fa fa-cogs"></i>
          <span>{{ __("My Account Settings") }}</span>
        </router-link>
        <router-link v-if="isPro"
                     :to="{ name: 'employeeProfileDetails' }"
                     class="dropdown-item notify-item"
        ><i class="fa fa-user"></i> <span>{{ __("Employee Profile Details") }}</span>
        </router-link>
        <router-link
          v-if="!isPro"
          :to="{ name: 'myPurchases' }"
          class="dropdown-item notify-item"
        >
          <i class="fa fa-shopping-bag"></i>
          <span>{{ __('My Purchases') }}</span>
        </router-link>
        <router-link
          v-if="isPro"
          href="{{ route('info.showProFaq') }}"
          :to="{ name: 'proFaq' }"
          class="dropdown-item notify-item"
        >
          <i class="fa fa-question"></i> <span>{{ __("FAQ's") }}</span>
        </router-link>
        <router-link v-else
          href="{{ route('info.showCustomerFaq') }}"
          :to="{ name: 'customerFaq' }"
          class="dropdown-item notify-item"
        >
          <i class="fa fa-question"></i> <span>{{ __("FAQ's") }}</span>
        </router-link>
        <div class="dropdown-submenu">
          <button @click.stop.prevent="toggleLangMenu" class="like-link dropdown-item dropdown-toggle notify-item">
            <i class="fa fa-language"></i>
            <span>{{ __("Select Language") }} </span>
          </button>
          <div v-if="langMenuVisible" class="dropdown-menu border-0 w-100 ps-5 show">
            <button @click="onLang(language.code)" v-for="language in languages"
               :key="language.code"
               class="dropdown-item like-link"
            >
              {{ language.name }}
            </button>
          </div>
        </div>
        <button v-if="isPro"
          @click="toggleViewMode"
          class="dropdown-item notify-item like-link"
        >
          <i class="fa fa-exchange"></i>
          <span>{{ __("Go to Customer Mode") }}</span>
        </button>
        <button v-else
          @click="toggleViewMode"
          class="dropdown-item notify-item like-link"
        >
          <i class="fa fa-exchange"></i>
          <span>{{ __("Go to Pro Mode") }}</span>
        </button>

        <button
          @click.prevent="logout"
          class="dropdown-item notify-item like-link"
        >
          <i class="fa fa-sign-out"></i>
          <span>{{
              // session("impersonate") ? __("Exit Impersonate") : __("Logout")
              __("Logout")
            }}</span>
        </button>
        <router-link
          :to="{ name: 'tutorialVideos' }"
          class="dropdown-item notify-item tutorial-btn"
        >
          <i class="fa fa-play"></i>
          <span>{{ __("Tutorial Videos") }}</span>
        </router-link>
        <a
          href="https://www.timeslot.pro/support/"
          target="_blank"
          class="dropdown-item notify-item support-btn"
        >
          <i class="fa fa-support"></i>
          <span>{{ __("Contact Support") }}</span>
        </a>
        <!-- <router-link
          :to="{ name: 'referrals' }"
          class="dropdown-item notify-item aff-btn"
        >
          <i class="fa fa-handshake-o"></i>
          <span>{{ __("Affiliate Referrals") }}</span>
        </router-link> -->
      </div>
    </li>
  </ul>
</template>

<script>
import { defineComponent } from "vue";
import { mapState, mapActions } from 'vuex';
import helpers from '../mixins/helpers.js'
import { clearToken } from '../lib/auth'

export default defineComponent({
  name: "Menu",
  mixins: [ helpers ],
  inject: ['initialFetch'],
  props: {
    languages: {
      type: Array
    }
  },
  data() {
    return {
      langMenuVisible: false
    }
  },
  computed: {
    ...mapState({
      viewMode: s => s.uiState.viewMode,
      isPro: s => s.uiState.viewMode === 'PRO',
      user: s => s.user
    })
  },
  methods: {
    ...mapActions({ setViewMode: 'uiState/setViewMode' }),
    toggleLangMenu() {
      this.langMenuVisible = !this.langMenuVisible
    },
    onLang(lang) {
      this.setLang(lang)
      this.toggleLangMenu()
    },
    toggleViewMode() {
      this.setViewMode(this.isPro ? 'CUSTOMER' : 'PRO')
      this.$router.push({ name: this.isPro ? 'dashboard' : 'bookingList'})
      this.initialFetch()
    },
    logout () {
      clearToken()
      this.$router.push({ name: 'login' })
    }
  }
});
</script>
