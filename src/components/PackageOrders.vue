<template id="package-orders">
    <div class="col-12 package-orders">
        <div v-if='orders.length==0' class="text-center bg-white no-package-table">
            <h4>{{ __('No Package found') }}</h4>
        </div>
        <package-order v-for="order in orders" :key="order.id" :order="order" :active="active" />
    </div>
</template>

<script>
    import helpers from '../mixins/helpers'

    export default {
        mixins: [helpers],
        props:['orders', 'active'],
        template: '#package-orders',
        data:function(){
            return{};
        },
        computed:{

        },
    };
</script>