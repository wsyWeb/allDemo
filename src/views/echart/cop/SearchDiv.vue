<template lang="">
    <div class="search-condition flex-center">
        <div :class="['item', timeType === 'all' ? 'active' : '']" @click="changeTime('all')">全部</div>
        <div :class="['item', timeType === 'year' ? 'active' : '']" @click="changeTime('year')">本年度</div>
        <div :class="['item', timeType === 'quarter' ? 'active' : '']" @click="changeTime('quarter')">本季度</div>
        <div :class="['item', timeType === 'month' ? 'active' : '']" @click="changeTime('month')">本月</div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            timeType: 'all',
        }
    },
    methods: {
        changeTime(type) {
            this.timeType = type
            this.$emit('changeTime', type)
        },
    },
}
</script>
<style lang="less" scoped>
.search-condition {
    overflow: hidden;
    .item {
        cursor: pointer;
        width: 100px;
        height: 30px;
        line-height: 34px;
        font-weight: bold;
        letter-spacing: 5px;
        text-align: center;
        margin-left: 10px;
        background-image: url('~@/assets/images/operation/btn.png');
        background-size: 100% 100%;
        background-repeat: no-repeat;
        &:first-child {
            margin-left: 0;
        }
        &.active {
            background-image: url('~@/assets/images/operation/btn-active.png');
            background-size: 100% 100%;
            background-repeat: no-repeat;
        }
    }
}
</style>
