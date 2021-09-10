<template>
    <!-- padding-bottom: 20px;   -->
    <div style="margin-top: 10px; ">
        <a-table
            :pagination="false"
            :columns="my_columns"
            :data-source="data"
            :bordered="false"
            :rowKey="rowKey || 'id'"
            @expandedRowsChange="expandedRowsChange"
        />
        <!-- <a-table
            v-if="hasSelect"
            :pagination="false"
            :columns="my_columns"
            :data-source="data"
            :scroll="scroll"
            :bordered="false"
            :rowKey="rowKey || 'id'"
            :expandIconColumnIndex="expandIconColumnIndex || 0"
            :expandedRowKeys="expandedRowKeys || []"
            :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
            @expandedRowsChange="expandedRowsChange"
        />

        <a-table
            v-else
            :pagination="false"
            :columns="my_columns"
            :data-source="data"
            :bordered="false"
            :rowKey="rowKey || 'id'"
            :expandIconColumnIndex="expandIconColumnIndex || 0"
            :expandedRowKeys="expandedRowKeys || []"
            :scroll="scroll"
            @expandedRowsChange="expandedRowsChange"
        />

        <div class="m-t-md m-r-md text-right">
            <a-pagination
                v-if="hasPag"
                v-model="pageNum"
                :pageSize="pageSize"
                show-quick-jumper
                show-size-changer
                :total="total"
                show-less-items
                :show-total="(total) => `共${total || 0}条数据`"
                @showSizeChange="onShowSizeChange"
                @change="onChangePage"
            />
        </div> -->
    </div>
</template>
<script>
// import BaseComponent from '../base/BaseComponent'

export default {
    // extends: BaseComponent,
    props: [
        'data',
        'columns',
        'total',
        'scroll', // 基础数据
        'hasPag',
        'pagination', // 分页
        'hasSelect',
        'rowKey',
        'hasSelectAll',
        'selectedRowKeys',
        'selectedRows', // 勾选框
        'expandIconColumnIndex',
        'expandedRowKeys', // 在第几列展示展开图标， 展开的行
    ],
    data() {
        return {}
    },
    computed: {
        my_columns: function() {
            return this.columns.map((column) => {
                // if (!column['align'])
                //     column['align'] = 'center';
                return column
            })
        },
        pageNum: {
            get: function() {
                // return Math.ceil((this.pagination.pageIndex + this.pagination.pageSize) / this.pagination.pageSize);
                return this.pagination.pageIndex
            },
            set: function() {},
        },
        pageSize: function() {
            return this.pagination.pageSize
        },
    },
    methods: {
        onSelectChange(selectedRowKeys, selectedRows) {
            console.log('selectedRowKeys selectedRows: ', selectedRowKeys, selectedRows)
            this.$emit('onSelect', selectedRowKeys, selectedRows)
        },
        onChangePage(pageIndex, pageSize) {
            // let curStart = (pageIndex - 1) * pageSize;
            console.log('curStart, pageSize', pageIndex, pageSize)
            this.$emit('onChangePage', pageIndex, pageSize)
        },
        onShowSizeChange(pageIndex, pageSize) {
            console.log('curStart, pageSize', pageIndex, pageSize)
            this.$emit('onShowSizeChange', pageIndex, pageSize)
        },
        expandedRowsChange(expandedRowKeys) {
            this.$emit('expandedRowsChange', expandedRowKeys)
        },
    },
}
</script>

<style lang="less" scoped></style>
