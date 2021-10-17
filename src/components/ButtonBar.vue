<template>
  <div class="navbar-custom active">
    <div class="container-fluid">
      <ul class="dashboard-menu" v-if="isPro">
        <li>
          <router-link
            to="/dashboard"
            href="{{ route('dashboard.showDashboard') }}"
          >
            <i class="fa fa-dashboard"></i
            ><span class="d-md-block">{{ __("DASH") }}</span>
          </router-link>
        </li>

        <li>
          <router-link
            to="/slot/list"
            href="{{ route('slot.showSlotList') }}"
            ><i class="fa fa-calendar-check-o"></i
            ><span class="d-md-block">{{ __("SLOTS") }}</span></router-link
          >
        </li>
        <li v-if="user.has_video_slots">
          <router-link to="/video/slots" href="/video/slots" class="no-pjax"
            ><i class="fa fa-play-circle"></i
            ><span class="d-md-block">{{ __("VIDEOS") }}</span></router-link
          >
        </li>
        <li v-else>
          <router-link
            to="/event/list"
            href="{{ route('event.showEventList') }}"
          >
            <i class="fa fa-list-ul"></i
            ><span class="d-md-block">{{ __("EVENTS") }}</span>
          </router-link>
        </li>
        <li v-if="user.has_packages">
          <router-link
            to="/time-slots-package"
            href="{{ route('timeSlotsPackage.dashboard') }}"
            class="dropdown-item notify-item"
            ><i class="fa fa-ticket"></i
            ><span class="d-md-block">{{ __("PKGS") }}</span>
          </router-link>
        </li>
        <li>
          <router-link
            to="/calendar/private"
            href="{{ route('calendar.showPrivateCalendar') }}"
            ><i class="fa fa-calendar"></i
            ><span class="d-md-block">{{ __("CAL") }}</span></router-link
          >
        </li>
      </ul>
      <ul class="dashboard-menu" v-else>
        <li>
          <router-link
            :to="{ name: 'bookingList' }"
            ><i class="fa fa-list-ul"></i
            ><span class="d-md-block">{{ __("BOOKINGS") }}</span>
          </router-link>
        </li>
        <li>
          <router-link :to="{ name: 'packageOrders' }">
            <i class="fa fa-ticket"></i>
            <span class="d-md-block">{{ __('PKGS') }}</span>
          </router-link>
        </li>
        <li>
          <router-link
            :to="{ name: 'myVideoBookings' }"
            ><i class="fa fa-play-circle"></i
            ><span class="d-md-block">{{ __("VIDEOS") }}</span></router-link
          >
        </li>
        <li>
          <router-link
            :to="{ name: 'myPros' }"
            ><i class="fa fa-users"></i
            ><span class="d-md-block">{{ __("MY PROS") }}</span>
          </router-link>
        </li>
        <li>
          <router-link
            :to="{ name: 'searchPro' }"
            ><i class="fa fa-search"></i
            ><span class="d-md-block">{{ __("SEARCH") }}</span>
          </router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { mapState } from 'vuex';
import helpers from '../mixins/helpers.js'

export default defineComponent({
  name: "ButtonBar",
  mixins: [ helpers ],
  props: {
    languages: {
      type: Array
    }
  },
  computed: {
    ...mapState({
      viewMode: s => s.uiState.viewMode,
      isPro: s => s.uiState.viewMode === 'PRO',
      user: s => s.user
    })
  }
});
</script>
