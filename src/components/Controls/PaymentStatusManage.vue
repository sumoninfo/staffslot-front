<template>
    <loading-button
        @click.stop="changeStatus"
        :loading="isLoading"
        style="cursor: pointer; border: none;"
        class="btn p-0"
    >
        <span :class="'label label-'+ paymentStatusX.label_type">
            {{paymentStatusX.type}} {{paymentStatusX.paid}}
        </span>
    </loading-button>
</template>

<script>
    import helpers from '../../mixins/helpers';
    import Swal from 'sweetalert2/dist/sweetalert2.js'
    import axios from 'axios';
    
    export default {
        mixins: [helpers],
        props: {
            paymentStatus: Object,
            booking: Number,
            type: {
                type: String,
                default: null
            }
        },
        data() {
            return {
                paymentStatusX: {},
                isLoading: false,
                url: '/api/slot/booking/paid',
                method: 'post'
            }
        },
        methods:{
            changeStatus(){
                if (!this.isLoading && this.paymentStatus.type=="cash" || this.paymentStatus.type=="club credit") {
                    if (this.paymentStatus.paid!="paid") {
                        Swal.fire({
                            title: this.__('Did you get paid?'),
                            text: ' ',
                            icon: 'info',
                            showCancelButton: true,
                            confirmButtonText: 'yes',
                            cancelButtonText: 'no'
                        }).then((result) => { 
                            if (result.isConfirmed) {
                                this.isLoading = true;

                                axios[this.method](`${this.url}/${this.booking}`, {paid: true})
                                .then(response => {
                                    this.isLoading = false;
                                    this.paymentStatusX.paid = "paid";
                                    this.paymentStatusX.label_type = "success";
                                })
                                .catch(err => {
                                    console.log(err);
                                    this.isLoading = false;
                                });
                            }
                        });
                    }
                }
            },
        },
        computed:{

        },
        watch: {
        },
        mounted(){
            if (this.type === 'package') {
                this.url = '/package/order/paid';
                this.method = 'get';
            }
            this.paymentStatusX = this.paymentStatus;

            if (this.paymentStatusX.type === 'credit card')
                this.paymentStatusX.paid = null;
        },
    }
</script>
