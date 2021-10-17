<template>
  <template class="row">
    <div class="col-12 px-0 bg-primary">
      <div class="text-center text-white my-3">
        <h6 class="m-0">842 EMPLOYEES</h6>
        <p>In the staff list</p>
      </div>
    </div>
    <div class="col-12 px-4">
      <div class="event-search mt-2">
        <div class="form-inline lg-form form-lg">
          <i aria-hidden="true" class="fa fa-search"></i>
          <input class="event-search-form form-control form-inline form-control-sm ms-3 col-11"
                 placeholder="Search for staff by name, staff type or locat..."
                 tabindex="0" type="text"/>
        </div>
      </div>

      <div aria-label="Basic mixed styles example" class="btn-group w-100 my-2" role="group">
        <button class="btn btn-light rounded-0" type="button">{{ __('Filter by List')}}</button>
        <button class="btn btn-secondary" type="button">{{ __('VIEW ALL')}}</button>
        <button class="btn btn-success" type="button">
          STAFFED <small>(active)</small></button>
        <button class="btn btn-warning" type="button"> {{ __('AVAILABLE') }}
          <small>(inactive)</small></button>
        <button class="btn btn-danger rounded-0" type="button">{{ __('DNS')}} <small> (do not staff)</small></button>
      </div>

      <div v-if="showDiv" class="card">
        <div class="info">
          <div class="d-flex justify-content-between">
            <h4 class="fw-light">James Russell</h4>
           <div class="d-flex">
             <div aria-label="Basic mixed styles example" class="btn-group my-auto border" role="group">
               <button :class="tabActive ? 'btn-success' : 'btn-light'" class="btn tab-btn" type="button"
                       @click="tabActive = true">{{
                   __('Active')
                 }}
               </button>
               <button :class="!tabActive ? 'btn-warning' : 'btn-light'" class="btn tab-btn" type="button"
                       @click="tabActive = false">
                 {{ __('Available') }}
               </button>
             </div>
             <div @click="showDiv = false" class="ms-3 my-auto">
               <i class="fa fa-times-circle text-danger fa-2x"></i>
             </div>
           </div>
          </div>
          <small class="type-text">Types: semi-skilled, frame carpenter, rough carpenter</small>
          <hr>
          <div class="row">
            <p><i class="fa fa-envelope me-1"></i> <span class="text-primary">Joe@russconstruction.biz</span></p>
            <div class="col-5">
              <p><i class="fa fa-phone me-2"></i> <span class="text-primary">305-555-1212</span></p>
            </div>
            <div class="col-7 text-end">
              <button class="btn btn-secondary me-1 p-2 rounded-0" type="button">{{ __('SMS INVITE')}}</button>
              <button class="btn btn-secondary p-2 rounded-0" type="button">{{__('EMAIL INVITE')}}</button>
            </div>
          </div>
          <hr>
         <div class="d-flex justify-content-between pb-2">
           <button class="btn btn-success py-3 px-4 rounded-0" type="button">{{
               __('STAFF TO JOB')
             }}
           </button>
           <button class="btn btn-secondary py-3 px-4 rounded-0" type="button">{{
               __('QUICK VIEW')
             }}
           </button>
           <button class="btn btn-secondary py-3 px-4 rounded-0" type="button">{{
               __('ADD NOTE')
             }}
           </button>
         </div>
        </div>
      </div>
      <div class="card">
        <div class="info">
          <div class="d-flex justify-content-between">
            <h4 class="fw-light">James Russell</h4>
             <div aria-label="Basic mixed styles example" class="btn-group my-auto border" role="group">
               <button :class="tabActive2 ? 'btn-success' : 'btn-light'" class="btn tab-btn" type="button"
                       @click="tabActive2 = true">{{
                   __('Active')
                 }}
               </button>
               <button :class="!tabActive2 ? 'btn-warning' : 'btn-light'" class="btn tab-btn" type="button"
                       @click="tabActive2 = false">
                 {{ __('Available') }}
               </button>
             </div>
          </div>
          <small class="type-text">Types: semi-skilled, frame carpenter, rough carpenter</small>
          <hr>
          <div class="row">
            <p><i class="fa fa-envelope me-1"></i> <span class="text-primary">Joe@russconstruction.biz</span></p>
            <div class="col-5">
              <p><i class="fa fa-phone me-2"></i> <span class="text-primary">305-555-1212</span></p>
            </div>
            <div class="col-7 text-end">
<!--              <button class="btn btn-secondary me-1 p-2 rounded-0" type="button">{{ __('SMS INVITE')}}</button>-->
<!--              <button class="btn btn-secondary p-2 rounded-0" type="button">{{__('EMAIL INVITE')}}</button>-->
            </div>
          </div>
          <hr>
          <div class="row mb-2">
            <div class="col-3 my-auto fw-bold">
              Last Staff
              Order:
            </div>
            <div class="col-9">
              <p class="fw-bold">Frame Carpenter</p>
              <p>Monday 6/21/21 at 7:00am (arrival
                time)</p>
            </div>
          </div>
         <div class="d-flex justify-content-between pb-2">
           <button class="btn btn-secondary py-3 px-4 rounded-0" type="button">{{
               __('HISTORY')
             }}
           </button>
           <button class="btn btn-dark py-3 px-4 rounded-0" type="button">{{
               __('TIME SHEETS')
             }}
           </button>
           <button class="btn btn-primary py-3 px-4 rounded-0" type="button">{{
               __('PROFILE')
             }}
           </button>
         </div>
          <div class="mt-1 pb-2">
            <button class="btn btn-success w-100 rounded-0" type="button">{{
                __('STAFF TO JOB')
              }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
</template>

<script>
import helpers from '../mixins/helpers.js'

export default {
  mixins: [helpers],
  name  : "ManageStaff",
  data() {
    return {
      tabActive : true,
      tabActive2 : true,
      showDiv : true
    }
  },
  mounted() {
    document.getElementById("wrapper").style.paddingTop     = "29px";
    document.getElementById("main-container").style.padding = "0";

  },
  unmounted() {
    document.getElementById("wrapper").style.paddingTop          = "45px";
    document.getElementById("main-container").style.paddingLeft  = "12px";
    document.getElementById("main-container").style.paddingRight = "12px";
  }
}
</script>

<style lang="scss" scoped>
button {
  font-size : 12px;

  &.tab-btn {
    height        : 25px;
    padding       : 5px 10px;
    border-radius : 0;
  }
}
.fa-times-circle{
  font-size: 22px;
}
.type-text{
  font-size: 10px;
  color: black;
}
</style>