<template>
    <div class="container">
        <div class="row">
            <div class="col-md-8 col-md-offset-2">
                <div class="panel panel-default">
                    <div class="panel-heading">{{ __('Example Component') }}</div>

                    <div class="panel-body">
                        {{ __("I'm an example component!") }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import helpers from '../mixins/helpers'

    export default {
        mixins: [helpers],
        mounted() {
            console.log('Component mounted.')
        }
    }
</script>
