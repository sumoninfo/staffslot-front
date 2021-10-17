<template>
<div id="tsApp" class="row justify-content-center embed-section">
  <div class="col-md-8">
    <p><a data-bs-toggle="collapse" href="#collapseExample" aria-expanded="false" aria-controls="collapseExample"><i class="fa fa-play-circle-o" aria-hidden="true"></i> {{ __('Embed Feature Tutorial') }}</a> | <a href="https://www.timeslot.pro/support/" target="_blank" class="support-link"><i class="fa fa-support" aria-hidden="true"></i> <span class="button-text">{{__('Support')}}</span></a></p>
    <div class="collapse" id="collapseExample">
      <p>{{ __('Embed your time slot list on your website or facebook page. Watch the how-to video below') }}.</p>
      <p>{{__('Display your time slot list on any website with the embed code')}}.<br>
        1. {{__('Click the "Copy Code" button')}}<br>
        2. {{__('Paste the code into a webpage')}} &amp; {{__('save')}}<br>
        3. {{__('Done')}}! <em>{{__('Users can view')}} &amp; {{__('click your slot list')}}</em>
      </p>
    </div>
  </div>
  <div class="col-md-8">
    <div class="card">
        <div class="col-12 mt-2">
            <div class="row h6">
                <div>{{__('Embed calendar')}}</div>
            </div>
        </div>
        <hr>
        <div class="col-12">
            <pre class="p-2">&lt;iframe
src="{{calendarLink}}"
width="100%"
height="600px"
frameborder="0"
scrolling="yes"&gt;
&lt;/iframe&gt; </pre>
        </div>
        <div class="col-12 text-center">
            <button id="btn-copy-code" class="btn btn-dark" @click="copyCalendarLink"><span v-text="copyCalendarButtonText"></span> <i class="fa fa-clipboard"></i></button>
        </div>
    </div>
  </div>
  <div class="col-md-8">
    <div class="card">
      <div class="col-12 mt-2">
        <div class="row h6">
          <div class="col-4">{{__('Default Event Filter')}}:</div>
          <div class="col-8">
              <multiselect
                  v-model="selectedEvents"
                  :options="events"
                  :multiple="true"
                  :placeholder="__('Choose an Event') + '...'"
                  track-by="title"
                  :custom-label="x => x.title"
              >
              </multiselect>
            </div>
          </div>
        </div>
        <hr>
        <div class="col-12">
          <pre class="p-2" id="codeToCopy">&lt;iframe
  src="@{{src}}"
  width="100%"
  height="600px"
  frameborder="0"
  scrolling="yes"&gt;
&lt;/iframe&gt;</pre>
        </div>
        <div class="col-12 text-center">
          <button id="btn-copy-code" class="btn btn-dark" @click="copyLink"><span v-text="copyButtonText"></span> <i class="fa fa-clipboard"></i></button>
        </div>
    </div>
  </div>
  <div class="col-md-8">
    <div class="card">
      <div class="card-header">
        <h4>{{__('Preview')}}</h4>
      </div>
      <div class="card-body">
        <div class="col-12" v-html='embedCode'></div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
  import { defineComponent } from 'vue'
  import helpers from '../mixins/helpers'

  export default defineComponent({
    mixins: [ helpers ],
    data() {
      return {
        events: [],
        selectedEvents: [],
        copyButtonText:"Copy Code",
        copyCalendarButtonText:"Copy Code",
        eventTitle:'',
      }
    },
    computed:{
        user () {
          return this.$store.state.user
        },
        slotLink() {
          return base_url().replace(/\/$/, '') + this.$router.resolve({ name: 'userProducts', params: { publicId: this.user.account.public_id }}).href
        },
        calendarLink() {
          return base_url().replace(/\/$/, '') + this.$router.resolve({ name: 'publicCalendar', params: { publicId: this.user.account.public_id }}).href
        },
        src(){
            let params = {
                events: this.selectedEvents.filter(x => x.type === 'event').map(x => x.id),
                video_events: this.selectedEvents.filter(x => x.type === 'video_event').map(x => x.id),
                video_subscriptions: this.selectedEvents.filter(x => x.type === 'video_subscription').map(x => x.id),
                packages: this.selectedEvents.filter(x => x.type === 'package').map(x => x.id)
            }
            return this.slotLink + '?' + Object.keys(params).map(x => params[x].length ? x + '=' + params[x] : null).filter(x => x).join('&');
        },
        embedCode(){
            return '<iframe src="'+this.src+'" width="100%" height="600px" frameborder="0" scrolling="yes"> </iframe>';
        },
        embedCalendarCode(){
            return '<iframe src="{{$calendarLink}}" width="100%" height="600px" frameborder="0" scrolling="yes"> </iframe>';
        }
    },
    async mounted() {
      const response = await this.$store.dispatch('callApi', {
        method: 'get',
        url: '/api/embed-code'
      });

      if (response.data.success) {
        this.events = response.data.events
      }
    },
    methods:{
        copyLink:function copyLink(){
            window.copyToClipboard(this.embedCode);
      this.copyButtonText='Code Copied';
      setTimeout(this.resetCopyButton,1000);
      return false;
        },
        copyCalendarLink:function copyLink(){
            window.copyToClipboard(this.embedCalendarCode);
            this.copyCalendarButtonText='Code Copied';
            setTimeout(() => this.copyCalendarButtonText = 'Copy Code',1000);
            return false;
        },
        resetCopyButton:function(){
            this.copyButtonText = "Copy Code";
        },
    }
  })
</script>
