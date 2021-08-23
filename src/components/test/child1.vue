<template>
    <div>
        {{ key }}
        <a-input :value="modelValue" @keyup="handleKeyUp($event)" @input="$emit('update:value', $event.target.value)"></a-input>
    </div>
</template>

<script>
export default {
    props: {
        modelValue: {
            type: String,
            default: '',
        },
        key: String,
    },
    data() {
        return {}
    },
    created() {},
    mounted() {},
    methods: {
        handleKeyUp(e) {
            if (e.code === 'Enter') {
                this.$emit('addItem')
            } else if (e.code === 'Delete') {
                this.$emit('removeItem')
            }
        },
    },
}
</script>

<style scoped lang="less"></style>
