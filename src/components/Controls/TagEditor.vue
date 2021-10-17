<template>
    <div>
        <multiselect
            v-model="selectedTags"
            :tag-placeholder="tagPlaceholder"
            :placeholder="placeholder"
            label="name"
            track-by="name"
            :options="allTags"
            :multiple="true"
            :taggable="allowNew"
            @tag="tagCallback" />
    </div>
</template>

<script>
    import axios from 'axios'
    import _ from 'lodash'
    import helpers from '../../mixins/helpers'

    export default {
        mixins: [helpers],
        props: {
            value: Array,
            tags: {
                type: Array,
                default: null
            },
            allowNew: {
                type: Boolean,
                default: false
            }
        },

        data () {
            return {
                placeholder: this.allowNew ? 'Search or add a tag' : 'Search a tag',
                tagPlaceholder: this.allowNew ? 'Add this as new tag' : null,
                tagCallback: this.allowNew ? this.addTag : () => {},
                selectedTags: this.value
            }
        },

        watch: {
            value () {
                this.selectedTags = this.value;
            },

            selectedTags () {
                this.$emit('input', this.selectedTags);
            }
        },

        computed: {
            allTags () {
                return this.tags ? this.tags : _.get(this, '$store.state.allTags', []);
            }
        },

        mounted () {
            if (!this.tags)
                this.getAllTags();
        },

        methods: {
            addTag (newTag) {
                const tag = { name: newTag }
                this.$store.commit('setAllTags', [ ...this.allTags, tag ]);
                this.selectedTags.push(tag)
            },

            async getAllTags () {
                const response = await axios.get('/api/video/all-tags');
                this.$store.commit('setAllTags', response.data.tags);
            },

            selectAll () {
                this.selectedTags = this.allTags;
            },

            clearAll () {
                this.selectedTags = [];
            }
        }
    }
</script>