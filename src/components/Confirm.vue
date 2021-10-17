<template>
    <div @click.stop.prevent="show" style="display: inline;">
        <slot></slot>
    </div>
</template>

<script>
import Swal from 'sweetalert2'
import helpers from '../mixins/helpers'

export default {
    mixins: [helpers],
    methods: {
        async show () {
            const result = await Swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                showCancelButton: true,
                confirmButtonText: 'Yes',
                cancelButtonText: 'Cancel',
            })

            if (result.isConfirmed) {
                this.$emit('confirm')
            }
        }
    }
}
</script>

<style>

</style>
