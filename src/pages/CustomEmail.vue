<template>
<div class="container">
  <p><a data-bs-toggle="collapse" href="#collapseExample" aria-expanded="false" aria-controls="collapseExample"><i class="fa fa-play-circle-o" aria-hidden="true"></i> {{ __('Invite Tutorial') }}</a> | <a href="https://www.timeslot.pro/support/" target="_blank" class="support-link"><i class="fa fa-support" aria-hidden="true"></i> <span class="button-text">{{__('Support')}}</span></a></p>
  <div class="collapse" id="collapseExample">
    <p>{{ __('Enter your potential customers email address or addresses. We will send them an invite with your message a link directly to your pro calendar') }}.</p>
    <p>{{__('Paste in more than one email using a comma separator')}}.</p>
  </div>
  <div class="card col-12">
    <form @submit.prevent="onSubmit" class="form-horizontal" method="POST">
      <h3 class="text-center">{{__('Invite Customers to')}} Staff Slot!</h3>
      <div class="row form-group">
        <label class="control-label col-sm-2" for="emails">{{__('Invite')}} Emails:</label>
        <div class="col-sm-10">
          <input class="form-control tagsInput" type="text" autocomplete="false" :placeholder="__('Add one or multiple emails')"  data-role="tagsinput" name="emails" id="emails" size="50">
        </div>
      </div>
      <div class="row form-group">
        <label class="control-label col-sm-2" for="message">{{__('Message')}}:</label>
        <div class="col-sm-10">
          <textarea class="form-control summernote" name="message" id="message" :placeholder="__('Enter message')">
            <p>{{__('Hello')}}.<br /> 
              {{__(`
                I would like to invite you to view and book my available 
                time slots online at TimeSlot.Pro. This free web app can 
                be used on any web browser
              `)}}.
            </p>
          </textarea>
        </div>
      </div>
      <div class="row form-group">
        <div class="col text-center">
          <LoadingButton
            :loading="loading"
            class="btn btn-success"
            type="submit"
          >
            {{__('Send')}}
          </LoadingButton>
          <button class="btn" type="reset">{{__('Reset')}}</button>
        </div>
      </div>
    </form>
  </div>
</div>
</template>

<script>
  import { defineComponent } from 'vue'
  import helpers from '../mixins/helpers'
  import LoadingButton from '../components/Controls/LoadingButton.vue'

  export default defineComponent({
    mixins: [ helpers ],
    components: { LoadingButton },

    data() {
      return {
        loading: false
      }
    },

    methods: {
      async onSubmit() {
        if (this.loading) { return }

        this.loading = true
        const response = await this.$store.dispatch('callApi', {
          method: 'post',
          url: '/api/custom-email/send'
        });
        this.loading = false

        if (response.data.success) {
          this.$store.commit('setFlashMessage', this.__('Invitation email was successfully sent'))
        }
      }
    }
  })
</script>
