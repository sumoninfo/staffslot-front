<template>
    <div class="autocomplete">
        <div class="form-control autocomplete-container" v-if="isMultiple">
            <span
                class="selected-item"
                v-for="(item, i) in selectedItems"
                :key="resolve(item, mapper.key)"
            >
                {{ resolve(item, mapper.title) }}
                <a class="remove"><i
                    class="fa fa-remove"
                    @click="removeItem(i)"
                ></i></a>
            </span>
            <input
                v-model="searchText"
                :placeholder="placeholder"
                type="text"
                class="type-field"
                @click="showResults"
                @blur="hideResults"
                @keydown.up="prevItem"
                @keydown.down="nextItem"
                @keydown.enter.prevent=""
                @keyup.enter.prevent="selectItem"
                @keyup.delete="removeLatestItem"
            >
        </div>
        <div v-if="!isMultiple">
            <input
                v-model="searchText"
                :placeholder="placeholder"
                type="text"
                class="form-control"
                @click="showResults"
                @blur="hideResults"
                @keydown.up="prevItem"
                @keydown.down="nextItem"
                @keydown.enter.prevent=""
                @keyup.enter.prevent="selectItem"
            >
        </div>
        <div
            v-if="resultsVisible"
            class="results dropdown"
        >
            <ul class="dropdown-menu scrollable-menu show">
                <li class="autocomplete-item"
                    v-for="(item, i) in filteredItems"
                    @mousedown.left="selectItem"
                    @mouseenter="setPointer(i)"
                    :key="resolve(item, mapper.key)"
                    :class="{'active': pointer == i}"
                >
                    <span v-if="mapper.icon" class='icon'><img class="image" :src="makeLink(resolve(item, mapper.icon))"></span>
                    <span v-text="resolve(item, mapper.title)"></span>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import helpers from '../../mixins/helpers'

export default {
    mixins: [helpers],
    props: {
        placeholder: {
            type: String,
            default: 'Please start typing'
        },
        items: {
            type: Array,
            default: []
        },
        isMultiple: {
            type: Boolean,
            default: false,
        },
        value: {
            type: [Object, Array],
            default: undefined
        },
        mapper: {
            key: {
                type: [String, Function],
                default: 'id'
            },
            title: {
                type: [String, Function],
                default: 'title'
            },
            icon: {
                type: [String, Function],
                default: 'icon'
            }
        }
    },
    data () {
        return {
            pointer: 0,
            searchText: null,
            resultsVisible: false
        }
    },
    computed: {
        filteredItems () {
            return this.searchText ? this.items.filter(val =>
                this.resolve(val, this.mapper.title)
                    .toLowerCase()
                    .includes(this.searchText)) : this.items
        },
        selectedItems () {
            return this.value
        }
    },
    watch: {
        searchText (val) {
            // this.showResults()
        }
    },
    methods: {
        showResults () {
            this.resultsVisible = true
        },
        hideResults () {
            this.resultsVisible = false
        },
        setPointer(i) {
            this.pointer = i;
        },
        prevItem () {
            if (this.pointer > 0)
                this.pointer--
            else
                this.pointer = this.filteredItems.length-1

            this.$el.getElementsByTagName('li')[this.pointer].scrollIntoViewIfNeeded()
        },
        nextItem () {
            if (this.pointer < this.filteredItems.length-1)
                this.pointer++
            else
                this.pointer = 0

            this.$el.getElementsByTagName('li')[this.pointer].scrollIntoViewIfNeeded()
        },
        selectItem () {
            const selectedItem = this.filteredItems[this.pointer]
            this.searchText = ''
            this.hideResults()

            if (this.isMultiple)
                return this.addItem(selectedItem)

            this.placeholder = this.resolve(selectedItem, this.mapper.title)
            this.$emit('input', selectedItem)
            this.$emit('close', selectedItem)
        },
        addItem (item) {
            const selectedItems = this.value ? JSON.parse(JSON.stringify(this.value)) : []
            selectedItems.push(item)
            this.$emit('input', selectedItems)
            this.$emit('close', selectedItems)
        },
        removeLatestItem () {
            if (!this.searchText) {
                this.removeItem(this.selectedItems.length-1)
            }
        },
        removeItem (index) {
            const items = JSON.parse(JSON.stringify(this.value));
            items.splice(index, 1);
            this.$emit('input', items);
            this.$emit('close', items)
        },
        resolve (obj, key) {
            if (typeof key === 'function')
                return key(obj)

            if (!key || $.trim(key) == '') return obj;

            key.split('.').forEach(function(seg) {
                if (typeof obj !== 'object' || obj[seg] === undefined) {
                    obj = undefined;
                    return obj;
                }
                obj = obj[seg];
            });
            return obj;
        },
        makeLink (file) {
            return (file && file.startsWith('http') === false) ? '/storage/uploads/' + file : file
        }
    }
}
</script>

<style scoped>
.autocomplete .icon .image {
    width: 30px;
}

.autocomplete .results li:hover {
    cursor: pointer;
}

.autocomplete .results .active {
    background-color: #41b883;
    border-radius: 3px;
    color: white;
}

.autocomplete .selected-item {
    position: relative;
    margin-right: 3px;
    border-radius: 3px;
    padding: 3px 16px 3px 3px;
    color: white;
    background-color: #41b883;
    overflow: hidden;
}

.autocomplete .selected-item a {
    position: absolute;
    right: 3px;
    top: 3px;
}

.autocomplete-container {
    display: flex;
}

.autocomplete .type-field {
    border: none;
    width: auto;
    flex-grow: 100;
}

.autocomplete .scrollable-menu {
    height: auto;
    max-height: 200px;
    overflow-x: hidden;
    padding: 10px;
    width: 100%;
}

.autocomplete .autocomplete-item {
    margin-bottom: 3px;
    padding: 3px;
}
</style>
