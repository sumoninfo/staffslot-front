<template>
  <div class="row">
    <div class="col-md-2"></div>
    <div class="col-md-8">
      <div class="logo-section">
        <img
          src="/images/staffslot-logo-860w-orange.svg"
          class="img-fluid login-logo"
          alt="Responsive image"
        />
      </div>
      <h5 style="padding-top: 12px" class="register-intro-title">
        {{ __("Customer &amp; Pro Registration") }}
      </h5>
      <div class="register-section">
        <p style="padding-bottom: 12px; padding-top: 6px">
          {{ __("Use Google, FB or email account") }}.
        </p>
        <div class="login-buttons">
          <a
            class="btn google-btn btn-xs"
            href="{{ route('oauth.getGoogleRedirect') }}"
            ><i class="fa fa-google login-icon google-icon"></i>{{ __("Register") }}</a
          >
          <a
            class="btn facebook-btn btn-xs"
            href="{{ route('oauth.getFacebookRedirect') }}"
            ><i class="fa fa-facebook login-icon facebook-icon"></i
            >{{ __("Register") }}</a
          >
        </div>
      </div>
      <div class="register-form">
        <p style="padding-bottom: 12px; padding-top: 8px">
          {{ __("Register with an email address.") }}
        </p>
        <form @submit.prevent="onSubmit">
          <div class="form-group">
            <label>{{ __("First name") }}</label>
            <input
              v-model="first_name"
              class="form-control"
              type="text"
              name="first_name"
            />
            <validate-notice :items="errors.first_name"/>
          </div>
          <div class="form-group">
            <label>{{ __("Last name") }}</label>
            <input
              v-model="last_name"
              class="form-control"
              type="text"
              name="last_name"
            />
            <validate-notice :items="errors.last_name"/>
          </div>
          <div class="form-group">
            <label>{{ __("Email") }}</label>
            <input
              v-model="email"
              class="form-control"
              type="text"
              name="email"
            />
            <validate-notice :items="errors.email"/>
          </div>
          <div class="form-group">
            <label>{{ __("Password") }}</label>
            <input
              v-model="password"
              class="form-control"
              type="password" 
              name="password"
            />
            <validate-notice :items="errors.password"/>
            <small>{{
              __("At least 8 characters long, including at least 1 number.")
            }}</small>
          </div>
          <div class="form-group">
            <label>{{ __("Confirm Password") }}</label>
            <input
              v-model="password_confirmation"
              class="form-control"
              type="password"
              name="password_confirmation"
            />
          </div>

          <div class="form-group">
            <label class="form-control-label">{{
              __("Type of Account")
            }}</label>
            <br />
            <div class="radio radio-info form-check-inline ms-1">
              <input v-model="type" type="radio" id="inlineRadio1" value="1" name="type" />
              <label for="inlineRadio1">{{ __("Customer") }}</label>
            </div>
            <div class="radio radio-info form-check-inline">
              <input v-model="type" type="radio" id="inlineRadio2" value="2" name="type" />
              <label for="inlineRadio2">{{ __("Pro") }}</label>
            </div>
            <validate-notice :items="errors.type"/>
          </div>
          <hr />
          <div class="form-group">
            <a
              @click="referal_box = true"
              class="form-control-label"
              data-bs-toggle="collapse"
              role="button"
              aria-expanded="false"
              aria-controls="referral-input-box"
            >
              {{ __("Referral Code ?") }}
            </a>

            <div v-show="referal_box" id="referral-input-box">
              <input
                type="text"
                name="referral_code"
                class="form-control col-6"
                :v-model="referal"
              />
              <validate-notice :items="errors.referal"/>
            </div>
          </div>
          <hr />
          <div class="form-group">
            <div class="checkbox checkbox-info form-check-inline ps-0">
              <input
                v-model="terms"
                type="checkbox"
                id="inlineCheckbox3"
                name="terms"
              />
              <label for="inlineCheckbox3"
                >{{ __("I agree") }}.
                <a
                  href="#"
                  data-bs-toggle="modal"
                  data-bs-target="#myProClientModal"
                  >{{ __("Terms &amp; Conditions") }}</a
                >
                ({{ __("Pro &amp; Client") }})</label
              >
            </div>
            <validate-notice :items="errors.terms"/>
          </div>
          <div class="form-group">
            <button type="submit" class="btn btn-primary btn-block">
              {{ __("Register") }}
            </button>
          </div>
        </form>
      </div>
    </div>
    <div class="col-md-2"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { setToken, clearToken } from '../../lib/auth.js'
import helpers from "../../mixins/helpers.js";
import axios from 'axios';
import ValidateNotice from './ValidateNotice.vue';

export default defineComponent({
  name: "Register",
  mixins: [helpers],
  inject: ['initialFetch'],
  data () {
    return {
      first_name: null,
      last_name: null,
      email: null,
      password: null,
      password_confirmation: null,
      terms: null,
      type: null,
      referal_box: false,
      referal: null,
      errors: {},
    }
  },
  components: {
    ValidateNotice,
  },
  beforeCreate() {
    this.$store.dispatch('clearUser')
  },
  computed: {
    user () {
      return this.$store.state.user
    },
  },
  methods: {
    async onSubmit () {
      const response = await axios.post('/api/auth/register', {
        first_name: this.first_name,
        last_name: this.last_name,
        email: this.email, 
        password: this.password,
        password_confirmation: this.password_confirmation,
        terms: this.terms,
        type: this.type,
        referal: this.referal,
      });
      if (response.data.token) {
        setToken(response.data.token);
        this.$store.dispatch('uiState/setViewMode', null)
        await this.$store.dispatch('fetchUser');
        this.initialFetch();
        this.$router.push({ name: this.user.account.pro ? 'dashboard' : 'bookingList'});
      } else {
        if(response.data.message == "Invalid input"){
          this.errors = response.data.errors;
        }

        clearToken();
      }
    }
  }
});
</script>
