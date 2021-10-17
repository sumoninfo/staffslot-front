<template>
    <div
        tabindex="0"
        class="text-center"
        @keydown.up.prevent="prevItem"
        @keydown.left.prevent="prevItem"
        @keydown.down.prevent="nextItem"
        @keydown.right.prevent="nextItem"
        @keydown.space.prevent=""
        @keyup.space.prevent="select(filteredImages[pointer])"
        @blur="focused = false;">
        <img
            v-for="(image, i) in filteredImages"
            :key="image.id"
            :src="image.preview || image.url"
            @click="select(image, i)"
            style="width: 100px; object-fit: contain; cursor: pointer;"
            :class="{ selected: isSelected(image), focused: focused && i === pointer }"
            class="media image-preview"
        />
    </div>
</template>

<script>
    import { mapState, mapActions } from 'vuex';
    import helpers from '../mixins/helpers'

    export default {
        mixins: [helpers],
        props: {
            value: {
                type: [Object, Array],
                default: null
            },

            images: {
                type: [Array],
                default: null
            },

            multiple: {
                type: Boolean,
                default: false
            }
        },

        data () {
            return {
                selected: [],
                pointer: 0,
                focused: false,
                tags: []
            }
        },

        computed: {
            ...mapState({ _images: s => s.images.images }),

            filteredImages () {
                const source = this.images || this._images;
                const result = source.filter( x => !this.tags.length || this.intersectTags(x).length );
                this.selected = this.selected.filter(x => {
                    return result.find(y => x.id == y.id)
                });
                return result;
            }
        },

        created () {
            if (!this.images)
                this.fetchImages();
        },

        methods: {
            ...mapActions({ fetchImages: 'images/fetchImages' }),

            isSelected (image) {
                return this.selected.find( x => { return x ? x.id === image.id : false }) ? true : false;
            },

            select(image, i) {
                if (i) this.pointer = i;

                if (this.multiple) {
                    if (!this.isSelected(image)) {
                        this.selected.push(image);
                    } else {
                        this.selected = this.selected.filter( x => x ? x.id !== image.id : false );
                    }
                    this.$emit('update:modelValue', this.selected);
                } else {
                    if (!this.isSelected(image)) {
                        this.selected = [image];
                        this.$emit('update:modelValue', image);
                    } else {
                        this.selected = [];
                        this.$emit('update:modelValue', null);
                    }
                }
            },

            prevItem () {
                this.focused = true;

                if (this.pointer > 0)
                    this.pointer--
                else
                    this.pointer = this.filteredImages.length-1

                this.$el.getElementsByClassName('media')[this.pointer].scrollIntoViewIfNeeded()
            },

            nextItem () {
                this.focused = true;

                if (this.pointer < this.filteredImages.length-1)
                    this.pointer++
                else
                    this.pointer = 0

                this.$el.getElementsByClassName('media')[this.pointer].scrollIntoViewIfNeeded()
            },

            intersectTags (image) {
                const imageTags = image.tags.map(x => x.name);
                const selectedTags = this.tags.map(x => x.name);
                const intersection = imageTags.filter( x => selectedTags.includes(x));
                return intersection;
            }
        }
    }
</script>

<style scoped>
    .image-preview {
        display: inline-table;
    }

    .media {
        border: 3px solid transparent;
    }

    .media.selected {
        border: 3px solid #41b882 !important;
    }

    .media.focused {
        border: 3px solid #4182b8 !important;
        background-color: #4182b8 !important;
        color: #fff !important;
    }

    .media.selected.focused {
        border: 3px solid #41b882 !important;
    }
</style>
