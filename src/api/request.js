import axios from 'axios'
import store from '../store'
import { baseUrl } from '../env'
import { errorCode } from './errorCode'
import { notification } from 'ant-design-vue'
// import router from '../router'

let instance = axios.create({
    baseURL: baseUrl,
    headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
    },
})

instance.interceptors.request.use(
    (config) => {
        console.log(config)
        config.headers.common['token'] = store.state.token
        return config
    },
    (err) => {
        return Promise.reject(err)
    }
)

let LAST_TIME = 0

instance.interceptors.response.use(
    (response) => {
        let result = response.data

        store.commit('hiddenLoading')

        if (result.code === 200) {
            return result
        } else {
            notification.error({ message: errorCode[result.code] || '服务器繁忙！' })
            return Promise.reject(result)
        }
    },
    (error) => {
        store.commit('hiddenLoading')

        let time = new Date().getTime()
        if (time - LAST_TIME > 500) {
            LAST_TIME = time
            switch (error.response.status) {
                case 401:
                    notification.error({ message: '用户未认证' })
                    // window.$vue.$notification.error({message: "登录超时！"});
                    // router.replace('/login') todo
                    // store.commit('LOGIN_OUT');
                    break
                default:
                    notification.error({ message: '服务器繁忙！' })
            }

            return Promise.reject(error.response.status)
        }
    }
)

async function request(options) {
    if (!options.url) new Error('请求必须要有url地址')
    if (!options.method) options.method = 'get'
    if (!options.params) options.params = {}
    // deleteNullKey(options.params);
    if (!options.headers) options.headers = {}
    store.commit('showLoading')

    let params = {
        url: options.url,
        method: options.method.toLowerCase(),
        headers: options.headers,
    }
    if (options.method.toLowerCase() === 'get') {
        params['params'] = options.params
    } else {
        // params['data'] = options.params == '' ? '' : qs.stringify(options.params);
        params['data'] = options.params
    }
    let result = await instance(params)
    return result
}

export default request
