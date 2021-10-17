<template>
    <div>
      <div id="invite-customer-select-modal" class="modal" tabindex="-1" role="dialog">
        <div class="modal-dialog h-75" role="document">
          <div class="modal-content h-100 bg-light">

            <div class="modal-header">
              {{invite_list.name}} - {{ __('Customers') }}
            </div>

            <div id="invite-customer-select-modal-content" class="modal-body cust-list-modal modal-scroll-60">

              <div class="container-fluid">
                <multiselect v-model="values" :multiple="true" label="email" track-by="user_id" :searchable="true" :options="options" :custom-label="customLabel" :show-labels="false"  :hide-selected="true" placeholder="Select customers" :close-on-select="false">
                  <template v-slot:option="props">
                    <div class="option__desc"><span class="option__small">{{ props.option.account.full_name }} {{ props.option.email }}</span></div>
                  </template>
                </multiselect>
                <hr />

                <div
                  class="row"
                  v-for="(customer,index) in values"
                  :key="index"
                >
                  <div class="container-fluid">
                    <div class="card">
                      <div class="card-header">
                        <div class="row">
                          <div class="col-8"># {{ index + 1}}</div>
                          <div class="col-4 text-end">
                            <a @click="removeCustomer(index)"><i class=" fa fa-close"></i></a>
                          </div>
                        </div>
                      </div>
                      <div class="card-body">
                        <div class="row">
                          <div class="col-md-6 h6 mt-2">
                            <span v-text="customer.account.full_name"></span>
                          </div>
                          <div class="col-md-6 h6 mt-2">
                            <span v-text="customer.email"></span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <div class="row justify-content-end">
                <button class="btn btn-danger mr-2" @click="closeModal"><i class="fa fa-ban"></i> {{ __('Cancel') }}</button>
                <button class="btn btn-success" :disabled="ajaxloading" @click="saveCustomers">
                  <span v-if="!ajaxloading"><i class="fa fa-save"></i> {{ __('Save') }}</span>
                  <span v-else><i class="fa fa-spinner fa-spin"></i> {{ __('Saving') }}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
    import $ from 'jquery'
    import axios from 'axios'
    import Swal from 'sweetalert2'
    import helpers from '../../mixins/helpers'

    export default {
        mixins: [helpers],
        data () {
          return {
            values: [],
            options: [],
            invite_list: {},
            callBack:function(){},
            ajaxloading:false,
          }
        },
        methods:{
          open(invite_list){
            this.values = invite_list.customers.slice(0);
            this.invite_list = invite_list;
            $("#invite-customer-select-modal").modal('show');
          },
          closeModal(){
            $("#invite-customer-select-modal").modal('hide');
          },
          customLabel ({account, email }) {
            return `${account.full_name} - ${email}`
          },
          saveCustomers(){
            if (this.ajaxloading) {
              return false;
            }
            this.ajaxloading=true;
            var customers = this.values.map( user => {
              return {user_id:user.user_id};
            });
            axios.put("/api/invite-list/"+this.invite_list.id,{customers:customers})
              .then(response =>{
                  this.closeModal();
                  this.ajaxloading=false;
                  if (response.data.success) {
                      this.callBack(response.data.inviteList.customers);
                  }else{
                      Swal.fire({
                          'title':"Error!",
                          'text':response.data.msg,
                          'type':'error'
                      },
                        function(){
                          $("#invite-customer-select-modal").modal('show');
                      });
                  }
              });
          },
          removeCustomer(index){
            const values = this.values;
            values.splice(index, 1);
            this.values = values;
          },
        },
        mounted() {
            this.emitter.on("openCustomerSelect",(args) => {
              this.callBack = args.callBack;
              this.open(args.invite_list);
            });
        },
        created(){
          axios.post("/api/customers/my-customers",{})
          .then(response =>{
            this.options = response.data.customers;
          });
        },
    }
</script>
