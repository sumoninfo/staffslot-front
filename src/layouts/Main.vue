<template>
  <div class="page-top hide"></div>
  <div id="impersonate-banner" v-if="impersonate">
    {{ __('You are in impersonate mode for') }} {{ impersonateEmail }}
    <a href="" class="btn btn-success">{{ __('Exit') }}</a>
  </div>
  <Navbar />
  <FlashMessage />
  <ErrorMessage />
  <ButtonBar v-if="user" />
  <div class="wrapper" v-cloak id="wrapper">
    <div class="container-fluid main-container" id="main-container">
      <slot/>
    </div>
  </div>
  <div v-if="loading" class="ajaxLoading p-0" v-cloak>
    <Preloader />
  </div>
  <footer class="footer">
    <div class="container">
      <div class="row">
        <div class="col-12 text-center">
            © {{ __('2021 StaffSlot') }} | {{ __('All Rights Reserved') }} <br class="visible-xs"> <a
              href="https://www.staffslot.com" target="_blank">{{ __('Staff Slot Pro') }}</a> | <a
              href="https://www.staffslot.com/support" target="_blank"
              rel="nofollow">{{ __('Support') }}</a> | <a href="https://www.staffslot.com/terms"
                target="_blank"
                rel="nofollow">{{ __('Terms') }}</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import ButtonBar from '../components/ButtonBar.vue'
import ErrorMessage from '../components/ErrorMessage.vue'
import FlashMessage from '../components/FlashMessage.vue'
import Navbar from '../components/Navbar.vue'
import Preloader from '../components/Preloader.vue'
import helpers from '../mixins/helpers.js'

export default defineComponent({
  name: "Layout",
  components: { Navbar, ButtonBar, FlashMessage, ErrorMessage, Preloader },
  mixins: [ helpers ],
  data() {
    return {
      impersonate: false,
      impersonateEmail: "email@example.com",
    };
  },
  computed: {
    loading (): boolean {
      return this.$store.state.loading;
    },
    user (): object {
      return this.$store.state.user
    }
  }
});
</script>
