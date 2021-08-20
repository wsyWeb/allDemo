<template>
    <a-input v-model:value="newVal" @keyup.enter="$emit('addItem')" @input="$emit('update:value', $event.target.value)"></a-input>
</template>

<script>
export default {
    props: ['modelValue'],
    data() {
        return {
            newVal: this.modelValue,
        }
    },
    created() {},
    mounted() {},
    methods: {},
}
</script>

<style scoped lang="less"></style>
