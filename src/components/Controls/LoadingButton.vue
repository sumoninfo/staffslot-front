<template>
    <button v-bind="$attrs">
        <slot name="icon" v-if="!loading"></slot>
        <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
        <slot></slot>
    </button>
</template>

<script>
export default {
    props: {
        loading: {
            type: Boolean,
            default: false
        }
    }
}
</script>
