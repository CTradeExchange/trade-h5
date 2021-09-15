import { img } from '@admin/components/baseConfig'
export default {
    title: '个人信息',
    tag: 'minePerson',
    exclude: ['nav'], // 排除的页面code
    tagIcon: 'el-icon-user',
    document: 'https://element.eleme.cn/#/zh-CN/component/input',
    config: [
        {
            name: 'faceImg',
            label: '默认头像',
            type: 'File',
            default: ''
        },
        ...img,
    ]
}
