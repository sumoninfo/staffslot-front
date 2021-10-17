<template>
    <div class="col-12 package-card-wrapper">
        <div class="card">
            <div class="row">
                <div class="col-md-6 col-sm-12">
                    <div class="row">
                        <div class="col-12">{{ __('Date') }}: <span v-text="request.request_date"></span></div>
                        <div class="col-12">{{ __('Name') }}: <span v-text="request.name"></span></div>
                        <div class="col-12">{{ __('Email') }}: <a :href="'mailto:' + request.email" v-text="request.email"></a></div>
                        <div class="col-12">{{ __('Phone') }}: <a :href="'tel:' + request.phone" v-text="request.phone"></a></div>
                    </div>
                </div>
                <div class="col-md-6 col-sm-12">
                    <p v-text="request.message"></p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import helpers from '../../mixins/helpers'

    export default {
        mixins: [helpers],
        props:{
            request:{
                type:Object,
                required:true,
            },
        },
    };
</script>
