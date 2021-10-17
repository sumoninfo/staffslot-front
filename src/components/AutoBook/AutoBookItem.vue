<template>
    <div class="col-12">
        <div v-if="!deleted" :class="{'card':true,'bg-light':item.pro_cancelled}">

            <div class="row">
                <div class="col-12">
                    <div class="row">
                        <h5 class="col-auto">{{item.name}}</h5>
                        <div class="col text-right">
                            <span v-if="item.pro_cancelled" class="label label-danger ml-1">{{ __('canceled') }}</span>
                        </div>
                    </div>
                </div>
                <div class="col-md-5 mt-1">
                    <h6 class="pl-1">{{ __('Event Type:') }} <a :href="eventLink" v-text="item.event.title"></a></h6>
                </div>
                <div class="col-md-3 text-13 mt-2 mb-1">
                    {{ __('Created:') }} <span v-text="createDate"></span>
                </div>
                <div class="col-md-4 text-center text-md-right">
                    <a :href="editLink" class="btn btn-default"><i class="fa fa-pencil"></i> {{ __('Edit') }}</a>
                    <button @click="deleteItem" class="btn btn-danger"><i class="fa fa-trash"></i> {{ __('Delete') }}</button>
                </div>
            </div>

        </div>
    </div>
</template>
<script type="text/javascript">
        import axios from 'axios'
        import helpers from '../../mixins/helpers'

        export default{
            props:{
                item:Object,
            },
            mixins: [helpers],
            data(){
                return {
                    deleted:false,
                    autoBook:{},
                }
            },
            computed:{
                editLink(){
                    return "/autobook/edit/"+this.item.id;
                },
                eventLink(){
                    // return "//"+this.item.id;
                },
                createDate(){
                    return moment(this.item.created_at).format("MM/DD/YYYY");
                },
            },
            methods:{
                deleteItem(){
                    var autobook = this;
                    swal({
                        title:"Are you sure want to delete auto book?",
                        text:"you can not reverte this.",
                        type: 'error',
                        showCancelButton: true,
                        confirmButtonText: 'Delete',
                        cancelButtonText: 'Cancel',
                        confirmButtonClass: 'btn btn-danger',
                        cancelButtonClass: 'btn btn-default',
                        showLoaderOnConfirm: true,
                    },()=>{
                        axios.delete("/autobook/"+ this.item.id).then(response =>{
                            swal("Auto Book was deleted!");
                            autobook.deleted= response.data.result;
                        });

                    },function (dismiss) {});
                },
            },
        };
</script>
