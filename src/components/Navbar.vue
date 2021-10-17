<template>
  <header id="topnav">
    <div class="topbar-main">
      <div class="container-fluid">
        <div class="back-button">
          <a href="javascript:" onclick="window.history.back()"></a>
          <i class="fa fa-arrow-left"></i>
        </div>
        <div class="logo">
          <a href="/" class="logo" v-if="view == 'pro'">
            <span v-html="title || 'StaffSlot'"></span>
            <img
              src="/assets/images/logo_dark.png"
              alt=""
              height="20"
              class="logo-lg"
            />
            <img
              src="/assets/images/logo_sm.png"
              alt=""
              height="24"
              class="logo-sm"
            />
          </a>
          <a href="/" class="logo" v-else>
            <span v-html="title || 'StaffSlot'"></span>
            <img
              src="/assets/images/logo_dark.png"
              alt=""
              height="20"
              class="logo-lg"
            />
            <img
              src="/assets/images/logo_sm.png"
              alt=""
              height="24"
              class="logo-sm"
            />
          </a>
        </div>
        <!-- End Logo container-->
        <div class="menu-extras topbar-custom">
          <Menu v-if="user" :languages="languages" />
          <MenuGuest v-else :languages="languages" />
        <!-- @if(session('user_id')) -->

        <!-- menu logged in -->
        <!-- end menu-extras -->
        <!-- @else -->
        <!-- menu logged out -->
        <!-- end menu-extras -->
        <!-- @endif -->
        </div>
        <div class="clearfix"></div>
      </div>
      <!-- end container -->
    </div>
    <!-- end topbar-main -->
    <upload-bar style="padding: 7px 0 0 0"></upload-bar>
  </header>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Menu from './Menu.vue'
import MenuGuest from './MenuGuest.vue'
import helpers from '../mixins/helpers'

export default defineComponent({
  mixins: [helpers],
  name: "Navbar",
  components: { MenuGuest, Menu },
  props: {
    view: {
      type: String
    },
    title: {
      type: String
    }
  },
  data () {
    return {
      languages: [
        { code: 'en', name: 'English' },
        { code: 'es', name: 'Español' }
      ]
    }
  },
  computed: {
    user () {
      return this.$store.state.user
    }
  }
});
</script>
