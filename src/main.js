import { createApp } from 'vue'
import Antd from 'ant-design-vue'
import App from './App'
import 'ant-design-vue/dist/antd.css'
import router from './router'

import './common/common.less'
import store from './store'

createApp(App)
    .use(store)
    .use(Antd)
    .use(router)
    .mount('#app')
