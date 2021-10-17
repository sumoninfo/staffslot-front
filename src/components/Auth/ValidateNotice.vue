<template>
    <div>
        <ul :style="styleUl">
            <li v-for="(item, index) in items" :key="index" class="error-notice">
                {{item}}
            </li>
        </ul>
    </div>
</template>

<script>
    export default {
        props: ['items', 'styleUl'],
    }
</script>
