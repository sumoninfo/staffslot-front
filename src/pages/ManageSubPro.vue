<template>
  <div class="row justify-content-center">
    <div class="col-12">
      <router-link to="/manage-sub-pro/register" class="btn btn-warning w-100 text-white" type="button">{{
          __('ADD NEW SUB-PRO USER +')
        }} </router-link>

      <div class="event-search mt-2">
        <div class="form-inline lg-form form-lg">
          <i aria-hidden="true" class="fa fa-search"></i>
          <input class="event-search-form form-control form-inline form-control-sm ms-3 col-11"
                 placeholder="KW search Name & Company"
                 tabindex="0" type="text"/>
        </div>
      </div>

      <div class="filter d-flex justify-content-between mt-3">
        <div class="d-flex">
          <div class="filter-text">Filter</div>
          <span class="status">(active/incactive)</span>
        </div>
        <div class="filter-text">Sort</div>
      </div>
    </div>

    <div class="col-12">
      <div class="card">
        <div class="info">
          <p class="customer-name">Joe Construction Customer</p>
          <p>Email: Joe@russconstruction.biz</p>
          <p>Phone: 305-555-1212</p>
          <p>Company: Joe’s Construction</p>
          <hr>
          <div class="row">
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
          <hr>
          <button class="btn btn-success w-100 mt-3" type="button">{{
              __('ADD STAFF SLOT')
            }}
          </button>
          <button class="btn btn-secondary w-100 my-2" type="button">{{
              __('VIEW TIME SHEETS')
            }}
          </button>
          <button class="btn btn-primary w-100" type="button"><i class="fa fa-user me-2"></i>{{
              __('View Profile')
            }}
          </button>
        </div>
      </div>
    </div>
    <div class="col-12">
      <div class="card">
        <div class="info">
          <p class="customer-name">Tim Slot</p>
          <hr>
          <p><i class="fa fa-envelope me-2"></i> <span class="tim-info">Joe@russconstruction.biz</span></p>
          <p><i class="fa fa-phone me-2"></i> <span class="tim-info">Phone: 305-555-1212</span></p>
          <hr>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import helpers from '../mixins/helpers.js'

export default {
  mixins: [helpers],
  name  : "ManageSubPro"
}
</script>

<style lang="scss" scoped>
.filter-text {
  font-size   : 18px;
  font-weight : bold;
}

.status {
  font-size   : 12px;
  align-self  : center;
  margin-top  : 3px;
  margin-left : 5px;
}

.customer-name {
  font-size : 18px;
}

.tim-info{
  font-size: 14px;
  color: #4688F1;
}

</style>