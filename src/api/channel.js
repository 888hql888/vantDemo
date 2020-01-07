// 负责处理所有的频道网络请求
import http from '../utils/http'

// 得到用户的频道数据
function apiGetChannels () {
    return http({
        url: '/user/channels'
    })
}

// 得到所有的频道数据
function apiGetAllChannles () {
    return http({
        url: '/channels'
    })
}

// 重置频道
function apiResetChannel (channels) {
    return http({
        url: '/user/channels',
        method: 'PUT',
        data: {
            channels: channels
        }
    })
}

// 按需导出
export { apiGetChannels, apiGetAllChannles, apiResetChannel }
