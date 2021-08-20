import axios from 'axios'
import store from '../store'
// import {deleteNullKey} from "../utils/commonUtil";
import { baseUrl } from '../env'
import { errorCode } from '@/common/errorCode'
import router from '@/router'
// import qs from "qs";

let instance = axios.create({
    baseURL: baseUrl,
    headers: {
        'Content-Type': 'multipart/form-data',
        'Cache-Control': 'no-cache',
    },
})

instance.interceptors.request.use(
    (config) => {
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
            window.$vue.$notification.error({ message: errorCode[result.code] || '服务器繁忙！' })
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
                    // window.$vue.$notification.error({message: "登录超时！"});
                    router.replace('/login')
                    store.commit('LOGIN_OUT')
                    break
                default:
                    window.$vue.$notification.error({ message: '服务器繁忙！' })
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

    store.commit('showLoading')

    let params = {
        url: options.url,
        method: options.method.toLowerCase(),
    }
    let formData = new FormData()
    Object.keys(options.params).map((key) => {
        formData.append(key, options.params[key])
    })
    if (options.method.toLowerCase() === 'get') {
        params['params'] = formData
    } else {
        // params['data'] = options.params == '' ? '' : qs.stringify(options.params);
        params['data'] = formData
    }

    return await instance(params)
}

export default request
