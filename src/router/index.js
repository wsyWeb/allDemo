import { createRouter, createWebHistory } from 'vue-router'
// import store from '../store'
import { routes } from './routes'

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
})

/**
 * 路由拦截
 */
router.beforeEach((to, from, next) => {
    // let currentRoute = undefined
    // //拦截验证token
    // oneLevelRoutes.forEach((route) => {
    //     if (route.fullPath === to.fullPath) {
    //         // 未登录则跳转至login页面
    //         if (!store.state.token) {
    //             next({ path: '/login' })
    //         }

    //         currentRoute = route
    //         store.commit('SET_ROUTE', route)
    //         store.commit('breadcrumbStore/SET_BREADCRUMBS', route.breadcrumbs)
    //     }
    // })

    // if (!checkPermission(currentRoute)) {
    //     window.$vue.$notification.error({ message: '您没有此权限！' })
    //     return
    // }
    next()
})

export default router
