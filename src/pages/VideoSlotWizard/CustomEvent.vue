<template>
    <div class="location-box">
        <event-form :custom=true :isVideo="true"/>
    </div>
</template>

<script>
    export default {
        mounted () {
            this.emitter.on('eventSaved', event => {
                //
            });
        }
    }
</script>