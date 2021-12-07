export default {
    title: '注册类型',
    tagIcon: 'el-icon-open',
    // tagIcon: 'el-icon-basketball',
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
    ]
}
