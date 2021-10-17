<template>
    <div class="alert alert-danger" v-show="list && list.length">
        <ul class="list-unstyled">
            <li v-for="(error, key) in list" v-text="error"></li>
        </ul>
    </div>
</template>

<script>
    export default {
        props: {
            list: {
                type: Array,
                default: []
            }
        }
    }
</script>