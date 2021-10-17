<template>
  <div class="row">
    <div class="col-12">
      <h4 class="text-uppercase font-bold">
        <div class="input-group mb-3">
          <input type="text" class="form-control input-lg bg-input font-600" placeholder="Keyword search the Log">
        </div>
      </h4>
      <div class="card">
        <div class="row">
          <h5 class="font-bold">06/12/21 by David</h5>
          <p>Staffed {user name} to {staff slot id}</p>
        </div>
      </div>
      <div class="card">
        <div class="row">
          <h5 class="font-bold">06/12/21 by Sam</h5>
          <p>Changed {employee name} status to {employee status}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import helpers from '../mixins/helpers.js'

export default {
  mixins: [helpers],
  name  : "EmployeeUpdateProfile",
  data  : () => ({}),
}
</script>

<style lang="scss" scoped>
.bg-input {
  background-color: #c3c5c7 !important;
  height: 51px !important;
}

.form-check-input:checked {
  background-color: #e48c33;
  border-color: #e48c33;

}
</style>