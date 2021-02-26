import { unzip } from '@/utils/util';
import request_wp from '@/utils/request_wp'

/* 获取页面配置信息*/
export function pageConfig(id) {
    const NODE_ENV = process.env.NODE_ENV;
    if(NODE_ENV==='production'){
        let data = '';
        switch(id){
            case 'SelfSymbolIndex':
                data = unzip(window['wp_SelfSymbolIndex'])
                break;
            case 'Nav':
                data = unzip(window['wp_Nav'])
                break;
            case 'Home':
                data = unzip(window['wp_Home'])
                break;
            case 'TradeIndex':
                data = unzip(window['wp_TradeIndex'])
                break;
            case 'PositionIndex':
                data = unzip(window['wp_PositionIndex'])
                break;
            case 'Mine':
                data = unzip(window['wp_Mine'])
                break;
            default:
                break;
        }
        if(data) return Promise.resolve(JSON.parse(data));
    }
    return request_wp(`/${id}.json?timestamp=${Date.now()}`).then(({content}) => {
        const reg=/^(\{|\[)/;
        content = reg.test(content) ? content:unzip(content);
        const data = typeof(content)==='string' ? JSON.parse(content) : content ;
        return data;
    })
}
