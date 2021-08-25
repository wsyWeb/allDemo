import { createApp } from 'vue'
import { camelCase, upperFirst } from 'lodash'
import Antd from 'ant-design-vue'
import App from './App'
import store from './store'
import router from './router'
import 'ant-design-vue/dist/antd.css'
import './common/common.less'
import './icons'

const app = createApp(App)
app.use(store)
app.use(Antd)
app.use(router)
app.mount('#app')
//引入全局组件
const requireComponent = require.context(
    // 其组件目录的相对路径
    './components/global',
    // 是否查询其子目录
    false,
    // 匹配基础组件文件名的正则表达式
    /[A-Z]\w+\.(vue|js)$/
)

requireComponent.keys().forEach((fileName) => {
    // 获取组件配置
    const componentConfig = requireComponent(fileName)
    // 获取组件的 upperFirst（将首字母转为大写）camelCase（去掉字母中间的-） 命名
    const componentName = upperFirst(
        camelCase(
            // 获取和目录深度无关的文件名
            fileName
                .split('/')
                .pop()
                .replace(/\.\w+$/, '')
        )
    )
    // 全局注册组件
    app.component(
        componentName,
        // 如果这个组件选项是通过 `export default` 导出的，
        // 那么就会优先使用 `.default`，
        // 否则回退到使用模块的根。
        componentConfig.default || componentConfig
    )
})
