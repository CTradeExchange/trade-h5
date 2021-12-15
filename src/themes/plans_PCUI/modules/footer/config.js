export default {
    title: '公共底部',
    tag: 'footer',
    include: ['footer'],
    tagIcon: 'el-icon-film',
    document: 'https://element.eleme.cn/#/zh-CN/component/input',
    config: [
        {
            name: 'moduleAlign',
            label: '对齐方式',
            type: 'Radio',
            default: 'full',
            options: [
                { value: 'center', label: '居中显示' },
                { value: 'full', label: '通栏显示' }
            ]
        },
        {
            name: 'logo',
            label: 'Logo图片',
            type: 'File',
            default: ''
        },
        {
            name: 'copyRight',
            label: 'copyRight',
            type: 'Input',
            default: '© 2021 Trade Switcher'
        },
    ]
}
