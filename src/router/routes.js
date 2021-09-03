const defaultView = () => import('../components/DefaultView')

const routes = [
    {
        path: '/',
        redirect: 'home',
        component: () => import(/* webpackChunkName: "index" */ '../views'),
        children: [
            {
                label: '主页',
                path: '/home',
                id: '1',
                component: () => import(/* webpackChunkName: "index" */ '../views/Home.vue'),
            },
            {
                label: 'echart',
                path: '/echart',
                id: '2',
                redirect: 'EchartMultiaxial',
                children: [
                    {
                        label: 'echart多轴',
                        path: 'EchartMultiaxial',
                        id: '2-1',
                        component: () => import(/* webpackChunkName: "echart" */ '../views/EchartMultiaxial.vue'),
                    },
                    {
                        label: '地图',
                        path: 'map',
                        id: '2-2',
                        component: () => import(/* webpackChunkName: "echart" */ '../views/echart/EchartGis.vue'),
                    },
                    {
                        label: '热力图',
                        path: 'hot-map',
                        id: '2-3',
                        component: () => import(/* webpackChunkName: "echart" */ '../views/echart/EchartHot.vue'),
                    },
                ],
            },
            {
                label: 'design-vue',
                path: '/ant-design-vue',
                id: '3',
                redirect: 'calendar',
                children: [
                    {
                        label: '日历周期设置',
                        path: 'calendar',
                        id: '3-1',
                        component: () => import(/* webpackChunkName: "calendar" */ '../views/CalendarDemo.vue'),
                    },
                ],
            },
            {
                label: '富文本编辑器',
                path: '/editor-tinymce',
                id: '4',
                component: () => import(/* webpackChunkName: "calendar" */ '../views/JEditor.vue'),
            },
            // {
            //     path: '/openlaers',
            //     name: 'openlaers',
            //     id: '2',
            // }
        ],
    },
]

let oneLevelRoutes = []

/**
 * 解析路由添加路由全路径，并且添加面包屑
 * @param routes
 * @param fatherRoutes
 */
function analyzeRoutes(routes, fatherRoutes) {
    routes.forEach((route) => {
        if (!route.component) {
            route.component = defaultView
        }
        if (route.component === defaultView) {
            route.isLeaf = true
        } else {
            route.isLeaf = false
        }

        let fullPath = fatherRoutes ? fatherRoutes.fullPath : ''
        if (fullPath === '/') fullPath = ''
        if (route.path.indexOf('/') !== 0) {
            fullPath = fullPath + '/' + route.path
        } else {
            fullPath = fullPath + route.path
        }
        route.fullPath = fullPath
        route.name = fullPath
        analyzeBreadcrumb(route, fatherRoutes)
        // 添加到oneLevelRoutes路由中
        oneLevelRoutes.push(route)
        if (route.children) {
            analyzeRoutes(route.children, route)
        }
    })
}

/**
 * 把面包屑解析到路由中
 * @param route
 * @param fatherRoutes
 */
function analyzeBreadcrumb(route, fatherRoutes) {
    // if (route.path === "/" || route.component === defaultView) {
    //     return;
    // }
    let breadcrumb = {
        label: route.label,
        component: route.component,
        isLeaf: route.isLeaf,
        id: route.id,
        path: route.path,
        fullPath: fatherRoutes ? fatherRoutes.fullPath + '/' + route.path : route.path,
    }
    if (fatherRoutes && fatherRoutes.component) {
        if (!fatherRoutes.breadcrumbs) fatherRoutes.breadcrumbs = []
        route.breadcrumbs = fatherRoutes.breadcrumbs.concat(breadcrumb)
    } else {
        route.breadcrumbs = [breadcrumb]
    }
}

/**
 * 解析路由，添加全路径和面包屑
 */
analyzeRoutes(routes[0].children)
export { routes, oneLevelRoutes }
