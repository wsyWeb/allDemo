export const mixinTable = {
    data() {
        return {
            //c_开头的数据会缓存
            c_tableData: [],
            c_pagination: {
                pageIndex: 1,
                pageSize: 10,
            },
            c_total: null,
            c_selectedRowKeys: [],
            c_selectedRows: [],
        }
    },
    methods: {
        // Table pagination分页事件
        onChangePage: function(pageIndex, pageSize) {
            console.log('onChangePage: ', pageIndex, pageSize)
            this.c_pagination = { ...this.c_pagination, pageIndex, pageSize }
            this._request()
        },
        // Table pagination pageSize大小改变事件
        onShowSizeChange: function(pageIndex, pageSize) {
            console.log('onShowSizeChange: ', pageIndex, pageSize)
            this.c_pagination = { ...this.c_pagination, pageIndex, pageSize }
            this._request()
        },
        // Table勾选事件
        onSelect: function(selectedRowKeys, selectedRows) {
            console.log('onSelect: ', selectedRowKeys, selectedRows)
            this.c_selectedRowKeys = selectedRowKeys
            this.c_selectedRows = selectedRows
        },
    },
}

export const mixinSearch = {
    data() {
        return {
            isFirstSearch: true,
        }
    },
    methods: {
        // Search回调事件
        onSearch: function(values) {
            let pagination = {
                ...this.c_pagination,
                ...values,
            }
            this.c_pagination = pagination
            if (this.isFirstSearch) {
                this.isFirstSearch = false
            } else {
                this._request()
            }
        },
    },
}
