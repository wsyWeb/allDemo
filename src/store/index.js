import { createStore } from 'vuex'

export default createStore({
    state: {
        selectedKeys: [],
        user: {
            name: 'wsy',
            password: '888888',
        },
    },
    mutations: {
        SET_SELECTED_KEYS: function(state, selectedKeys) {
            state.selectedKeys = selectedKeys
        },
    },
    actions: {},
    modules: {},
})
