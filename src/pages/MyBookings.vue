<template>
    <div id="tApp" class="row justify-content-center">
        <div class="col-md-8 upcoming-bookings">
            <div class="row">
                <div class="col-md-12 col-sm-12 col-xs-12 text-start">
                    <p>
                        <a data-bs-toggle="collapse" href="#collapseExample" aria-expanded="false" aria-controls="collapseExample">
                            <i class="fa fa-play-circle-o" aria-hidden="true"></i>
                        {{__('Customer App Tutorial') }}
                        </a> | <a href="https://www.timeslot.pro/support/" target="_blank" class="support-link"><i class="fa fa-support" aria-hidden="true"></i> <span class="support-text">{{ __('Support') }}</span></a>
                    </p>
                    <div class="collapse" id="collapseExample">
                        <p><a href="https://www.timeslot.pro/wp-content/uploads/2019/06/Time-Slot-Pro-CUSTOMER-GUIDE-June-2019.pdf" target="_blank">{{ __('Download the Customer User Guide') }}</a>.</p>
                        <p>{{ __('Learn how to use Time Slot Pro as a customer') }}.</p> 
                        <div class="plyr__video-embed" id="player" style="margin-bottom: 20px;">
                            <iframe src="https://www.youtube.com/embed/lynB_9e2Dbo?origin=https://plyr.io&amp;iv_load_policy=3&amp;modestbranding=1&amp;playsinline=1&amp;showinfo=0&amp;rel=0&amp;enablejsapi=1"
                                allowfullscreen allowtransparency allow="autoplay"></iframe>
                        </div>
                        <p>{{ __('View a list of your upcoming bookings, search for pros or view your previously booked pro.') }}</p>    
                        <hr>
                    </div>
                </div>
            </div>   
            <div class="row">
                <div class="col-md-12 quick-links">
                    <div class="row quick-links-customer">
                        <div class="col-6 col-sm-6">
                            <router-link class="btn btn-default btn-block w-100" to="/search" style="background-image: url(https://s3.amazonaws.com/tspassets/tsp-tennis-lesson-serve-1.jpg) !important;"><i
                                    class="fa fa-search icon-space"></i>{{ __('SEARCH PROS') }}</router-link>
                        </div>
                        <div class="col-6 col-sm-6">
                            <router-link class="btn btn-default btn-block w-100" to="/bookmark/pros" style="background-image: url(https://s3.amazonaws.com/tspassets/tsp-workout-stretch-1.jpg) !important;"><i
                                    class="fa fa-calendar-check-o icon-space"></i>{{ __('MY PROS') }}</router-link>
                        </div>
                    </div>
                </div>
            </div>

            <div class="page-title-area ">
                <h2 class="section-title">{{ __('Upcoming bookings') }}</h2>
            </div>
            <div class="">
                <booking-list type="upcoming"></booking-list>
            </div>
            <hr>
            <div class="page-title-area">
                <h2 class="section-title">{{ __('Past bookings') }}</h2>
            </div>
            <div class="past-booking-grid">
                <booking-list type="past"></booking-list>
            </div>

        </div>
    </div>
</template>

<script>
    import helpers from '../mixins/helpers.js'

    export default {
        mixins: [helpers]
    }
</script>

<style>

</style>
