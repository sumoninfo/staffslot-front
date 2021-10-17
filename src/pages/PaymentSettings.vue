<template>
  <div class="row">
    <div class="col-md-2 hidden-sm"></div>
    <div class="col-md-8 col-sm-12">
      <p>
        <a
          data-bs-toggle="collapse"
          href="#collapseExample"
          aria-expanded="false"
          aria-controls="collapseExample"
          ><i class="fa fa-play-circle-o" aria-hidden="true"></i>
          {{ __("Payments Tutorial") }}</a
        >
        |
        <a
          href="https://www.timeslot.pro/support/"
          target="_blank"
          class="support-link"
          ><i class="fa fa-support" aria-hidden="true"></i>
          <span class="button-text">{{ __('Support') }}</span></a
        >
      </p>
      <div class="collapse" id="collapseExample">
        <p>
          {{ __("Accept online payments and get paid directly to your bank account or debit card") }}.
          {{ __("Pro Starter, Pro Plus and Pro Business users only pay Stripe's processing fee which is 2.75% + $0.30 on each transaction. StaffSlot™ does not include any additional features for this feature. It is part of our goal to provide the most convenient, efficient and fastest way to get booked")}}.
        </p>
        <p>
          {{ __('Get started by setting up your account for credit card payments via Stripe. Stripe is an industry leader for online payment processing.') }}
        </p>
      </div>
      <div v-if="!is_stripe_connected" class="card-box text-center">
        <h4>{{ __("Connect to Stripe Payments") }}</h4>
        <p>Click the button below to connect your Stripe payment processing account and take credit card payments online.</p>
        <a
          href="https://connect.stripe.com/oauth/authorize?response_type=code&client_id={{client_id}}&redirect_uri={{redirect_uri}}&scope=read_write"
          class="btn btn-success connect-button"
          ><span>{{ __("Connect with Stripe") }}</span></a
        >
      </div>
    </div>
    <div class="col-md-2 hidden-sm"></div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import helpers from "../mixins/helpers";

export default defineComponent({
  name: "PaymentSettings",
  mixins: [helpers],
  data() {
    return {
      is_stripe_connected: false,
      interval_selected: "manual",
      week_anchors: [],
      month_anchors: [],
      dashboard_link: "",
      client_id: "",
      redirect_url: "",
    };
  },
});
</script>
