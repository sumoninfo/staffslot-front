<template>
  <div class="row">
    <div class="col-12">
      <h4 class="text-uppercase font-bold">Update the profile</h4>
      <div class="card">
        <div class="row">
          <div class="col-12">
            <p class="h6">Name: </p>
            <p class="h6">Phone: </p>
            <p class="h6">Email: </p>
            <p class="h6">Address: </p>
            <p class="h6">Country: </p>
            <p class="h6">DOB: </p>
            <p class="h6">SS# </p>
            <p class="h6">Emergency Contact: </p>
            <p class="h6">Entered by: </p>
            <p class="h6">Locations: </p>
            <p class="h6">Date Hired: </p>
            <p class="h6">Status: </p>
            <div class="form-check form-check-inline">
              <input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio1" value="option1"
                     checked>
              <label class="form-check-label" for="inlineRadio1">Active</label>
            </div>
            <div class="form-check form-check-inline">
              <input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio2" value="option2">
              <label class="form-check-label" for="inlineRadio2">Inactive</label>
            </div>
            <div class="form-check form-check-inline">
              <input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio3" value="option3">
              <label class="form-check-label" for="inlineRadio3">Do not staff</label>
            </div>
            <button class="btn btn-secondary w-100">{{ __('Save profile') }}</button>
          </div>
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
}
</script>

<style lang="scss" scoped>

.form-check-input:checked {
  background-color: #e48c33;
  border-color: #e48c33;
}
</style>