<template>
    <div>
        <component
            :is="modal.component"
            v-for="(modal, i) in modals"
            :key="i"
            @input="input($event, modal, i)"
            @close="close(modal, i)"
            :index="i"
            v-bind="modal.props"
            v-on="modal.on"
        />
    </div>
</template>

<script>
// <template>
//     <div>
//         <modal
//             @close="close(modal, i)"
//             v-for="(modal, i) in modals"
//             :key="i"
//             :is-visible="true"
//         >
//             <component
//                 :is="modal.component"
//                 @input="input($event, modal, i)"
//                 v-bind="modal.props"
//             />
//         </modal>
//     </div>
// </template>

export default {
    data () {
        return {
            values: []
        }
    },

    computed: {
        modals () {
            return this.$store.state.modals;
        }
    },

    methods: {
        close (modal, i) {
            this.$store.commit('modals/pop');

            if (typeof modal.close === 'function') {
                modal.close(this.values[i]);
            }
        },

        input (value, modal, i) {
            this.values[i] = value;

            if (typeof modal.input === 'function') {
                modal.input(this.values[i]);
            }
        }
    }
}
</script>

<style>

</style>
