<template>
    <div class="col-12">
        <template v-for="(p,index) in packages" :key="'package_'+index">
            <package-item  :pkg="transform(p)"></package-item>
        </template>
    </div>
</template>

<script>
    import _transform from '../../transformers/package';
    import helpers from '../../mixins/helpers'

    export default {
        mixins: [helpers],
        name: "PackageList",
        props:['packages'],
        methods: {
            transform (p) {
                return _transform(p);
            }
        }
    }
</script>