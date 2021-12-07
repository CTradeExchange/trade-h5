export default {
    title: '注册类型',
    tag: 'registerType',
    include: ['mine'], // 包含的页面code
    config: [
        {
            name: 'typeSupport',
            label: '注册方式',
            type: 'Checkbox',
            default: ['mobile'],
            options: [
                { value: 'mobile', label: '手机号' },
                { value: 'email', label: '邮箱' },
            ],
        },
        {
            name: 'agreement_html',
            label: '协议内容',
            filterName: 'name',
            include: ['agreement'],
            default: '',
            type: 'Tinymce'
        }
    ]
}
