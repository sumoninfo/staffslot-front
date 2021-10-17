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
      <div class="register-form">
        <p style="padding-bottom: 12px; padding-top: 8px">
          {{ __("Register with an email address.") }}
        </p>
        <form>
          <div class="form-group">
            <label>{{ __("First name") }}</label>
            <input
                v-model="first_name"
                class="form-control"
                type="text"
                name="first_name"
            />
          </div>
          <div class="form-group">
            <label>{{ __("Last name") }}</label>
            <input
                v-model="last_name"
                class="form-control"
                type="text"
                name="last_name"
            />
          </div>
          <div class="form-group">
            <label>{{ __("Email") }}</label>
            <input
                v-model="email"
                class="form-control"
                type="text"
                name="email"
            />
          </div>

          <div class="form-group">
            <label class="form-control-label">{{
                __("Type of Account")
              }}</label>
            <br />
            <div class="radio radio-info form-check-inline ms-1">
              <input v-model="type" type="radio" id="inlineRadio1" value="1" name="type" />
              <label for="inlineRadio1" class="text-dark">{{ __("Staff Employee") }}</label>
            </div>
            <div class="radio radio-info form-check-inline">
              <input v-model="type" type="radio" id="inlineRadio2" value="2" name="type" />
              <label for="inlineRadio2" class="text-dark">{{ __("Sub-Pro") }}</label>
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
          </div>
          <div class="form-group">
            <button type="submit" class="btn btn-primary w-100">
              {{ __("Register") }}
            </button>
          </div>
        </form>
      </div>
    </div>
    <div class="col-md-2"></div>
  </div>
</template>

<script>
import helpers from "../../mixins/helpers";

export default {
  name: "Register",
  mixins: [helpers],
  components: {
  },
  data () {
    return {
      first_name: null,
      last_name: null,
      email: null,
      terms: null,
      type: null,
    }
  },

}
</script>

<style scoped>

</style>