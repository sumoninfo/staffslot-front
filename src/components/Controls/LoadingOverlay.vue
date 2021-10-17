<template>
    <div v-if="isLoading" class="col-12 ajaxLoading h-100 text-center">
        <h2><i class="fa fa-spinner fa-spin"></i> {{ __('Loading') }}...</h2>
    </div>
</template>

<script>
    import helpers from '../../mixins/helpers'

    export default {
        mixins: [helpers],
        data() {
            return {
                isLoading: false
            }
        },
        created: function () {
            let _this = this

            this.emitter.on('loadingStart', function() {
                _this.isLoading = true;
            })

            this.emitter.on('loadingStop', function() {
                _this.isLoading = false;
            })
        }
    }
</script>