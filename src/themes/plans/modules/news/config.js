import { img } from '@admin/components/baseConfig'
const config = {}
img.forEach(item => {
    config[item.name] = item
})
export default {
    title: '信息流',
    tag: 'news',
    exclude: ['Register', 'TradeIndex', 'Nav', 'mine'], // 排除的页面code
    tagIcon: 'el-icon-news',
    document: 'https://element.eleme.cn/#/zh-CN/component/input',
    config: [
        {
            name: 'orgid',
            label: 'orgid',
            type: 'Input',
        }
    ]
}
