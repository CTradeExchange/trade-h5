import { img } from '@admin/components/baseConfig'
export default {
    title: 'productsTimeSharing',//'分时图',
    tag: 'productsTimeSharing',
    // include: ['mine'], // 只有这些页面显示
    tagIcon: 'el-icon-s-marketing',
    document: 'https://element.eleme.cn/#/zh-CN/component/input',
    config: [
        {
            name: 'product',
            label: '产品ID',
            type: 'Product',
            default: {}
        }
    ]
}
