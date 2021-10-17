<template>
  <div class="row">
    <div class="col-sm-2"></div>
    <div class="col-sm-8">
      <div class="card-box">
        <div class="row">
          <div class="col-sm-12">
            <div class="row">
              <div class="col-12 text-center">
                <h3 class="font-600">{{ __('Watch Videos') }}</h3>
                <p>{{ __('Enjoy some free tips from our Pros and learn more about Time Slot Pro') }}.</p>
                <div class="subcription-buttons mb-2">
                  <a class="btn btn-default waves-effect waves-light mb-2" href="https://www.timeslot.pro/wp-content/uploads/2019/06/Time-Slot-Pro-CUSTOMER-GUIDE-June-2019.pdf" target="_blank"><i class="fa fa-download"></i> {{ __('CUSTOMER GUIDE') }}</a>
                  <a class="btn btn-info waves-effect waves-light mb-2" href="https://www.timeslot.pro/wp-content/uploads/2018/12/TIME-SLOT-PRO-USER%E2%80%99S-GUIDE-2019.pdf" target="_blank"><i class="fa fa-download"></i> {{ __('PRO USER GUIDE') }}</a>
                </div>
                <div class="plyr__video-embed" id="player" style="margin-bottom: 20px;">
                  <iframe src="https://www.youtube.com/embed/SgdsYeOying?origin=https://plyr.io&amp;iv_load_policy=3&amp;modestbranding=1&amp;playsinline=1&amp;showinfo=0&amp;rel=0&amp;enablejsapi=1" allowfullscreen allowtransparency allow="autoplay"></iframe>
                </div>
                <!-- <p class="text-muted">{{ __('Register as pro or customer. Get started for Free!') }}.</p> -->
              </div>
            </div>
          </div><!-- end col -->
        </div><!-- end row -->

        <div class="row m-t-8">
          <div class="col-md-6">
            <div class="p-t-0">
              <div class="plyr__video-embed" id="player" style="margin-bottom: 20px;">
                <iframe width="560" height="315" src="https://www.youtube.com/embed/08-nphwrRc4" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
              </div>
            </div>
          </div>
          <!--/col-md-5 -->
          <div class="col-md-6">
            <div class="p-t-0">
              <div class="plyr__video-embed" id="player" style="margin-bottom: 20px;">
                <iframe width="560" height="315" src="https://www.youtube.com/embed/4pRq9TkE0vs" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
              </div>
            </div>
          </div>
          <!--/col-md-5-->
        </div>

        <div class="row m-t-8">
          <div class="col-md-6">
            <div class="p-t-0">
              <div class="plyr__video-embed" id="player" style="margin-bottom: 20px;">
                <iframe width="560" height="315" src="https://www.youtube.com/embed/lynB_9e2Dbo" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
              </div>
            </div>
          </div>
          <!--/col-md-5 -->
          <div class="col-md-6">
            <div class="p-t-0">
              <div class="plyr__video-embed" id="player" style="margin-bottom: 20px;">
                <iframe width="560" height="315" src="https://www.youtube.com/embed/PA4SbH-F3gQ" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
              </div>
            </div>
          </div>
          <!--/col-md-5-->
        </div>
      </div>
    </div>
    <div class="col-sm-2"></div>
  </div>
</template>

<script>
  import { defineComponent } from 'vue'
  import helpers from '../mixins/helpers'

  export default defineComponent({
    mixins: [ helpers ],
  })
</script>
