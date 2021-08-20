import request from '../request'

export function apiTestApi(params) {
    return request({
        url: '/nhssp-p/platformAccount/naviList',
        method: 'get',
        params: params,
    })
}
