<template>
    <div class="modal" :class="{'fade show': _isVisible}" style="overflow-y: scroll;" :style="_isVisible ? 'display: block;' : ''" tabindex="-1" role="dialog">
        <div class="modal-backdrop" :class="{ show: _isVisible }" @click="hide" style="z-index: 0"></div>
        <div class="modal-dialog" :class="{ 'modal-lg': large }" role="document" :style="verticalCenter ? 'transform: translate(-50%, -35%); position: fixed; left: 50%; top: 35%;' : ''">
            <div class="modal-content">
                <div v-if="$slots.header" class="modal-header">
                    <h4 class="modal-title font-18 mt-0"><slot name="header"></slot></h4>
                    <button 
                        @click="hide"
                        type="button"
                        class="close"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                    >&times;</button>
                </div>
                <div class="modal-body">
                     <slot></slot>
                </div>
                <div v-if="$slots.footer" class="modal-footer">
                    <slot name="footer"></slot>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import helpers from '../mixins/helpers'

    export default {
        mixins: [helpers],
        props: {
            isVisible: {
                type: Boolean,
                default: false
            },

            modalId: {
                type: String,
                default: null
            },

            large: {
                type: Boolean,
                default: false
            },

            verticalCenter: {
                type: Boolean,
                default: false
            }
        },

        data () {
            return {
                isVisibleInternal: false,
                isModal: true,
                locked: false
            }
        },

        computed: {
            _isVisible () {
                return this.isVisible || this.isVisibleInternal;
            }
        },

        mounted () {
            this.emitter.on('show-modal', params => {
                if (params.modalId === this.modalId ) {
                    this.isVisibleInternal = true;
                }
            });
        },

        methods: {
            hide () {
                if (!this.locked) {
                    this.isVisibleInternal = false;
                    this.$emit('close');
                    this.emitter.emit('close-modal', {
                        modalId: this.modalId
                    });
                }
            },

            lock () {
                this.locked = true;
            },

            unlock () {
                this.locked = false;
            }
        }
    }
</script>