<template>
    <div class="col-12">
        <div class="row">
          <div class="col-12">
            <h3>{{ __('Manage Lists') }}
              <button class="btn btn-success pull-right" @click="createClicked"> <i class="fa fa-plus"></i> {{ __('Add new list') }}</button>
            </h3>
            <hr>
            <p><a data-bs-toggle="collapse" href="#collapseExample" aria-expanded="false"
                  aria-controls="collapseExample">
                  <i class="fa fa-play-circle-o" aria-hidden="true"></i>
                  {{__('Lists Feature Tutorial') }}</a></p>
            <div class="collapse" id="collapseExample">
                <p>{{ __('Create group invite &amp; booking lists. Max 50 per list') }}. {{ __('With two clicks send out an invitation via SMS and email, or book an entire list on a slot all at once. This makes it easy to book teams and other groups of users.') }}.</p>
                <!-- <div class="row">
                    <div class="col-md-6 col-sm-12">
                        <div class="plyr__video-embed" id="player" style="margin-bottom: 20px;">
                            <iframe src="https://www.youtube.com/embed/3Q0oD5UfPpg?origin=https://plyr.io&amp;iv_load_policy=3&amp;modestbranding=1&amp;playsinline=1&amp;showinfo=0&amp;rel=0&amp;enablejsapi=1" allowfullscreen allowtransparency allow="autoplay"></iframe>
                        </div>
                    </div>
                    <div class="col-md-6 col-sm-12">
                        <div class="plyr__video-embed" id="player" style="margin-bottom: 20px;">
                            <iframe src="https://www.youtube.com/embed/0-lkh4Pe3Xw?origin=https://plyr.io&amp;iv_load_policy=3&amp;modestbranding=1&amp;playsinline=1&amp;showinfo=0&amp;rel=0&amp;enablejsapi=1" allowfullscreen allowtransparency allow="autoplay"></iframe>
                        </div>
                    </div>
                </div> -->
                <p>{{ __('To get started click the "add a list" button below. Create a list name, add customers and click save. Customers that have previously booked a slot with you are eligible to be included on a list. Once you have created a slot, you can edit and delete it as needed') }}. {{ __('Questions?')}} <a href="https://www.timeslot.pro/support/" target="_blank" class="support-link"><i class="fa fa-support" aria-hidden="true"></i><span class="button-text"> {{ __('Contact Support') }}</span></a></p>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-12" v-if="inviteList.length < 1">
            <h3 class=" alert alert-dark">{{ __('You have not created any invite list') }}</h3>
          </div>
          <div
            v-for="list,i in inviteList"
            :key="i"
            class="col-md-6 col-sm-12"
          >
            <invite-list-card
              v-if="list.id>0"
              :list="list"
            />
          </div>
        </div>
        <invite-customer-select></invite-customer-select>
    </div>
</template>

<script>
    import axios from 'axios'
    import Swal from 'sweetalert2'
    import helpers from '../../mixins/helpers.js'

    export default {
        mixins: [helpers],
        props:["invitelist"],
        data:function(){
          return {
            inviteList:[],
          };
        },
        methods: {
          async createClicked(){
            const result = await Swal.fire({
              title: "Create List",
              text: "Enter name for list:",
              input: 'text',
              showCancelButton: true,
              closeOnConfirm: false,
              inputPlaceholder: "enter list name",
              inputValidator: (value) => {
                if (!value) {
                  return 'List name can not be empty'
                }
              }
            });
            if (result.isConfirmed) {
              const listName = result.value;
              axios.post("/api/invite-list",{name:listName})
                .then(response => {
                  this.inviteList.push(response.data.list);
                  this.$store.commit('setFlashMessage', 'Invite list created sucessfully')
              });
            }
          },
        },
        mounted() {
            this.emitter.on("inviteListUpdated", lists => {
              this.inviteListUpdate(lists);
            });
        },
        created(){
          this.inviteList = this.invitelist;
        },
    }
</script>
