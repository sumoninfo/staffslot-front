<template>
    <div v-if="modelValue && modelValue.total && modelValue.total > 0">
        <div>{{ __('Showing') }} {{ modelValue.from }} {{ __('to') }} {{ modelValue.to }} {{ __('of') }} {{ modelValue.total }} {{ __('entries') }}</div>
        <div v-if="modelValue.total > 10" style="display: flex; justify-content: flex-end;">
            <div style="margin-top: 26px;">
                <label for="select1" class="control-label pr-2 me-2">
                    {{ __('Per page') }}
                </label>
                <select class="form-control me-2 w-auto" style="display: inline-table;" v-model="modelValue.per_page" @change="onPerPageChanged" id="select1">
                    <option value="10">10</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                </select>
            </div>
            <ul class="pagination pull-right1" v-if="modelValue.last_page != 1">
                <li :class="{ 'paginate_button page-item previous': true, disabled: modelValue.current_page == 1 }"><a href="#" aria-controls="datatable-buttons" data-dt-idx="0" tabindex="0" class="page-link" @click.prevent="prevPage()">{{ __('Previous') }}</a></li>
                <li :class="{ active: p == modelValue.current_page, 'paginate_button page-item': true }" v-for="p in getPages()" :key="p"><a href="#" aria-controls="datatable-buttons" data-dt-idx="2" tabindex="0" class="page-link" v-text="p" @click.prevent="setPage(p)"></a></li>
                <li :class="{ 'paginate_button page-item next': true, disabled: modelValue.current_page == modelValue.last_page  }"><a href="#" aria-controls="datatable-buttons" data-dt-idx="7" tabindex="0" class="page-link" @click.prevent="nextPage()">{{ __('Next') }}</a></li>
            </ul>
        </div>
    </div>
</template>

<script>
    import helpers from '../../mixins/helpers'

    export default {
        mixins: [helpers],
        props: {
            modelValue: {
                type: [Object, Array],
                default: null
            },
            action: {
                type: String,
                default: null
            }
        },

        data () {
            return {
                break: '...',
                internalPagination: null
            }
        },

        computed: {
            pagination: {
                get () { return this.modelValue ? this.modelValue : this.internalPagination }
            }
        },

        methods: {
            setVal (obj) {
                const pagination = this.modelValue ? this.modelValue : this.internalPagination;
                for (let key in obj)
                    this.pagination[key] = obj[key];
            },

            nextPage () {
                this.setVal({ current_page: this.pagination.current_page + 1 });
                this.setPage(this.pagination.current_page);
            },

            prevPage () {
                this.setVal({ current_page: this.pagination.current_page - 1 });
                this.setPage(this.pagination.current_page);
            },

            setPage (page_num) {
                if (page_num != this.break) {
                    this.setVal({ page: page_num });
                    this.$emit('on-changed');
                    if (this.action)
                        this.$store.dispatch(this.action, this.pagination)
                }
            },

            onPerPageChanged () {
                this.setVal({ current_page: 1 });
                this.setPage(this.pagination.current_page);
            },

            getPages () {
                var pages = []
                var left = this.pagination.current_page - 3
                var right = this.pagination.current_page + 3

                for (var i = 1; i <= this.pagination.last_page; i++) {
                    if(i == 1 || i == this.pagination.last_page || (i <= right && i >= left)) {
                        pages.push(i)
                    } else {
                        if (pages[pages.length-1] != this.break) {
                           pages.push(this.break)
                        }
                    }
                }

                return pages
            }
        }
    }
</script>
