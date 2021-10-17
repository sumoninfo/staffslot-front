<template>
  <div class="row">
    <div class="col-md-2"></div>
    <div class="col-md-8">
      <div class="logo-section login-page">
        <img
          src="/images/staffslot-logo-860w-orange.svg"
          class="img-fluid login-logo"
          alt="Responsive image"
        />
      </div>
      <p style="padding-bottom: 12px; padding-top: 12px; text-align: center">
        {{ __("Login below or") }}
        <router-link :to="{name: 'register'}">{{ __("register") }}</router-link>.
      </p>
      <div class="login-section">
        <div class="login-buttons">
          <a
            class="btn google-btn btn-xs"
            href="/login"
            ><i class="fa fa-google login-icon google-icon"></i
            >{{ __("Login") }}</a
          >
          <a
            class="btn facebook-btn btn-xs"
            href="{{ route('oauth.getFacebookRedirect') }}"
            ><i class="fa fa-facebook login-icon facebook-icon"></i
            >{{ __("Login") }}</a
          >
        </div>
      </div>
      <div class="login-form">
          <validate-notice 
            :items="errors"
            styleUl="list-style-type: none; padding-left: 0px;"
          />
        <form @submit.prevent="onSubmit">
          <div class="form-group">
            <label>{{ __("Email Login") }}</label>
            <input
              v-model="email"
              class="form-control"
              type="text"
              name="email"
            />
          </div>
          <div class="form-group">
            <label>{{ __("Password") }}</label>
            <input
              v-model="password"
              class="form-control"
              type="password"
              name="password"
            />
            <small>{{
              __("At least 8 characters long, including at least 1 number.")
            }}</small>
          </div>
          <div class="form-group">
            <loading-button :loading="submitting" type="submit" class="btn btn-success">
              <template #icon>
                <i class="fa fa-lock login-icon"></i>
              </template>
              {{ __("Login") }}
            </loading-button>
            <a href="/forgot-password" class="m-l-10">{{
              __("Forgot password?")
            }}</a>
          </div>
        </form>
      </div>
    </div>
    <div class="col-md-2 col-sm-12"></div>
  </div>
</template>

<script>
  import { defineComponent } from 'vue'
  import { mapState } from 'vuex'
  import { setToken, clearToken } from '../../lib/auth.js'
  import helpers from '../../mixins/helpers.js'
  import axios from 'axios'
  import ValidateNotice from './ValidateNotice.vue';

  export default defineComponent({
    name: 'Register',
    mixins: [ helpers ],
    props: ['message'],
    inject: ['initialFetch'],

    data () {
      return {
        email: null,
        password: null,
        errors: [],
        submitting: false
      }
    },
    beforeCreate() {
      this.$store.dispatch('clearUser')
    },
    created() {
      if (this.$store.state.loginMessage) {
        this.errors.push(this.$store.state.loginMessage)
      }
    },
    components: {
      ValidateNotice,
    },
    computed: {
      ...mapState({
        redirectAfterLogin: s => s.uiState.redirectAfterLogin
      }),
      user () {
        return this.$store.state.user
      }
    },
    watch: {
      user() {
        this.redirect()
      }
    },
    methods: {
      async onSubmit () {
        this.submitting = true
        const response = await axios.post('/api/auth/login', {
          email: this.email, password: this.password
        });
        this.errors = [];
        if (response.data.token) {
          setToken(response.data.token);
          await this.$store.dispatch('fetchUser')
          this.initialFetch()
        } else {
          this.errors.push(response.data.message);
          clearToken();
        }
        this.submitting = false
      },
      redirect() {
        const to = this.redirectAfterLogin || { name: 'root' }
        this.$store.dispatch('uiState/set', { redirectAfterLogin: null })
        this.$router.push(to)
      }
    },
    unmounted() {
      this.errors = []
    }
  });
</script>
