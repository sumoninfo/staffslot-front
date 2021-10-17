<template>
  <div class="card">
    <div class="card-header">
      <h4 v-text="inviteList.name"></h4>
    </div>

    <div class="card-body">
      <div class="row">
        <div class="col-12">
          <p><strong>{{ __('List Count') }}:</strong> <span v-text="inviteList.customers.length"></span> <span v-if="inviteList.is_full" class="text-danger">({{ __('full') }})</span></p>
          {{ __('Created') }}: <span v-text="inviteList.create_date"></span>
        </div>

      </div>
    </div>

    <div class="card-footer">
      <div class="row pull-right">
          <button type="button" class="btn btn-primary mr-2" @click="selectCustomers">
            <i class="fa fa-user-plus"></i> {{ __('Manage List') }}
          </button>
        <button type="button" class="btn btn-sm btn-default me-2" @click="renameList"><i class="fa fa-pencil"></i></button>
        <button type="button" class="btn btn-sm btn-danger" @click="deleteList"><i class="fa fa-trash"></i></button>
      </div>
    </div>

  </div>
</template>

<script>
    import axios from 'axios'
    import Swal from 'sweetalert2'
    import helpers from '../../mixins/helpers'

    export default {
        mixins: [helpers],
        props:["list"],
        data: function () {
          return {
            inviteList:{},
          }
        },
        methods:{
          selectCustomers(){
            this.emitter.emit("openCustomerSelect",{invite_list: this.inviteList, callBack: this.updateCustomers});
          },
          updateCustomers(_customers){
            this.inviteList.customers = _customers;
            Swal.fire("Success!", "Invite list customers updated sucessfully");
          },
          async renameList(){
            const result = await Swal.fire({
              title: "Change List Name",
              text: "Enter name for list:",
              input: 'text',
              inputValue:this.inviteList.name,
              showCancelButton: true,
              closeOnConfirm: false,
              inputPlaceholder: "enter list name",
              inputValidator: (value) => {
                if (!value) {
                  return 'List name can not be empty'
                }
              }
            })
            if (result.isConfirmed) {
              const listName = result.value;
              axios.patch("/api/invite-list/" + this.inviteList.id,{name:listName})
                .then(response => {
                  this.inviteList.name = listName;
                  this.list.name = listName;
                  Swal.fire("Success!", "Invite list updated sucessfully");
              });
            }
          },
          async deleteList(){
            const result = await Swal.fire({
              title: "Are you sure?",
              text: "Delete list '"+ this.inviteList.name +"'? You won't be able to revert this.",
              type: "error",
              showCancelButton: true,
              confirmButtonClass: "btn-danger",
              confirmButtonText: "Yes, delete it!",
              closeOnConfirm: false
            })
            if (result.isConfirmed) {
              axios.delete("/api/invite-list/" + this.inviteList.id)
                .then(response =>{
                  this.list.id = 0;
                  this.$store.commit('setFlashMessage', 'Invite list has been deleted')
                });
            }
          },
        },
        mounted() {
        },
        created(){
          this.inviteList = this.list;
        },
    }
</script>
