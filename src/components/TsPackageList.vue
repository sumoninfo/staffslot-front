<template id='ts-package-list'>
    <div class="col-12">
        <div v-if="isempty" class="card package-box col-12 text-center">
            <h4>{{ __('No packages found') }}</h4>
        </div>
        <div v-for="p,i in packages" :key="p.id">
            <ts-package
                v-if="!p.is_deleted"
                :package="p"
            />
        </div>
    </div>
</template>

<script>
    import helpers from '../mixins/helpers'
    
    export default {
        mixins: [helpers],
        props:['packages'],
        template: '#ts-package-list',
        data:function(){
            return{};
        },
        computed:{
            isempty:function isempty(){
                return this.packages.length==0;
            },
        },
    };
</script>
