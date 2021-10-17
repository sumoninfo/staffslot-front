<template>
  <admin-user-list></admin-user-list>
  <div class="modal fade none-border" id="add-user-modal">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title font-18 mt-0"><strong>{{__('Add user')}}</strong></h4>
          <button type="button" class="close" data-bs-dismiss="modal" aria-hidden="true">&times;</button>
        </div>
        <admin-add-user-form></admin-add-user-form>
      </div>
    </div>
  </div>
  <div class="modal fade none-border" id="delete-user-modal">
    <div class="modal-dialog">
      <div class="modal-content">
          <admin-delete-user-form></admin-delete-user-form>
      </div>
    </div>
  </div>
</template>

<script>
  import { defineComponent } from 'vue'
  import helpers from '../../mixins/helpers'

  export default defineComponent({
    mixins: [ helpers ],
  })
</script>
