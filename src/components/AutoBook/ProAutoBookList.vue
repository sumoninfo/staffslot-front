<template>
    <div class="col-12 px-0 my-2">
        <div
            v-for='(event,index) in events'
            :key="index"
            class="row"
        >
            <div class="col-12 px-0">

                <div class="card p-0">
                    <div class="card-header">
                        <h5>{{ __('Event') }}: {{event.title}}</h5>
                    </div>
                    <div class="card-body">
                        <div
                            v-for="(autobook,j) in event.auto_books"
                            class="row"
                            :key="j"
                        >
                            <div class="col-12 px-0">
                                <pro-autobook-item :item="autobook"></pro-autobook-item>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>
<script type="text/javascript">
        import helpers from '../../mixins/helpers'
        export default{
            props:['list'],
            mixins: [helpers],
            data(){
                return {
                }
            },
            computed:{
                events(){
                    return this.list;
                },
            },
        };
</script>
