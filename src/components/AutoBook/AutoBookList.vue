<template>
    <div class="col-12 px-0">
        <div v-for='(item,index) in list' class="row">
            <autobook-item :item="item"></autobook-item>
        </div>
    </div>
</template>
<script type="text/javascript">
        export default{
            props:['list'],
            data(){
                return {
                }
            },
        };
</script>
