import { createApp } from 'vue'
import Antd from 'ant-design-vue'
import App from './App'
import 'ant-design-vue/dist/antd.css'
import router from './router'

import './common/common.less'
import store from './store'

const app = createApp(App)
app.use(store)
app.use(Antd)
app.use(router)
app.mount('#app')
