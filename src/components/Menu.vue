<template>
    <a-layout-sider id="layout-menu " breakpoint="lg" collapsed-width="0">
        <div class="logo" />
        <a-menu
            theme="dark"
            mode="inline"
            class="menu"
            :inline-collapsed="collapsed"
            v-model:openKeys="openKeys"
            v-model:selectedKeys="selectedKeys"
            @click="onClick"
            @openChange="onOpenChange"
        >
            <template v-for="item in routes[0].children" :key="item.id">
                <a-menu-item v-if="!item.children || item.children.length === 0" :key="item.id">
                    <template #icon>
                        <PieChartOutlined />
                    </template>
                    <span class="nav-text">{{ item.label }}</span>
                </a-menu-item>
                <a-sub-menu v-else-if="item.children && item.children.length > 0" :key="item.id">
                    <template #icon>
                        <MailOutlined />
                    </template>
                    <template #title>{{ item.label }}</template>
                    <a-menu-item v-for="innerItem in item.children" :key="innerItem.id">
                        {{ innerItem.label }}
                    </a-menu-item>
                </a-sub-menu>
            </template>
        </a-menu>
    </a-layout-sider>
</template>
<script>
import { routes, oneLevelRoutes } from '../router/routes'
import { mapState } from 'vuex'
// import { defineComponent, reactive, toRefs, watch } from 'vue'
import { PieChartOutlined, MailOutlined } from '@ant-design/icons-vue'
// export default defineComponent({
//     setup() {
//         const state = reactive({
//             collapsed: false,
//             routes,
//             selectedKeys: ['1'],
//             openKeys: ['sub1'],
//             preOpenKeys: ['sub1'],
//         })

//         watch(
//             () => state.openKeys,
//             (val, oldVal) => {
//                 state.preOpenKeys = oldVal
//             }
//         )
//         const toggleCollapsed = () => {
//             state.collapsed = !state.collapsed
//             state.openKeys = state.collapsed ? [] : state.preOpenKeys
//         }

//         return {
//             ...toRefs(state),
//             toggleCollapsed,
//         }
//     },
export default {
    data() {
        return {
            routes,
            rootSubmenuKeys: [...routes[0].children.map((item) => item.id)],
        }
    },
    created() {},
    computed: {
        ...mapState({
            collapsed: (state) => state.collapsed,
            openKeys: (state) => state.openKeys,
            selectedKeys: (state) => state.selectedKeys,
            breadcrumbs: (state) => state.breadcrumbStore.breadcrumbs,
        }),
    },
    components: {
        PieChartOutlined,
        MailOutlined,
    },
    methods: {
        onClick(obj) {
            let selectedKeys = [obj.key]
            this.$store.commit('SET_SELECTED_KEYS', selectedKeys)
            // 选中菜单后跳转
            oneLevelRoutes.forEach((item) => {
                if (selectedKeys.indexOf(item.id) !== -1 && window.location.pathname !== item.fullPath) {
                    this.$router.replace(item.fullPath)
                }
            })
        },
        onOpenChange(openKeys) {
            const latestOpenKey = openKeys.find((key) => this.openKeys.indexOf(key) === -1)
            let keys = []
            if (this.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
                keys = openKeys
            } else {
                keys = latestOpenKey ? [latestOpenKey] : []
            }
            this.$store.commit('SET_OPEN_KEYS', keys)
        },
    },
}
</script>

<style>
.menu {
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
}

.ant-layout {
    flex: none;
}

.ant-layout-sider {
    background: transparent;
}

#layout-menu .trigger {
    font-size: 18px;
    line-height: 64px;
    padding: 0 24px;
    cursor: pointer;
    transition: color 0.3s;
}

#layout-menu .trigger:hover {
    color: #1890ff;
}

#layout-menu .logo {
    height: 32px;
    background: rgba(255, 255, 255, 0.2);
    margin: 16px;
}
</style>
