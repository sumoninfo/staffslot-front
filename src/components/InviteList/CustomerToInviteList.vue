<template>
  <div id="invite-list-select-modal" class="modal" tabindex="-1" role="dialog">
      <div class="modal-dialog" role="document">
          <div class="modal-content bg-light">
              <div class="modal-header">
                  <h4>{{ __('Add customer to list') }}</h4>
              </div>
              <div id="customer-select-modal-content" class="modal-body cust-list-modal modal-scroll-60">
                  <div
                    v-for="list,index in lists"
                    :key="index"
                    class="col-12"
                  >
                    <div class="card">
                      <div class="row">

                        <div class="col-2">
                          <div>
                              <input  v-if="alreadAdded[index]" disabled class="form-control" type="checkbox" :id="'invite-list-'+index" v-model="checkedStat">
                              <input  v-else class="form-control" :disabled="list.is_full" type="checkbox" v-model="selected[list.id]" :id="'invite-list-'+index">
                          </div>
                        </div>

                        <div class="col-10">
                          <label class="d-block mt-2" :for="'invite-list-'+index">
                              <span v-text="list.name"></span>
                              <span v-if="list.is_full" class="text-danger">({{ __('Full') }})</span>
                          </label>
                        </div>

                      </div>
                    </div>
                  </div>
              </div>
              <div class="modal-footer">
                  <div class="row">
                    <button class="btn btn-danger mr-2" @click="closeModal"><i class="fa fa-ban"></i> {{ __('Cancel') }}</button>
                    <button class="btn btn-success" @click="save"><i class="fa fa-save"></i> {{ __('Save') }}</button>
                  </div>
              </div>
          </div>
      </div>
  </div>
</template>

<script>
    import axios from 'axios'
    import helpers from '../../mixins/helpers'
    import $ from 'jquery'

    export default {
        mixins: [helpers],
        data() {
          return {
            lists:[],
            selected:{},
            customer:null,
            checkedStat:true,
          }
        },
        methods:{
          save(){
            axios.post("/api/invite-list/addcustomer",{
              customer:this.customer.user_id,
              inviteList:this.selected
            })
              .then(response =>{
                this.$store.commit('setFlashMessage', 'Customer added to list.')
              });
            this.closeModal();
          },
          open(){
            $("#invite-list-select-modal").modal("show");
          },
          closeModal(){
            $("#invite-list-select-modal").modal("hide");
          },
        },
        computed:{
            alreadAdded(){
                var customer_data = [];
                if (this.lists) {
                    for (var i = 0; i < this.lists.length; i++) {
                        var list = this.lists[i];
                        if (this.customer) {
                            customer_data[i] = list.customers
                            .map(customer => customer.user_id)
                            .indexOf(this.customer.user_id) >=0;
                        } else {
                            customer_data[i]=false;
                        }
                    }
                    return customer_data;
                }
            },
        },
        created() {
            axios.post("/api/invite-list/get")
              .then(response => {
                this.lists = response.data
              });

            this.emitter.on("addCustomerToLists",
              customer => {this.customer=customer;
              this.open();
            });
        }
    }
</script>
