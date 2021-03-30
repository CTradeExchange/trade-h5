
import request from '@/utils/request'

/* 获取国家区号列表 */
export function getListByParentCode (data) {
    return request({
        url: '/global/config.OpenDictDubboService.getListByParentCode',
        method: 'post',
        data
    })
}
