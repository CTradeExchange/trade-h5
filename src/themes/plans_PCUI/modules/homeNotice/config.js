import { common, img } from '@admin/components/baseConfig'
export default {
    title: '首页Notice',
    tag: 'homeNotice',
    tagIcon: 'el-icon-film',
    document: 'https://element.eleme.cn/#/zh-CN/component/input',
    listHidden: true,
    config: [
        {
            name: 'items',
            type: 'Array',
            label: '栅格元素',
            max: 6,
            config: [
                {
                    name: 'label',
                    label: '文字',
                    type: 'Input',
                    default: '默认文字'
                },
                {
                    name: 'href',
                    label: '跳转地址',
                    type: 'Href'
                },
            ]
        },
    ]
}
