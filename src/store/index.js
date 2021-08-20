import { createStore } from 'vuex'
// import createPersistedState from 'vuex-persistedstate'
import persistedState from 'vuex-persistedstate'
import Cookies from 'js-cookie' //如果使用cookie可以引入js-cookie

export default createStore({
    state: {
        requestPendingNum: 0,
        loading: false,
        selectedKeys: [],
        user: {
            name: 'wsy',
            password: '888888',
        },
    },
    mutations: {
        showLoading: function(state) {
            state.requestPendingNum++
            if (state.loading === false) state.loading = true
        },
        hiddenLoading: function(state) {
            state.requestPendingNum--
            if (state.requestPendingNum === 0) state.loading = false
        },
        SET_SELECTED_KEYS: function(state, selectedKeys) {
            state.selectedKeys = selectedKeys
        },
    },
    actions: {},
    modules: {},
    // plugins: [
    //     createPersistedState({
    //         storage: window.sessionStorage,
    //         reducer(val) {
    //             //该项配置为只缓存某个数据, 下列使用在cookie中也可使用
    //             return {
    //                 // 只储存state中的token
    //                 selectedKeys: val.selectedKeys,
    //             }
    //         },
    //     }),
    // ],

    //持久化存储数据
    plugins: [
        persistedState({
            storage: {
                getItem: (key) => Cookies.get(key),
                setItem: (key, value) => Cookies.set(key, value, { expires: 7 }),
                removeItem: (key) => Cookies.remove(key),
            },
        }),
    ],
})
