<template>
  <div class="row">
    <div class="col-md-2 hidden-sm"></div>
    <div class="col-md-8 col-sm-12">
      <p>
        <a
          data-bs-toggle="collapse"
          href="#calendarTutorial"
          aria-expanded="false"
          aria-controls="collapseExample"
        >
          <i class="fa fa-play-circle-o" aria-hidden="true"></i>
          {{__('Calendar Sync Tutorial')}}
        </a>
      </p>
      <div class="collapse" id="calendarTutorial">
        <p>{{__('Calendar Sync tutorial')}}</p>
      </div>
      <div class="card-box">
        <h2>{{__('Calendar Sync')}}</h2>
        <p class="mt-4">
          {{__(`
            Sync your Google calendar to have booked slots automatically added to
            your Google calendar. Microsoft, Exchange & Apple iCal calendar sync
            is coming soon!!
          `)}}
        </p>
        <p class="mt-4 font-bold">{{__('Click the button to set up calendar sync.')}}</p>
        <div class="d-flex align-items-center">
          <button
            @click="googleRegister()"
            class="
              btn btn-primary
              d-flex
              justify-content-center
              align-items-center
              add-btn
              m-r-15
            "
          >
            <i class="fa fa-plus"></i>
          </button>
          <img src="/assets/images/google.svg" class="google-logo m-r-5" />
          <h3 class="calendar-title">{{__('Calendar')}}</h3>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.card-box {
  padding-bottom: 150px;

  .add-btn {
    font-size: 30px;
  }

  .google-logo {
    width: 30px;
    height: 30px;
  }

  .calendar-title {
    margin: 2px 0 0;
    font-weight: bold;
  }
}
</style>

<script>
import axios from "axios";
const CALENDAR_API_URL = "https://timeslotpro.net";
const GOOGLE_REGISTRATIONURL = encodeURIComponent(
  "https://app.timeslot.pro/calendar-sync?type=google"
);
export default {
  async mounted() {
    const queryStr = window.location.search;
    const queryParameter = new URLSearchParams(queryStr);
    const registrationType = queryParameter.get("type");
    if (registrationType == "google" && queryParameter.has("code")) {
      const tokenResponse = await axios.get(
        `${CALENDAR_API_URL}/google/token?url=${GOOGLE_REGISTRATIONURL}&code=${queryParameter.get(
          "code"
        )}`
      );
    }
  },
  methods: {
    async googleRegister() {
      window.open(
        `${CALENDAR_API_URL}/google/register?url=${GOOGLE_REGISTRATIONURL}`
      );
    },
  },
};
</script>