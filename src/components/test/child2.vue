<template>
    <div class="demo-alert-box">
        <strong>Error!</strong>
        <slot></slot>
        <global-test></global-test>
        <a-button @click="$emit('update:startVisible', !startVisible)">点我测试回调</a-button>
    </div>
</template>

<script>
export default {
    props: ['startVisible'],
    data() {
        return {}
    },
    created() {},
    mounted() {},
    methods: {},
}
</script>

<style scoped lang="less"></style>
